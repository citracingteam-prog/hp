import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitBinaryFile } from "@/lib/admin/github";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

async function optimizeLogo(bytes: Buffer, mime: string): Promise<Buffer> {
  // SVG・GIF はそのまま返す
  if (mime === "image/svg+xml" || mime === "image/gif") return bytes;
  try {
    return await sharp(bytes)
      .trim({ threshold: 30 })          // 余白を自動トリミング
      .resize(512, 256, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();
  } catch {
    return bytes;
  }
}

function findDuplicate(bytes: Buffer): string | null {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) return null;
  const inHash = createHash("sha256").update(bytes).digest("hex");
  for (const file of fs.readdirSync(uploadsDir)) {
    try {
      const existing = fs.readFileSync(path.join(uploadsDir, file));
      if (createHash("sha256").update(existing).digest("hex") === inHash) {
        return `/uploads/${file}`;
      }
    } catch {
      // 読み込み失敗は無視
    }
  }
  return null;
}

export async function POST(req: Request) {
  if (!readSessionFromRequest(req)) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "不正なリクエスト" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file が添付されていません" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "jpg/png/webp/svg/gif のみ可" }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "10MB 超" }, { status: 413 });
  }

  const rawBytes = Buffer.from(await file.arrayBuffer());

  const duplicate = findDuplicate(rawBytes);
  if (duplicate) {
    return NextResponse.json({ error: `同じ画像がすでにアップロードされています: ${duplicate}`, duplicate }, { status: 409 });
  }

  const uploadType = new URL(req.url).searchParams.get("type");
  const bytes = uploadType === "photo" ? rawBytes : await optimizeLogo(rawBytes, file.type);

  const ts = Date.now();
  const baseName = sanitizeFilename(file.name || "upload");
  const isLogoConvert = uploadType !== "photo" && file.type !== "image/svg+xml" && file.type !== "image/gif";
  const filename = isLogoConvert
    ? `${ts}-${baseName.replace(/\.[^.]+$/, "")}.png`
    : `${ts}-${baseName}`;
  const filePath = `public/uploads/${filename}`;

  try {
    await commitBinaryFile({
      path: filePath,
      bytes,
      message: `content: upload image ${filename} via admin`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "アップロード失敗" },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: `/uploads/${filename}` });
}
