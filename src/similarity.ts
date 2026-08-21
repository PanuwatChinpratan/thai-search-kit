import { graphemes, normalizeThai, tokenizeThai } from "./normalize.js";
import type { MatchSignals } from "./types.js";

const problemPattern = /(?:ไม่สำเร็จ|ไม่ได้|ไม่ผ่าน|ล้มเหลว|มีปัญหา|ผิดพลาด)/u;

function dice<T>(left: Set<T>, right: Set<T>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let overlap = 0;
  for (const value of left) if (right.has(value)) overlap += 1;
  return (2 * overlap) / (left.size + right.size);
}

function ngrams(value: string, size = 3): Set<string> {
  const parts = graphemes(value);
  if (parts.length < size) return new Set(parts.length ? [parts.join("")] : []);
  return new Set(
    Array.from({ length: parts.length - size + 1 }, (_, index) =>
      parts.slice(index, index + size).join(""),
    ),
  );
}

function boundedDistance(left: string, right: string): number {
  const a = graphemes(left);
  const b = graphemes(right);
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= b.length; column += 1) {
      const substitution = previous[column - 1] ?? 0;
      const insertion = current[column - 1] ?? 0;
      const deletion = previous[column] ?? 0;
      current[column] = Math.min(
        insertion + 1,
        deletion + 1,
        substitution + (a[row - 1] === b[column - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length] ?? Math.max(a.length, b.length);
}

export function similaritySignals(query: string, target: string): MatchSignals {
  const normalizedQuery = normalizeThai(query);
  const normalizedTarget = normalizeThai(target);
  if (!normalizedQuery || !normalizedTarget) {
    return { exact: 0, containment: 0, tokens: 0, ngrams: 0, typo: 0 };
  }

  const exact = normalizedQuery === normalizedTarget ? 1 : 0;
  const shorterLength = Math.min(
    graphemes(normalizedQuery).length,
    graphemes(normalizedTarget).length,
  );
  const longerLength = Math.max(
    graphemes(normalizedQuery).length,
    graphemes(normalizedTarget).length,
  );
  const contains =
    normalizedQuery.includes(normalizedTarget) || normalizedTarget.includes(normalizedQuery);
  const containment = contains ? 0.72 + 0.28 * (shorterLength / longerLength) : 0;
  const tokens = dice(
    new Set(tokenizeThai(normalizedQuery)),
    new Set(tokenizeThai(normalizedTarget)),
  );
  const ngramScore = dice(ngrams(normalizedQuery), ngrams(normalizedTarget));
  const maxLength = Math.max(shorterLength, longerLength);
  const typo =
    maxLength > 0
      ? Math.max(0, 1 - boundedDistance(normalizedQuery, normalizedTarget) / maxLength)
      : 0;

  // A short “how” question should prefer instructions over troubleshooting.
  // Keep this language-level: it applies to every topic, not one FAQ category.
  const queryHasProblem = problemPattern.test(normalizedQuery);
  const targetHasProblem = problemPattern.test(normalizedTarget);
  const intentPenalty = queryHasProblem === targetHasProblem ? 1 : queryHasProblem ? 0.82 : 0.72;

  return {
    exact,
    containment: containment * intentPenalty,
    tokens: tokens * intentPenalty,
    ngrams: ngramScore * intentPenalty,
    typo: typo * intentPenalty,
  };
}

export function combineSignals(signals: MatchSignals): number {
  if (signals.exact === 1) return 1;
  return Math.min(
    1,
    signals.containment * 0.24 +
      signals.tokens * 0.34 +
      signals.ngrams * 0.27 +
      signals.typo * 0.15,
  );
}
