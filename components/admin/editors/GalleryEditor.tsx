"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";

export type GalleryItem = { src: string; caption: string; category: string };

type Props = { initial: GalleryItem[] };

const CATEGORY_SUGGESTIONS = [
  "大会", "走行テスト", "製作", "活動", "イベント", "その他",
];

export function GalleryEditor({ initial }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initial);

  function updateField<K extends keyof GalleryItem>(
    index: number,
    key: K,
    value: GalleryItem[K],
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function handleUploaded(path: string) {
    setItems((prev) => [...prev, { src: path, caption: "", category: "" }]);
  }

  // カテゴリーごとの件数を表示
  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = item.category || "未分類";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader
        title="HIGHLIGHT"
        actions={
          <>
            <ImageUploader onUploaded={handleUploaded} />
            <SaveButton section="gallery" data={items} />
          </>
        }
      />

      <p className="mb-2 text-xs text-racing-white/60">
        ハイライトページに表示する画像を管理します。カテゴリーで場所・イベントを分類してください。
      </p>

      {/* Category summary */}
      {Object.keys(categoryCounts).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span
              key={cat}
              className="border border-white/15 px-2 py-0.5 font-display text-[10px] tracking-widest text-racing-white/60"
            >
              {cat} <span className="text-racing-red">{count}</span>
            </span>
          ))}
        </div>
      )}

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
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="truncate font-mono text-[11px] text-racing-white/40">
                {item.src}
              </div>
              {/* Category */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updateField(i, "category", e.target.value)}
                  placeholder="カテゴリー（例: 大会、走行テスト）"
                  list={`cat-suggestions-${i}`}
                  className="border border-racing-red/40 bg-white/5 px-2 py-1 text-xs text-racing-white placeholder:text-racing-white/25 focus:border-racing-red focus:outline-none"
                />
                <datalist id={`cat-suggestions-${i}`}>
                  {CATEGORY_SUGGESTIONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              {/* Caption */}
              <input
                type="text"
                value={item.caption}
                onChange={(e) => updateField(i, "caption", e.target.value)}
                placeholder="キャプション（任意）"
                className="border border-white/15 bg-white/5 px-2 py-1 text-xs text-racing-white placeholder:text-racing-white/25 focus:border-racing-red focus:outline-none"
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
