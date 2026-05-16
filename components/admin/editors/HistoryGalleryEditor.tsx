"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = { initial: HistoryEntry[] };

export function HistoryGalleryEditor({ initial }: Props) {
  const [rows, setRows] = useState<HistoryEntry[]>(initial);

  function updatePhotos(i: number, photos: string[]) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, photos } : r)));
  }

  return (
    <div>
      <SectionHeader
        title="GALLERY"
        actions={<SaveButton section="history" data={rows} />}
      />

      <div className="mt-6 flex flex-col gap-6">
        {rows.map((entry, i) => (
          <div key={i} className="border border-white/10 bg-racing-carbon p-5">
            {/* Entry header */}
            <div className="mb-4 flex items-center gap-4">
              <span className="font-display text-base tracking-[0.3em] text-racing-white">
                {entry.year}
              </span>
              {entry.event && (
                <span className="font-display text-[11px] tracking-[0.3em] text-racing-red">
                  {entry.event}
                </span>
              )}
              <span className="font-display text-sm text-racing-white/50">
                {entry.headline}
              </span>
              <span className="ml-auto font-display text-[10px] text-racing-white/30">
                {(entry.photos ?? []).length} 枚
              </span>
            </div>

            {/* Photo grid */}
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
                        updatePhotos(
                          i,
                          (entry.photos ?? []).filter((_, fi) => fi !== pi),
                        )
                      }
                      className="absolute right-0 top-0 hidden bg-red-600 px-1.5 py-0.5 font-display text-[10px] text-white group-hover:block"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload */}
            <ImageUploader
              label="＋ 写真をアップロード"
              onUploaded={(path) =>
                updatePhotos(i, [...(entry.photos ?? []), path])
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
