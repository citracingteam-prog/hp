import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitBinaryFile } from "@/lib/admin/github";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
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

  const bytes = Buffer.from(await file.arrayBuffer());
  const ts = Date.now();
  const filename = `${ts}-${sanitizeFilename(file.name || "upload")}`;
  const path = `public/uploads/${filename}`;

  try {
    await commitBinaryFile({
      path,
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
