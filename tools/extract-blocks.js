import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Change later if you move content into ./docs
const CONTENT_ROOT = ".";

const OUTPUT_DIR = ".blockcache";

const BLOCK_REGEX =
  /<MakeCodeBlocks\s+target="([^"]+)"\s*>([\s\S]*?)<\/MakeCodeBlocks>/g;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeCode(code) {
  return decodeEntities(code)
    .replace(/\r\n/g, "\n")
    .trim();
}

function computeHash(target, source) {
  return crypto
    .createHash("sha256")
    .update(target)
    .update("\n")
    .update(source)
    .digest("hex")
    .substring(0, 16);
}

function walk(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {

    if (entry.isDirectory()) {

      if (
        entry.name === ".git" ||
        entry.name === "node_modules" ||
        entry.name === ".vitepress" ||
        entry.name === ".blockcache" ||
        entry.name === "dist"
      ) {
        continue;
      }

      files.push(
        ...walk(path.join(dir, entry.name))
      );
    }
    else if (
      entry.name.endsWith(".md") ||
      entry.name.endsWith(".mdx")
    ) {
      files.push(
        path.join(dir, entry.name)
      );
    }
  }

  return files;
}

function extractBlocks(filePath) {

  const content =
    fs.readFileSync(filePath, "utf8");

  const snippets = [];

  let match;

  while ((match = BLOCK_REGEX.exec(content)) !== null) {

    const target = match[1];

    const source =
      normalizeCode(match[2]);

    const hash =
      computeHash(target, source);

    snippets.push({
      hash,
      target,
      source,
      file: filePath
    });
  }

  return snippets;
}

function main() {

  ensureDir(OUTPUT_DIR);

  const files =
    walk(CONTENT_ROOT);

  const snippetMap =
    new Map();

  for (const file of files) {

    const snippets =
      extractBlocks(file);

    for (const snippet of snippets) {

      if (!snippetMap.has(snippet.hash)) {

        snippetMap.set(
          snippet.hash,
          {
            hash: snippet.hash,
            target: snippet.target,
            source: snippet.source,
            uses: 1,
            files: [snippet.file]
          }
        );
      }
      else {

        const existing =
          snippetMap.get(snippet.hash);

        existing.uses++;

        if (
          !existing.files.includes(
            snippet.file
          )
        ) {
          existing.files.push(
            snippet.file
          );
        }
      }
    }
  }

  const results =
    [...snippetMap.values()]
      .map(entry => {

        entry.files.sort();

        entry.svg =
          `/blocksvg/${entry.hash}.svg`;

        return entry;
      })
      .sort((a, b) =>
        a.hash.localeCompare(b.hash)
      );

  fs.writeFileSync(
    path.join(
      OUTPUT_DIR,
      "blocklist.json"
    ),
    JSON.stringify(
      results,
      null,
      2
    )
  );

  console.log(
    `Found ${results.length} unique snippets`
  );

  console.log(
    `Wrote ${OUTPUT_DIR}/blocklist.json`
  );
}

main();