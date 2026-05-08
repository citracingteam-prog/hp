"use client";

import { useRef, useState } from "react";
import { notify } from "./Toast";

type Props = {
  onUploaded: (path: string) => void;
  label?: string;
};

export function ImageUploader({ onUploaded, label = "画像をアップロード" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      notify("error", "jpg/png/webp のみアップロード可能です");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notify("error", "10MB を超える画像はアップロードできません");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        notify("error", body.error ?? `アップロード失敗 (${res.status})`);
        return;
      }
      const data = (await res.json()) as { path: string };
      onUploaded(data.path);
      notify("success", "アップロードしました");
    } catch (e) {
      notify("error", e instanceof Error ? e.message : "通信エラー");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`cursor-pointer border px-4 py-2 font-display text-[10px] tracking-[0.3em] transition-colors ${
        dragging
          ? "border-racing-red bg-racing-red/10 text-racing-red"
          : "border-white/20 text-racing-white/80 hover:border-racing-red hover:text-racing-red"
      } ${uploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading ? "アップロード中..." : dragging ? "ここにドロップ" : label}
    </div>
  );
}
