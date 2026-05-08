"use client";

import { useState } from "react";
import type { Company } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = { initial: Company[] };

export function SponsorsEditor({ initial }: Props) {
  const [companies, setCompanies] = useState<Company[]>(initial);
  const [query, setQuery] = useState("");

  function add() {
    setCompanies((prev) => [...prev, { name: "" }]);
  }
  function update(j: number, patch: Partial<Company>) {
    setCompanies((prev) => prev.map((c, i) => (i === j ? { ...c, ...patch } : c)));
  }
  function remove(j: number) {
    setCompanies((prev) => prev.filter((_, i) => i !== j));
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= companies.length) return;
    const next = companies.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setCompanies(next);
  }

  const filtered = query
    ? companies.map((c, i) => ({ c, i })).filter(({ c }) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : companies.map((c, i) => ({ c, i }));

  return (
    <div>
      <SectionHeader
        title="SPONSORS"
        actions={
          <>
            <button
              type="button"
              onClick={add}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              + 追加
            </button>
            <SaveButton section="sponsors" data={companies} />
          </>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="スポンサー名で検索..."
          className="w-72 border border-white/15 bg-racing-black px-3 py-1.5 text-sm text-racing-white outline-none focus:border-racing-red placeholder:text-racing-white/30"
        />
        {query && (
          <span className="text-xs text-racing-white/50">
            {filtered.length} / {companies.length} 件
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map(({ c: company, i: j }) => (
          <li
            key={j}
            className="flex flex-col gap-2 border border-white/10 bg-white/[0.02] p-3"
          >
            {/* 会社名 + 並べ替え + 削除 */}
            <div className="flex items-center gap-2">
              <input
                value={company.name}
                placeholder="会社名"
                onChange={(e) => update(j, { name: e.target.value })}
                className="flex-1 border border-white/15 bg-racing-black px-2 py-1 text-sm text-racing-white outline-none focus:border-racing-red"
              />
              <button
                type="button"
                onClick={() => move(j, j - 1)}
                disabled={j === 0}
                aria-label="上へ"
                className="border border-white/15 px-2 py-1 text-xs text-racing-white/70 transition-colors hover:border-racing-red disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(j, j + 1)}
                disabled={j === companies.length - 1}
                aria-label="下へ"
                className="border border-white/15 px-2 py-1 text-xs text-racing-white/70 transition-colors hover:border-racing-red disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(j)}
                className="border border-white/15 px-2 py-1 text-xs text-red-400 transition-colors hover:border-red-500"
              >
                削除
              </button>
            </div>

            {/* URL */}
            <input
              value={company.url ?? ""}
              placeholder="URL（例: https://example.com/）"
              onChange={(e) => update(j, { url: e.target.value })}
              className="w-full border border-white/15 bg-racing-black px-2 py-1 font-mono text-xs text-racing-white/80 outline-none focus:border-racing-red"
            />

            {/* ロゴ */}
            <div className="flex items-center gap-3">
              {company.logo ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-20 items-center justify-center border border-white/15 bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => update(j, { logo: undefined })}
                    className="border border-white/15 px-2 py-1 text-[10px] text-red-400 transition-colors hover:border-red-500"
                  >
                    ロゴ削除
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-racing-white/40">ロゴなし</span>
              )}
              <ImageUploader
                label={company.logo ? "ロゴを変更" : "ロゴをアップロード"}
                onUploaded={(path) => update(j, { logo: path })}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
