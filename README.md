# Thai Search Kit

[![CI](https://github.com/PanuwatChinpratan/thai-search-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/PanuwatChinpratan/thai-search-kit/actions/workflows/ci.yml)

Fast, typo-tolerant Thai search for TypeScript. No API key, model download, runtime dependency, or
network request.

> Status: `0.1.0` foundation release. The public API is intentionally small while ranking quality is
> validated against a reproducible Thai benchmark.

## Why

Thai support search often starts with exact string matching and jumps straight to an LLM when that
fails. Thai Search Kit fills the useful middle: deterministic local retrieval that understands Thai
word boundaries, common question forms, and small typing mistakes.

```text
query → normalize → Thai tokens → field scoring → typo signals → ranked results
```

## Try it

```bash
git clone https://github.com/PanuwatChinpratan/thai-search-kit.git
cd thai-search-kit
npm install
npm run dev
```

The library is not published to npm yet. The first public release will be tagged after the API has
been validated in real projects.

## Use

```ts
import { createThaiSearch } from 'thai-search-kit';

const search = createThaiSearch([
  {
    id: 'payment.methods',
    category: 'การชำระเงิน',
    title: 'รองรับการชำระเงินแบบใด',
    keywords: ['ช่องทางจ่ายเงิน', 'รับบัตรไหม'],
    content: 'รองรับบัตร พร้อมเพย์ และโมบายแบงก์กิ้ง',
  },
]);

const [result] = search.search('ชำระเงินไง');

console.log(result?.document.id); // payment.methods
console.log(result?.score); // 0..1
console.log(result?.matchedFields); // explainable field matches
```

## What it handles

- Thai-aware word and grapheme segmentation through `Intl.Segmenter`
- punctuation, whitespace, zero-width characters, and Thai digits
- general colloquial question forms such as `ยังไง`, `อยู่ไหน`, and `เมื่อไหร่`
- weighted title, category, keyword, and content fields
- token, character n-gram, containment, and edit-distance signals
- deterministic scores, confidence labels, and match explanations

It does not contain business-specific intent rules and does not generate answers.

## Quality

```bash
npm test
npm run benchmark
```

The included benchmark contains 60 Thai queries across shipping, returns, payment, orders,
warranty, accounts, and documents. The current baseline is **90% Top-1 accuracy** and CI fails below
the documented 85% quality floor.

## Stack

- TypeScript 7 library with zero runtime dependencies
- React 19 + Vite 8 playground
- Tailwind CSS 4 for the interface
- Vitest for behaviour tests and benchmark assertions
- Biome for formatting and linting
- GitHub Actions for CI

## Develop

```bash
npm install
npm run dev
npm run check
npm run typecheck
npm test
npm run benchmark
npm run build:all
```

## Principles

- Free and local by default
- Small public API
- Zero runtime dependencies
- Ranking changes require benchmark evidence
- Low confidence should become suggestions, not invented answers

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md) before contributing.

## License

MIT
