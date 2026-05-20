import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function sanitizeName(filename) {
  const noExt = filename.replace(/\.[^.]+$/, "");
  return noExt.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) results.push(full);
  }
  return results;
}

// Boxの元写真をスキャン
const boxDir = "C:/Users/maruc/Box/ciso24178/CIT-Racing-Website/写真";
const boxPhotos = walkDir(boxDir);
const boxLookup = new Map();
for (const f of boxPhotos) {
  const key = sanitizeName(path.basename(f));
  boxLookup.set(key, f);
}

// gallery-years.jsonから写真パスを取得
const galleryJson = JSON.parse(fs.readFileSync(path.join(ROOT, "content/gallery-years.json"), "utf-8"));
const uploadPaths = galleryJson.flatMap(y => y.photos ?? []).filter(p => p.startsWith("/uploads/"));

let replaced = 0;
for (const p of uploadPaths) {
  const filename = p.replace("/uploads/", "");
  const basePart = filename.replace(/^\d+-/, "").replace(/\.(png|jpg|jpeg)$/i, "");
  const original = boxLookup.get(basePart);
  if (!original) { console.log(`SKIP (not found): ${basePart}`); continue; }

  const destPath = path.join(ROOT, "public", p);
  try {
    // 元の高画質ファイルをPNGとして保存（リサイズなし）
    await sharp(original).png({ quality: 100, compressionLevel: 6 }).toFile(destPath);
    replaced++;
    console.log(`✓ ${path.basename(original)} → ${filename}`);
  } catch (e) {
    console.error(`✗ ${filename}: ${e.message}`);
  }
}

console.log(`\n完了: ${replaced}件を高画質に差し替えました`);
