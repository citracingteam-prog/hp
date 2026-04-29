"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";

export type GalleryItem = { src: string; caption: string };

type Props = { initial: GalleryItem[] };

export function GalleryEditor({ initial }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initial);

  function updateCaption(index: number, caption: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption } : item)),
    );
  }

  function handleUploaded(path: string) {
    setItems((prev) => [...prev, { src: path, caption: "" }]);
  }

  return (
    <div>
      <SectionHeader
        title="GALLERY"
        actions={
          <>
            <ImageUploader onUploaded={handleUploaded} />
            <SaveButton section="gallery" data={items} />
          </>
        }
      />

      <p className="mb-4 text-xs text-racing-white/60">
        ギャラリーページに表示する画像を管理します。↑↓ で並べ替えできます。
      </p>

      <SortableList<GalleryItem>
        items={items}
        getKey={(item, i) => `${item.src}-${i}`}
        onChange={setItems}
        renderItem={(item, i, controls) => (
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt=""
              className="h-20 w-28 shrink-0 object-cover"
            />
            <div className="flex flex-1 flex-col gap-1">
              <div className="truncate font-mono text-[11px] text-racing-white/50">
                {item.src}
              </div>
              <input
                type="text"
                value={item.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="キャプション（任意）"
                className="border border-white/15 bg-white/5 px-2 py-1 text-xs text-racing-white placeholder:text-racing-white/30 focus:border-racing-red focus:outline-none"
              />
            </div>
            {controls}
          </div>
        )}
      />

      {items.length === 0 && (
        <div className="mt-4 border border-dashed border-white/15 p-8 text-center text-sm text-racing-white/50">
          画像がありません。「画像をアップロード」から追加してください。
        </div>
      )}
    </div>
  );
}
