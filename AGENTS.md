# AGENTS.md

This file governs every AI or automation agent working in this repository.

## Product intent

Thai Search Kit is a small, dependency-free search library for Thai text. It must remain fast,
deterministic, explainable, and useful without an API key, model download, or network request.

## Workflow

- Never commit or push directly to `main` or `develop`.
- Branch from updated `develop` using `feature/`, `fix/`, `docs/`, `test/`, or `chore/`.
- Merge work branches into `develop`; merge `develop` into `main` only for a release.
- Use Conventional Commit subjects and keep pull requests focused.
- Preserve user changes and never rewrite shared history.

## Engineering rules

- Keep the core package free of runtime dependencies.
- Search must be deterministic: equal inputs and options produce equal ordered results.
- Do not add topic-specific business rules to the engine. Language normalization may be general,
  documented, and covered by tests.
- Preserve Thai grapheme clusters when generating character n-grams.
- Avoid hidden global state and mutation of caller-provided documents.
- Public types are compatibility-sensitive; document breaking changes.
- Benchmark quality and latency before changing ranking weights.

## Frontend rules

- Keep the playground a thin consumer of the public package API.
- Maintain keyboard navigation, visible focus, readable contrast, and responsive layouts.
- Do not add a component framework for a page this small.

## Required checks

```bash
npm run check
npm run typecheck
npm test
npm run benchmark
npm run build:all
```

## Definition of done

- Changed behaviour has tests and benchmark coverage.
- All required checks pass.
- README examples compile against the public API.
- No secrets, private data, generated output, or unrelated files are committed.
- The pull request explains behaviour, verification, and compatibility impact.
