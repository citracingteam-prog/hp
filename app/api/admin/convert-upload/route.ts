import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitBinaryFile } from "@/lib/admin/github";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_EXT = new Set([".ai", ".tiff", ".tif", ".pdf"]);

async function convertTiff(bytes: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  return sharp(bytes).png().toBuffer();
}

async function convertWithPython(tmpIn: string, tmpOut: string): Promise<void> {
  const { execSync } = await import("child_process");
  const scriptPath = path.join(process.cwd(), "scripts", "convert-image.py");
  execSync(`python "${scriptPath}" "${tmpIn}" "${tmpOut}"`, { timeout: 30000 });
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
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "20MB 超" }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "ai/tiff/pdf のみ可" }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let pngBytes: Buffer;

  try {
    if (ext === ".tiff" || ext === ".tif") {
      // sharp で変換（本番環境でも動作）
      pngBytes = await convertTiff(bytes);
    } else {
      // PDF/AI: Python で変換（ローカルのみ）
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "PDF/AI の変換はローカル環境のみ対応しています。JPG または PNG に変換してからアップロードしてください。" },
          { status: 400 }
        );
      }
      const tmpDir = os.tmpdir();
      const tmpIn = path.join(tmpDir, `upload_in_${Date.now()}${ext}`);
      const tmpOut = path.join(tmpDir, `upload_out_${Date.now()}.png`);
      try {
        fs.writeFileSync(tmpIn, bytes);
        await convertWithPython(tmpIn, tmpOut);
        pngBytes = fs.readFileSync(tmpOut);
      } finally {
        if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn);
        if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      }
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "変換失敗" },
      { status: 500 }
    );
  }

  const filename = `${Date.now()}-${path.basename(file.name, ext)}.png`;
  const uploadPath = `public/uploads/${filename}`;

  try {
    await commitBinaryFile({
      path: uploadPath,
      bytes: pngBytes,
      message: `content: upload converted image ${filename} via admin`,
    });

    try {
      const localDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
      fs.writeFileSync(path.join(localDir, filename), pngBytes);
    } catch {
      // ローカル書き込み失敗は無視
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "GitHub コミット失敗" },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: `/uploads/${filename}` });
}
