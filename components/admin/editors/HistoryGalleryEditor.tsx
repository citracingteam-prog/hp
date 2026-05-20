"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = { initial: HistoryEntry[] };

function blank(): HistoryEntry {
  return { year: "", event: "", headline: "", detail: "", photos: [] };
}

export function HistoryGalleryEditor({ initial }: Props) {
  const [rows, setRows] = useState<HistoryEntry[]>(initial);

  function updateAt(i: number, patch: Partial<HistoryEntry>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function updatePhotos(i: number, photos: string[]) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, photos } : r)));
  }

  function removeEntry(i: number) {
    if (!confirm("この年代を削除しますか？")) return;
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <SectionHeader
        title="GALLERY"
        actions={
          <>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, blank()])}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              ＋ 年代を追加
            </button>
            <SaveButton section="history" data={rows} />
          </>
        }
      />

      <div className="mt-6 flex flex-col gap-6">
        {rows.map((entry, i) => (
          <div key={i} className="border border-white/10 bg-racing-carbon p-5">
            {/* 年代編集フィールド */}
            <div className="mb-4">
              <label className="flex flex-col gap-1">
                <span className="font-display text-[9px] tracking-[0.25em] text-racing-white/50">年(西暦)</span>
                <input
                  value={entry.year}
                  onChange={(e) => updateAt(i, { year: e.target.value })}
                  placeholder="2024"
                  className="w-40 border border-white/15 bg-racing-black px-2 py-1 text-sm text-racing-white outline-none focus:border-racing-red"
                />
              </label>
            </div>

            {/* 写真グリッド */}
            {(entry.photos ?? []).length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-7">
                {(entry.photos ?? []).map((src, pi) => (
                  <div key={pi} className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updatePhotos(i, (entry.photos ?? []).filter((_, fi) => fi !== pi))
                      }
                      className="absolute right-0 top-0 hidden bg-red-600 px-1.5 py-0.5 font-display text-[10px] text-white group-hover:block"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <ImageUploader
                label="＋ 写真をアップロード"
                onUploaded={(path) => updatePhotos(i, [...(entry.photos ?? []), path])}
              />
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="border border-white/15 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-racing-white/40 transition-colors hover:border-red-500 hover:text-red-400"
              >
                年代を削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
