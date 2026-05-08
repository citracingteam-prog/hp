import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitBinaryFile } from "@/lib/admin/github";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_EXT = new Set([".ai", ".tiff", ".tif"]);

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "ローカル環境専用の機能です" }, { status: 403 });
  }
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
    return NextResponse.json({ error: "ai/tiff のみ可" }, { status: 415 });
  }

  const tmpDir = os.tmpdir();
  const tmpIn = path.join(tmpDir, `upload_in_${Date.now()}${ext}`);
  const tmpOut = path.join(tmpDir, `upload_out_${Date.now()}.png`);

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tmpIn, bytes);

    const scriptPath = path.join(process.cwd(), "scripts", "convert-image.py");
    execSync(`python "${scriptPath}" "${tmpIn}" "${tmpOut}"`, { timeout: 30000 });

    const pngBytes = fs.readFileSync(tmpOut);
    const filename = `${Date.now()}-${path.basename(file.name, ext)}.png`;
    const uploadPath = `public/uploads/${filename}`;

    await commitBinaryFile({
      path: uploadPath,
      bytes: pngBytes,
      message: `content: upload converted image ${filename} via admin`,
    });

    fs.writeFileSync(path.join(process.cwd(), "public", "uploads", filename), pngBytes);

    return NextResponse.json({ path: `/uploads/${filename}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "変換失敗" },
      { status: 500 }
    );
  } finally {
    if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn);
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
  }
}
