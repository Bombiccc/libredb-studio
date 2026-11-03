import { sparseFromCell } from "../../src/lib/db/vector/sparse";

const cell: Record<string, number> = {};
for (let index = 127; index >= 0; index--) cell[String(index * 3)] = index / 10;

const warmup = 2_000;
const iterations = 5_000;
const rounds = 7;
let checksum = 0;

function run(count: number): number {
  const started = performance.now();
  for (let iteration = 0; iteration < count; iteration++) {
    const vector = sparseFromCell(cell, "index-map");
    if (!vector || vector.indices.length !== 128) throw new Error("Unexpected sparse vector result");
    checksum += vector.values[iteration % vector.values.length];
  }
  return performance.now() - started;
}

run(warmup);
const timesMs = Array.from({ length: rounds }, () => run(iterations));
const medianMs = [...timesMs].sort((a, b) => a - b)[Math.floor(rounds / 2)];
console.log(JSON.stringify({ entries: 128, warmup, iterations, rounds, timesMs, medianMs, checksum }));
