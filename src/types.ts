export type SearchDocument<T = unknown> = {
  id: string;
  title: string;
  category?: string;
  keywords?: string[];
  content?: string;
  metadata?: T;
};

export type FieldWeights = {
  title: number;
  category: number;
  keywords: number;
  content: number;
};

export type SearchOptions = {
  limit?: number;
  threshold?: number;
  weights?: Partial<FieldWeights>;
};

export type MatchSignals = {
  exact: number;
  containment: number;
  tokens: number;
  ngrams: number;
  typo: number;
};

export type Confidence = "high" | "medium" | "low";

export type SearchResult<T = unknown> = {
  document: SearchDocument<T>;
  score: number;
  confidence: Confidence;
  matchedFields: Array<keyof FieldWeights>;
  signals: MatchSignals;
};
