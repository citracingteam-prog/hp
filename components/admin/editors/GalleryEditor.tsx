"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { ImageUploader } from "@/components/admin/ImageUploader";

export type GalleryImage = { src: string; caption: string };
export type GalleryAlbum = { id: string; name: string; images: GalleryImage[] };

type Props = { initial: GalleryAlbum[] };

function newAlbum(): GalleryAlbum {
  return { id: `album_${Date.now()}`, name: "", images: [] };
}

export function GalleryEditor({ initial }: Props) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initial);

  function updateAlbum(id: string, patch: Partial<GalleryAlbum>) {
    setAlbums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }

  function deleteAlbum(id: string) {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  }

  function moveAlbum(id: string, dir: -1 | 1) {
    setAlbums((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  function addImage(albumId: string, src: string) {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? { ...a, images: [...a.images, { src, caption: "" }] }
          : a,
      ),
    );
  }

  function updateImage(
    albumId: string,
    imgIdx: number,
    patch: Partial<GalleryImage>,
  ) {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? {
              ...a,
              images: a.images.map((img, i) =>
                i === imgIdx ? { ...img, ...patch } : img,
              ),
            }
          : a,
      ),
    );
  }

  function deleteImage(albumId: string, imgIdx: number) {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? { ...a, images: a.images.filter((_, i) => i !== imgIdx) }
          : a,
      ),
    );
  }

  return (
    <div>
      <SectionHeader
        title="HIGHLIGHT"
        actions={
          <>
            <button
              type="button"
              onClick={() => setAlbums((prev) => [...prev, newAlbum()])}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              ＋ フォルダを追加
            </button>
            <SaveButton section="gallery" data={albums} />
          </>
        }
      />

      {albums.length === 0 && (
        <div className="mt-6 border border-dashed border-white/15 p-10 text-center text-sm text-racing-white/40">
          フォルダがありません。「＋ フォルダを追加」から作成してください。
        </div>
      )}

      <div className="mt-4 flex flex-col gap-6">
        {albums.map((album, albumIdx) => (
          <div
            key={album.id}
            className="border border-white/10 bg-racing-carbon p-5"
          >
            {/* Album header */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="text"
                value={album.name}
                onChange={(e) => updateAlbum(album.id, { name: e.target.value })}
                placeholder="フォルダ名（例: 2025年大会、走行テスト）"
                className="flex-1 border-b border-white/20 bg-transparent py-1 font-display text-base tracking-widest text-racing-white placeholder:text-racing-white/25 focus:border-racing-red focus:outline-none"
              />
              <span className="font-display text-[10px] text-racing-white/30">
                {album.images.length} 枚
              </span>
              <button
                type="button"
                onClick={() => moveAlbum(album.id, -1)}
                disabled={albumIdx === 0}
                className="border border-white/15 px-2 py-1 text-xs text-racing-white/50 hover:text-racing-white disabled:opacity-20"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveAlbum(album.id, 1)}
                disabled={albumIdx === albums.length - 1}
                className="border border-white/15 px-2 py-1 text-xs text-racing-white/50 hover:text-racing-white disabled:opacity-20"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => deleteAlbum(album.id)}
                className="border border-white/15 px-3 py-1 font-display text-[10px] tracking-widest text-racing-white/50 transition-colors hover:border-red-500 hover:text-red-500"
              >
                削除
              </button>
            </div>

            {/* Images grid */}
            {album.images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-6">
                {album.images.map((img, imgIdx) => (
                  <div key={imgIdx} className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      className="h-20 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(album.id, imgIdx)}
                      className="absolute right-0 top-0 hidden bg-red-600 px-1 py-0.5 text-[10px] text-white group-hover:block"
                    >
                      ✕
                    </button>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) =>
                        updateImage(album.id, imgIdx, { caption: e.target.value })
                      }
                      placeholder="キャプション"
                      className="mt-0.5 w-full border-b border-white/10 bg-transparent text-[10px] text-racing-white/50 placeholder:text-racing-white/20 focus:border-racing-red focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <ImageUploader
              label="＋ 画像をアップロード"
              onUploaded={(path) => addImage(album.id, path)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
