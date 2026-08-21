# Thai Search Kit

[![CI](https://github.com/PanuwatChinpratan/thai-search-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/PanuwatChinpratan/thai-search-kit/actions/workflows/ci.yml)

General-purpose, typo-tolerant Thai search for TypeScript. Use the same small engine for products,
documents, commands, help content, or chat retrieval—without an API key or network request.

**[Open the live playground](https://panuwatchinpratan.github.io/thai-search-kit/)**

> Status: `0.1.0` foundation release. The public API is intentionally small while ranking quality is
> validated against a reproducible Thai benchmark.

## Why

Thai search often starts with exact string matching and jumps straight to an LLM when that fails.
Thai Search Kit fills the useful middle: deterministic local retrieval that understands Thai word
boundaries, common question forms, and small typing mistakes.

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

The library is not published to npm yet. Use the `v0.1.0` GitHub release for the current stable
source while the public API is validated in real projects.

## Use

```ts
import { createThaiSearch } from 'thai-search-kit';

const search = createThaiSearch([
  {
    id: 'product.white-shirt',
    category: 'สินค้า',
    title: 'เสื้อเชิ้ตสีขาวสำหรับทำงาน',
    keywords: ['เสื้อทำงาน', 'เชิ้ตขาว', 'เสื้อออฟฟิศ'],
    content: 'เสื้อเชิ้ตผ้าคอตตอนทรง regular fit',
  },
]);

const [result] = search.search('เสื้อทำงานสีขาว');

console.log(result?.document.id); // product.white-shirt
console.log(result?.score); // 0..1
console.log(result?.matchedFields); // explainable field matches
```

## Use it anywhere

| Data you index | What it becomes |
| --- | --- |
| Products and keywords | Product search |
| Help articles and answers | FAQ or LINE OA retrieval |
| Documents and policies | Internal knowledge search |
| App actions and aliases | Command palette |
| Retrieved text before an LLM | Local-first RAG retrieval |

The engine does not need to know the business domain. You provide documents with `title`,
`keywords`, and `content`; it returns ranked matches with confidence and explainable signals.

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
