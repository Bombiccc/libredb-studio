# Profiling sparse result cells

## Scenario

`benchmark.ts` repeatedly converts one 128-entry Milvus-style sparse result cell with `sparseFromCell(cell, "index-map")`. It warms up for 2,000 calls, then measures seven rounds of 5,000 calls each. The checksum verifies that both versions produce the same values. This is a synthetic workload for comparing this function, not an estimate of whole-page speed.

Runtime: Bun 1.4.2 on Windows. Baseline source: `origin/main` at `b68d29ba`. Timings below were measured without profiler overhead. Each row is the median of seven rounds in a separate process; the baseline and changed version were run alternately.

| Process | Baseline, ms / 5,000 calls | Changed, ms / 5,000 calls |
| --- | ---: | ---: |
| 1 | 256.4 | 219.5 |
| 2 | 247.5 | 227.4 |
| 3 | 284.4 | 230.3 |
| Median of processes | **256.4** | **227.4** |

The median decreased by **29.0 ms, or 11.3%** for 5,000 conversions. The checksum was `234422.00000000236` in both versions.

## Reproduce

Run `bun research/sparse-cell-profiling/benchmark.ts` on the baseline source and on the changed branch. For the profile, add the Bun flags shown above. The baseline measurements used the original `sparse.ts` copied from `origin/main`; the temporary copy was removed after measurement. The existing sparse-vector test file and a new large-key ordering test pass with `bun test tests/unit/db/vector/sparse.test.ts`.
