// Entry program for "Convince the AI Judge to Visit Your House".
// The invitation image is pre-rendered and bundled next to this file;
// this program simply places a copy of it at the output path the
// grader reads. It needs nothing but the Node standard library.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Competition gate: the output must be a whole PNG/JPEG of at most 1 MiB.
const MAX_OUTPUT_BYTES = 1024 * 1024;

const here = dirname(fileURLToPath(import.meta.url));
const bundledImage = join(here, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set; cannot write entry.png");
}

if (!existsSync(bundledImage)) {
  throw new Error(`bundled image is missing: ${bundledImage}`);
}

const outPath = join(outDir, "entry.png");
mkdirSync(outDir, { recursive: true });
copyFileSync(bundledImage, outPath);

// Sanity-check the file we just wrote: it must exist, be non-empty,
// and stay under the competition's 1 MiB gate. Fail loudly instead of
// silently handing the grader a broken or oversized entry.
let outSize;
try {
  outSize = statSync(outPath).size;
} catch {
  throw new Error(`output file is missing after copy: ${outPath}`);
}
if (outSize === 0) {
  throw new Error(`output file is empty: ${outPath}`);
}
if (outSize > MAX_OUTPUT_BYTES) {
  throw new Error(
    `output file is ${outSize} bytes, over the 1 MiB limit (${MAX_OUTPUT_BYTES} bytes): ${outPath}`,
  );
}
console.log(`wrote ${outPath} (${outSize} bytes)`);
