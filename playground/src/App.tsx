import { useMemo, useState } from "react";
import { benchmarkCases, supportDocuments } from "../../benchmark/data";
import { createThaiSearch, normalizeThai, tokenizeThai } from "../../src";

const search = createThaiSearch(supportDocuments);
const examples = ["ชำระเงินไง", "ส่งของกี่วันถืง", "ใบเสร็จอยู่ไหน", "จำพาสเวิร์ดไม่ได้"];

const confidenceLabel = {
  high: "ชัดเจน",
  medium: "ใกล้เคียง",
  low: "ควรให้เลือก",
} as const;

const confidenceStyle = {
  high: "border-mint text-mint",
  medium: "border-gold text-gold",
  low: "border-salmon text-salmon",
} as const;

export function App() {
  const [query, setQuery] = useState("ส่งของกี่วันถืง");
  const results = useMemo(() => search.search(query, { limit: 4 }), [query]);
  const tokens = useMemo(() => tokenizeThai(query), [query]);
  const top = results[0];

  return (
    <main className="relative mx-auto w-full max-w-360 overflow-hidden px-5 text-ink md:px-[5vw]">
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-15" aria-hidden="true" />

      <header className="grid h-18 grid-cols-[1fr_auto] items-center border-ink border-b text-[11px] uppercase tracking-[.14em] md:h-23 md:grid-cols-[1fr_auto_1fr]">
        <a
          className="flex items-center gap-3 font-semibold text-inherit no-underline"
          href="https://github.com/PanuwatChinpratan/thai-search-kit"
        >
          <span className="grid size-8.5 place-items-center rounded-full bg-ink font-display text-lg text-paper">
            ท
          </span>
          <span>Thai Search Kit</span>
        </a>
        <div className="hidden opacity-55 md:block">LAB NOTE / 001</div>
        <a
          className="justify-self-end text-inherit underline underline-offset-5"
          href="https://github.com/PanuwatChinpratan/thai-search-kit"
        >
          GitHub ↗
        </a>
      </header>

      <section className="relative grid min-h-153 grid-cols-1 items-center gap-14 py-14 md:grid-cols-[minmax(0,1fr)_280px] md:gap-[8vw] md:py-18">
        <div className="pointer-events-none absolute -top-[12%] right-[-24%] -z-10 rotate-8 font-display text-[300px] text-red/7 md:-top-[18%] md:right-[20%] md:text-[520px]">
          ก
        </div>
        <div>
          <p className="flex items-center text-[11px] font-semibold uppercase tracking-[.18em] before:mr-3 before:h-0.5 before:w-10 before:bg-red before:content-['']">
            ค้นภาษาไทยแบบ local-first
          </p>
          <h1 className="my-5 font-display text-[clamp(66px,18vw,156px)] leading-[.82] tracking-[-.06em] md:text-[clamp(72px,11vw,156px)]">
            ค้นไทย
            <br />
            <em className="ml-[7vw] whitespace-nowrap font-normal text-red not-italic md:ml-[13vw]">
              ให้เจอ
            </em>
          </h1>
          <p className="max-w-148 text-[clamp(18px,2vw,25px)] font-light leading-[1.55]">
            รองรับภาษาพูดและคำพิมพ์ผิด โดยไม่ส่งข้อความออกจากเครื่อง ไม่ใช้โมเดล และไม่เสียค่า API
          </p>
        </div>

        <aside
          className="mb-3 w-55 rotate-2 self-end justify-self-end border border-ink bg-cream/60 p-6 text-[11px] uppercase tracking-[.08em] shadow-[10px_10px_0_#d84c35] md:mb-8 md:w-auto"
          aria-label="Project metrics"
        >
          <span className="block font-display text-5xl leading-none text-green">
            {benchmarkCases.length}
          </span>
          <span>Thai benchmark queries</span>
          <hr className="my-4 border-ink/20 border-t" />
          <span className="block font-display text-5xl leading-none text-green">0</span>
          <span>runtime dependencies</span>
        </aside>
      </section>

      <section
        className="-mx-5 bg-ink px-5 py-13 text-cream md:-mx-[5vw] md:px-[5vw] md:py-16"
        aria-labelledby="playground-title"
      >
        <div className="mb-11 flex items-end justify-between">
          <div className="flex items-baseline gap-6">
            <span className="text-[11px] text-red tracking-[.14em]">01</span>
            <h2
              id="playground-title"
              className="font-display text-[clamp(36px,5vw,66px)] leading-none tracking-[-.04em]"
            >
              ลองค้นจริง
            </h2>
          </div>
          <span className="hidden items-center text-[10px] tracking-[.16em] sm:flex">
            <i className="mr-2 block size-2 animate-pulse-soft rounded-full bg-mint shadow-[0_0_0_4px_rgba(121,214,157,.12)]" />
            LIVE INDEX
          </span>
        </div>

        <label className="block border-cream/40 border-b pb-4">
          <span className="mb-3 block text-[11px] text-cream/55 tracking-[.12em]">
            คำถามภาษาไทย
          </span>
          <div className="flex items-center gap-4">
            <input
              className="w-full border-0 bg-transparent text-[clamp(28px,5vw,60px)] font-light text-cream caret-red outline-0 placeholder:text-cream/20"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ลองพิมพ์คำถาม หรือพิมพ์ผิดก็ได้"
              autoComplete="off"
            />
            <kbd className="hidden whitespace-nowrap rounded border border-cream/30 px-2 py-1 text-[11px] text-cream/50 sm:block">
              ⌘ K
            </kbd>
          </div>
        </label>

        <fieldset className="my-4 mb-13 flex flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">ตัวอย่างคำค้น</legend>
          {examples.map((example) => (
            <button
              className="cursor-pointer rounded-full border border-cream/25 bg-transparent px-3.5 py-2 text-cream transition duration-200 hover:-translate-y-0.5 hover:bg-cream hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-cream focus-visible:text-ink focus-visible:outline-0"
              type="button"
              key={example}
              onClick={() => setQuery(example)}
            >
              {example}
            </button>
          ))}
        </fieldset>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(180px,.65fr)_minmax(0,2fr)] md:gap-[5vw]">
          <div className="min-w-0 border-cream/20 border-t pt-5 pb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[.18em]">NORMALIZED</span>
            <code className="my-3 block [overflow-wrap:anywhere] text-[17px] text-salmon">
              {normalizeThai(query) || "—"}
            </code>
            <div className="flex flex-wrap gap-1.5">
              {tokens.map((token) => (
                <span
                  className="border border-cream/25 px-2 py-1 text-[10px] uppercase tracking-[.08em]"
                  key={token}
                >
                  {token}
                </span>
              ))}
            </div>
          </div>

          <div className="border-cream/20 border-t" aria-live="polite">
            {results.length === 0 ? (
              <div className="py-10 text-cream/60">ยังไม่พบผลลัพธ์ที่มั่นใจ ลองเพิ่มรายละเอียดอีกนิด</div>
            ) : (
              results.map((result, index) => (
                <article
                  className={`grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-cream/15 border-b py-6 transition duration-200 hover:pl-2 hover:opacity-100 md:grid-cols-[42px_minmax(0,1fr)_auto] md:gap-5 ${index === 0 ? "opacity-100" : "opacity-60"}`}
                  key={result.document.id}
                >
                  <div className="font-display text-red leading-[1.4]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-cream/55">
                      <span>{result.document.category}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 ${confidenceStyle[result.confidence]}`}
                      >
                        {confidenceLabel[result.confidence]}
                      </span>
                    </div>
                    <h3 className="mt-2 mb-1 text-[21px] font-medium">{result.document.title}</h3>
                    <p className="mt-0 mb-3 text-cream/60">{result.document.metadata?.answer}</p>
                    <div className="flex flex-wrap gap-1">
                      {result.matchedFields.map((field) => (
                        <span
                          className="border border-cream/20 px-1.5 py-0.5 text-[10px] text-cream/50 uppercase tracking-[.08em]"
                          key={field}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden min-w-17 text-right md:block">
                    <strong className="block font-display text-3xl leading-none">
                      {Math.round(result.score * 100)}
                    </strong>
                    <span className="text-[10px] text-cream/40">/100</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-18 md:py-25">
        <div className="flex items-baseline gap-6">
          <span className="text-[11px] text-red tracking-[.14em]">02</span>
          <h2 className="font-display text-[clamp(36px,5vw,66px)] leading-none tracking-[-.04em]">
            อธิบายได้ทุกคะแนน
          </h2>
        </div>
        <ol className="mt-14 grid list-none grid-cols-1 border-ink border-t p-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["normalize", "จัดรูปแบบคำและเลขไทย โดยไม่ทำลายสระหรือวรรณยุกต์"],
            ["segment", "ตัดคำและ grapheme ภาษาไทยด้วยมาตรฐานของ JavaScript"],
            ["rank", "รวม token, n-gram, typo และน้ำหนักของแต่ละ field"],
            ["decide", "คืน confidence และเหตุผล เพื่อให้แอปเลือกตอบหรือถามกลับ"],
          ].map(([title, description], index) => (
            <li
              className={`min-h-44 border-ink/20 px-0 pt-5 sm:min-h-52 sm:px-6 ${index % 2 === 0 ? "sm:border-r" : ""} lg:border-r lg:first:pl-0 lg:last:border-r-0`}
              key={title}
            >
              <span className="font-display text-[22px] text-red">{title}</span>
              <p className="leading-[1.6] opacity-70">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="flex min-h-21 flex-col items-start justify-center gap-3 border-ink border-t text-[10px] tracking-[.14em] sm:flex-row sm:items-center sm:justify-between">
        <span>MIT LICENSE · BUILT IN THAILAND</span>
        <span>{top ? `TOP MATCH: ${top.document.id}` : "NO MATCH"}</span>
      </footer>
    </main>
  );
}
