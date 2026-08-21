import { combineSignals, similaritySignals } from "./similarity.js";
import type {
  Confidence,
  FieldWeights,
  MatchSignals,
  SearchDocument,
  SearchOptions,
  SearchResult,
} from "./types.js";

const defaultWeights: FieldWeights = {
  title: 3,
  category: 1.2,
  keywords: 2.4,
  content: 0.65,
};

type PreparedField = {
  name: keyof FieldWeights;
  values: string[];
  weight: number;
};

function roundScore(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

function confidenceFor(score: number, margin: number): Confidence {
  if (score >= 0.78 && margin >= 0.08) return "high";
  if (score >= 0.48 && margin >= 0.035) return "medium";
  return "low";
}

function maxSignals(query: string, values: string[]): MatchSignals {
  const empty: MatchSignals = { exact: 0, containment: 0, tokens: 0, ngrams: 0, typo: 0 };
  return values.reduce((best, value) => {
    const current = similaritySignals(query, value);
    return combineSignals(current) > combineSignals(best) ? current : best;
  }, empty);
}

export class ThaiSearchIndex<T = unknown> {
  private readonly documents: Array<SearchDocument<T>>;

  constructor(documents: Array<SearchDocument<T>>) {
    const ids = new Set<string>();
    this.documents = documents.map((document) => {
      if (!document.id.trim()) throw new Error("Document id must not be empty");
      if (ids.has(document.id)) throw new Error(`Duplicate document id: ${document.id}`);
      ids.add(document.id);
      return structuredClone(document);
    });
  }

  search(query: string, options: SearchOptions = {}): Array<SearchResult<T>> {
    const weights = { ...defaultWeights, ...options.weights };
    const threshold = options.threshold ?? 0.16;
    const limit = Math.max(1, options.limit ?? 5);
    const scored = this.documents
      .map((document) => this.scoreDocument(query, document, weights))
      .filter((result) => result.score >= threshold)
      .sort(
        (left, right) =>
          right.score - left.score || left.document.id.localeCompare(right.document.id),
      );

    return scored.slice(0, limit).map((result, index) => {
      const nextScore = scored[index + 1]?.score ?? 0;
      return {
        ...result,
        confidence: confidenceFor(result.score, result.score - nextScore),
      };
    });
  }

  private scoreDocument(
    query: string,
    document: SearchDocument<T>,
    weights: FieldWeights,
  ): SearchResult<T> {
    const fields: PreparedField[] = [
      { name: "title", values: [document.title], weight: weights.title },
      {
        name: "category",
        values: document.category ? [document.category] : [],
        weight: weights.category,
      },
      { name: "keywords", values: document.keywords ?? [], weight: weights.keywords },
      {
        name: "content",
        values: document.content ? [document.content] : [],
        weight: weights.content,
      },
    ];
    let weightedScore = 0;
    let activeWeight = 0;
    let strongestSignals: MatchSignals = {
      exact: 0,
      containment: 0,
      tokens: 0,
      ngrams: 0,
      typo: 0,
    };
    const matchedFields: Array<keyof FieldWeights> = [];

    for (const field of fields) {
      if (field.values.length === 0 || field.weight <= 0) continue;
      const signals = maxSignals(query, field.values);
      const fieldScore = combineSignals(signals);
      activeWeight += field.weight;
      weightedScore += fieldScore * field.weight;
      if (fieldScore >= 0.28) matchedFields.push(field.name);
      if (combineSignals(signals) > combineSignals(strongestSignals)) strongestSignals = signals;
    }

    const average = activeWeight > 0 ? weightedScore / activeWeight : 0;
    const strongest = combineSignals(strongestSignals);
    const score = roundScore(Math.min(1, average * 0.55 + strongest * 0.45));
    return {
      document,
      score,
      confidence: "low",
      matchedFields,
      signals: strongestSignals,
    };
  }
}

export function createThaiSearch<T = unknown>(
  documents: Array<SearchDocument<T>>,
): ThaiSearchIndex<T> {
  return new ThaiSearchIndex(documents);
}
