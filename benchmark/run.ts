import { performance } from "node:perf_hooks";
import { createThaiSearch } from "../src/index.js";
import { benchmarkCases, supportDocuments } from "./data.js";

const index = createThaiSearch(supportDocuments);
const startedAt = performance.now();
const misses: Array<{ query: string; expected: string; actual: string | undefined }> = [];

for (const item of benchmarkCases) {
  const actual = index.search(item.query, { limit: 1 })[0]?.document.id;
  if (actual !== item.expected) misses.push({ ...item, actual });
}

const duration = performance.now() - startedAt;
const accuracy = (benchmarkCases.length - misses.length) / benchmarkCases.length;

console.log(`Cases: ${benchmarkCases.length}`);
console.log(`Top-1 accuracy: ${(accuracy * 100).toFixed(1)}%`);
console.log(`Total: ${duration.toFixed(2)} ms`);
console.log(`Average: ${(duration / benchmarkCases.length).toFixed(3)} ms/query`);

if (misses.length > 0) console.table(misses);
if (accuracy < 0.85) process.exitCode = 1;
