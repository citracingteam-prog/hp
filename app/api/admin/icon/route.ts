import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitBinaryFile } from "@/lib/admin/github";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

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
  if (file.type !== "image/png") {
    return NextResponse.json({ error: "PNG のみ可" }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "5MB 超" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // ローカルのファイルも更新（開発環境用）
  try {
    const localPath = path.join(process.cwd(), "app", "icon.png");
    fs.writeFileSync(localPath, bytes);
  } catch {
    // ローカル書き込み失敗は無視（本番では不要）
  }

  try {
    await commitBinaryFile({
      path: "app/icon.png",
      bytes,
      message: "content: update site icon via admin",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "GitHub コミット失敗" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
