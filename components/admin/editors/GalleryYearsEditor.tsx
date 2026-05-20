"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type GalleryYear = { year: string; headline?: string; photos: string[] };

function blank(): GalleryYear {
  return { year: "", photos: [] };
}

export function GalleryYearsEditor({ initial }: { initial: GalleryYear[] }) {
  const [rows, setRows] = useState<GalleryYear[]>(initial);

  // 重複写真を検出（同じパスが複数の年度に存在する場合）
  const duplicatePhotos = useMemo(() => {
    const seen = new Map<string, string>(); // path -> year
    const dupes = new Set<string>();
    for (const row of rows) {
      for (const photo of row.photos) {
        if (seen.has(photo)) dupes.add(photo);
        else seen.set(photo, row.year);
      }
    }
    return dupes;
  }, [rows]);

  function updateAt(i: number, patch: Partial<GalleryYear>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addPhoto(i: number, path: string) {
    // 他の年度にすでに同じ写真があれば警告
    const existing = rows.find((r, idx) => idx !== i && r.photos.includes(path));
    if (existing) {
      if (!confirm(`この写真はすでに「${existing.year}年度」に登録されています。重複して追加しますか？`)) return;
    }
    setRows((prev) => prev.map((r, idx) =>
      idx === i ? { ...r, photos: [...r.photos, path] } : r
    ));
  }

  function removePhoto(i: number, pi: number) {
    setRows((prev) => prev.map((r, idx) =>
      idx === i ? { ...r, photos: r.photos.filter((_, fi) => fi !== pi) } : r
    ));
  }

  function removeEntry(i: number) {
    if (!confirm("この年度を削除しますか？")) return;
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <SectionHeader
        title="GALLERY（年度別写真）"
        actions={
          <>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, blank()])}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              ＋ 年度を追加
            </button>
            <SaveButton section="gallery-years" data={rows} onSaved={() => { setTimeout(() => window.location.reload(), 1500); }} />
          </>
        }
      />

      {duplicatePhotos.size > 0 && (
        <div className="mt-4 border border-yellow-500/50 bg-yellow-500/10 px-4 py-3">
          <p className="font-display text-[10px] tracking-[0.2em] text-yellow-400">
            ⚠ {duplicatePhotos.size}枚の写真が複数の年度に重複して登録されています。赤枠の写真を確認してください。
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {rows.map((entry, i) => (
          <div key={i} className="border border-white/10 bg-racing-carbon p-5">
            {/* 年度ヘッダー */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-6 bg-racing-red" />
                <input
                  value={entry.year}
                  onChange={(e) => updateAt(i, { year: e.target.value })}
                  placeholder="2024"
                  className="w-24 border-b border-white/20 bg-transparent font-display text-2xl font-bold tracking-widest text-racing-white outline-none focus:border-racing-red"
                />
                <span className="font-display text-[10px] text-racing-white/30">年度</span>
                <span className="font-display text-[10px] text-racing-white/25">
                  {entry.photos.length}枚
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="border border-white/15 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-racing-white/40 transition-colors hover:border-red-500 hover:text-red-400"
              >
                年度を削除
              </button>
            </div>

            {/* サムネイルグリッド（大きめ表示） */}
            {entry.photos.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {entry.photos.map((src, pi) => {
                  const isDupe = duplicatePhotos.has(src);
                  return (
                    <div key={pi} className={`group relative ${isDupe ? "ring-2 ring-yellow-500" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                      {isDupe && (
                        <div className="absolute left-0 top-0 bg-yellow-500 px-1.5 py-0.5 font-display text-[9px] text-black">
                          重複
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i, pi)}
                        className="absolute right-0 top-0 hidden bg-red-600 px-2 py-1 font-display text-xs text-white group-hover:block"
                      >
                        ✕ 削除
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 font-display text-[8px] text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {pi + 1} / {entry.photos.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <ImageUploader
              label="＋ 写真をアップロード"
              type="photo"
              onUploaded={(path) => addPhoto(i, path)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
