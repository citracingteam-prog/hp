import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/lib/admin/require-session";
import { commitTextFile, getTextFileContent } from "@/lib/admin/github";
import fs from "fs";
import nodePath from "path";

const ALLOWED_SECTIONS = ["hero-images", "members", "history", "races", "sponsors", "gallery", "gallery-years", "sponsor-descriptions", "special-thanks"] as const;
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

  const now = new Date().toISOString().replace("T", " ").slice(0, 16);

  // sponsor-descriptions: fetch latest sponsors.json from GitHub and merge only descriptions
  if (body.section === "sponsor-descriptions") {
    const current = await getTextFileContent("content/sponsors.json").catch(() => null);
    if (!current) {
      return NextResponse.json({ error: "sponsors.json が取得できませんでした" }, { status: 500 });
    }
    let existing: Array<{ name: string; description?: string; [key: string]: unknown }>;
    try {
      existing = JSON.parse(current);
    } catch {
      return NextResponse.json({ error: "sponsors.json のパースに失敗しました" }, { status: 500 });
    }
    const incoming = body.data as Array<{ name: string; description?: string }>;
    const descMap = new Map(incoming.map((c) => [c.name, c.description]));
    const merged = existing.map((c) => ({
      ...c,
      ...(descMap.has(c.name) ? { description: descMap.get(c.name) } : {}),
    }));
    try {
      await commitTextFile({
        path: "content/sponsors.json",
        content: JSON.stringify(merged, null, 2) + "\n",
        message: `content: update sponsor-descriptions via admin (${now})`,
      });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "GitHub コミット失敗" },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  const content = JSON.stringify(body.data, null, 2) + "\n";
  const path = `content/${body.section}.json`;

  // 開発環境ではローカルファイルも即時更新してホームに反映
  if (process.env.NODE_ENV === "development") {
    const localPath = nodePath.join(process.cwd(), path);
    fs.writeFileSync(localPath, content, { encoding: "utf8", flag: "w" });
  }

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
