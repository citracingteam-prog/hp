"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type GalleryYear = { year: string; headline?: string; photos: string[] };

function blank(): GalleryYear {
  return { year: "", photos: [] };
}

export function GalleryYearsEditor({ initial }: { initial: GalleryYear[] }) {
  const [rows, setRows] = useState<GalleryYear[]>(initial);

  function updateAt(i: number, patch: Partial<GalleryYear>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addPhoto(i: number, path: string) {
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
            <SaveButton section="gallery-years" data={rows} />
          </>
        }
      />

      <div className="mt-6 flex flex-col gap-6">
        {rows.map((entry, i) => (
          <div key={i} className="border border-white/10 bg-racing-carbon p-5">
            <div className="mb-4">
              <label className="flex flex-col gap-1">
                <span className="font-display text-[9px] tracking-[0.25em] text-racing-white/50">年（西暦）</span>
                <input
                  value={entry.year}
                  onChange={(e) => updateAt(i, { year: e.target.value })}
                  placeholder="2024"
                  className="w-40 border border-white/15 bg-racing-black px-2 py-1 text-sm text-racing-white outline-none focus:border-racing-red"
                />
              </label>
            </div>

            {entry.photos.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-7">
                {entry.photos.map((src, pi) => (
                  <div key={pi} className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i, pi)}
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
                type="photo"
                onUploaded={(path) => addPhoto(i, path)}
              />
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="border border-white/15 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-racing-white/40 transition-colors hover:border-red-500 hover:text-red-400"
              >
                年度を削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
