import { describe, expect, test } from "vitest";
import { benchmarkCases, supportDocuments } from "../benchmark/data.js";
import { createThaiSearch, graphemes, normalizeThai, tokenizeThai } from "../src/index.js";

describe("Thai normalization", () => {
  test("normalizes Thai digits, punctuation, and polite particles", () => {
    expect(normalizeThai("  ค่าส่ง ๕๐ บาท!? ")).toBe("ค่าส่ง 50 บาท");
    expect(tokenizeThai("ส่งของกี่วันครับ")).not.toContain("ครับ");
  });

  test("maps general colloquial question forms without topic rules", () => {
    expect(normalizeThai("ชำระเงินยังไง")).toContain("วิธี");
    expect(normalizeThai("ใบเสร็จอยู่ไหน")).toContain("สถานที่");
    expect(normalizeThai("ของถึงเมื่อไหร่")).toContain("เวลา");
  });

  test("keeps Thai grapheme clusters intact", () => {
    expect(graphemes("น้ำ").join("")).toBe("น้ำ");
  });
});

describe("ThaiSearchIndex", () => {
  const index = createThaiSearch(supportDocuments);

  test("returns exact and explainable results", () => {
    const result = index.search("คืนสินค้าได้ภายในกี่วัน")[0];
    expect(result?.document.id).toBe("returns.window");
    expect(result?.signals.exact).toBe(1);
    expect(result?.matchedFields).toContain("title");
  });

  test("handles colloquial wording without a topic-specific engine rule", () => {
    expect(index.search("ชำระเงินไง")[0]?.document.id).toBe("payment.methods");
  });

  test("tolerates common typing mistakes", () => {
    expect(index.search("ระยะเวลารับประกัณ")[0]?.document.id).toBe("warranty.period");
    expect(index.search("ดาวโหลดใบเส็ด")[0]?.document.id).toBe("document.receipt");
  });

  test("does not mutate caller documents", () => {
    const documents = structuredClone(supportDocuments);
    const snapshot = structuredClone(documents);
    createThaiSearch(documents).search("ตามของ");
    expect(documents).toEqual(snapshot);
  });

  test("rejects duplicate ids", () => {
    const first = supportDocuments[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(() => createThaiSearch([first, first])).toThrow("Duplicate document id");
  });

  test("meets the benchmark quality floor", () => {
    const correct = benchmarkCases.filter(
      (item) => index.search(item.query, { limit: 1 })[0]?.document.id === item.expected,
    ).length;
    expect(correct / benchmarkCases.length).toBeGreaterThanOrEqual(0.85);
  });
});
