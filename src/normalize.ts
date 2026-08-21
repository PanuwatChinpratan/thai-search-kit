const thaiDigits = new Map([
  ["๐", "0"],
  ["๑", "1"],
  ["๒", "2"],
  ["๓", "3"],
  ["๔", "4"],
  ["๕", "5"],
  ["๖", "6"],
  ["๗", "7"],
  ["๘", "8"],
  ["๙", "9"],
]);

const politeParticles = new Set(["ครับ", "ค่ะ", "คะ", "จ้า", "จ้ะ", "หน่อย", "ที", "นะ", "อะ", "อ่ะ"]);

const conceptPatterns: Array<[RegExp, string]> = [
  [/(?:ยังไง|อย่างไร|ทำไง|แบบไหน|แบบใด|วิธีไหน|วิธีอะไร)/gu, " วิธี "],
  [/(?:อยู่ไหน|ที่ไหน|ตรงไหน)/gu, " สถานที่ "],
  [/(?:เมื่อไหร่|เมื่อไร|กี่วัน|นานไหม)/gu, " เวลา "],
  [/(?:เท่าไหร่|เท่าไร|กี่บาท)/gu, " จำนวน "],
];

const wordSegmenter = new Intl.Segmenter("th", { granularity: "word" });
const graphemeSegmenter = new Intl.Segmenter("th", { granularity: "grapheme" });

export function normalizeThai(value: string): string {
  const digitsNormalized = [...value.normalize("NFC")]
    .map((character) => thaiDigits.get(character) ?? character)
    .join("");
  return conceptPatterns
    .reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), digitsNormalized)
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/gu, "")
    .replace(/[\p{P}\p{S}\s]+/gu, " ")
    .trim();
}

export function tokenizeThai(value: string): string[] {
  const normalized = normalizeThai(value);
  const tokens = [...wordSegmenter.segment(normalized)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment.trim())
    .filter((token) => token.length > 0 && !politeParticles.has(token));
  return [...new Set(tokens)];
}

export function graphemes(value: string): string[] {
  return [...graphemeSegmenter.segment(normalizeThai(value))].map((part) => part.segment);
}
