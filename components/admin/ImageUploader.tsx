"use client";

import { useRef, useState } from "react";
import { notify } from "./Toast";

type Props = {
  onUploaded: (path: string) => void;
  label?: string;
  type?: "photo" | "logo";
};

export function ImageUploader({ onUploaded, label = "画像をアップロード", type = "logo" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const CONVERT_EXTS = [".ai", ".tiff", ".tif", ".pdf"];

  function needsConvert(file: File) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return CONVERT_EXTS.includes(ext);
  }

  async function uploadOne(file: File): Promise<void> {
    const isConvertTarget = needsConvert(file);
    if (!isConvertTarget && !/^image\/(jpeg|png|webp|svg\+xml|gif)$/.test(file.type)) {
      notify("error", `${file.name}: jpg/png/webp/svg/gif/ai/tiff のみアップロード可能です`);
      return;
    }
    const maxSize = isConvertTarget ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      notify("error", `${file.name}: ${isConvertTarget ? "20MB" : "10MB"} 超過`);
      return;
    }
    const baseEndpoint = isConvertTarget ? "/api/admin/convert-upload" : "/api/admin/upload";
    const endpoint = `${baseEndpoint}?type=${type}`;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(endpoint, { method: "POST", body: fd });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; duplicate?: string };
      if (res.status === 409 && body.duplicate) {
        onUploaded(body.duplicate);
        return;
      }
      notify("error", body.error ?? `アップロード失敗 (${res.status})`);
      return;
    }
    const data = (await res.json()) as { path: string };
    onUploaded(data.path);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        await uploadOne(f);
      }
      notify("success", files.length > 1 ? `${files.length}枚アップロードしました` : "アップロードしました");
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
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,.ai,.tiff,.tif,.pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading ? "アップロード中..." : dragging ? "ここにドロップ" : label}
    </div>
  );
}
