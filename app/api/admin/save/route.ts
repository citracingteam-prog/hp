import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitTextFile } from "@/lib/admin/github";

const ALLOWED_SECTIONS = ["hero-images", "members", "history", "races", "sponsors", "gallery"] as const;
type Section = (typeof ALLOWED_SECTIONS)[number];

function isAllowedSection(v: unknown): v is Section {
  return typeof v === "string" && (ALLOWED_SECTIONS as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  if (!readSessionFromRequest(req)) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  let body: { section?: unknown; data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正な JSON" }, { status: 400 });
  }

  if (!isAllowedSection(body.section)) {
    return NextResponse.json({ error: "不正なセクション" }, { status: 400 });
  }
  if (body.data === undefined) {
    return NextResponse.json({ error: "data がありません" }, { status: 400 });
  }

  const content = JSON.stringify(body.data, null, 2) + "\n";
  const path = `content/${body.section}.json`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 16);

  try {
    await commitTextFile({
      path,
      content,
      message: `content: update ${body.section} via admin (${now})`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "GitHub コミット失敗" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
