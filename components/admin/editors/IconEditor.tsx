"use client";

import { useRef, useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { notify } from "@/components/admin/Toast";

export function IconEditor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [removeWhite, setRemoveWhite] = useState(true);
  const [saving, setSaving] = useState(false);

  function processImage(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      if (removeWhite) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) {
            d[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        setProcessedBlob(blob);
        setPreview(canvas.toDataURL("image/png"));
      }, "image/png");

      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "image/png") {
      notify("error", "PNG ファイルのみ選択できます");
      return;
    }
    processImage(file);
  }

  async function handleSave() {
    if (!processedBlob) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", processedBlob, "icon.png");
      const res = await fetch("/api/admin/icon", { method: "POST", body: fd });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        notify("error", body.error ?? `保存失敗 (${res.status})`);
        return;
      }
      notify("success", "アイコンを保存しました");
      setPreview(null);
      setProcessedBlob(null);
    } catch (e) {
      notify("error", e instanceof Error ? e.message : "通信エラー");
    } finally {
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <SectionHeader
        title="SITE ICON"
        actions={
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
          >
            PNG を選択
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />

      <p className="mb-6 text-xs text-racing-white/60">
        サイトのファビコン（タブに表示されるアイコン）を変更します。PNG ファイルをアップロードしてください。
      </p>

      {/* オプション */}
      <label className="mb-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={removeWhite}
          onChange={(e) => setRemoveWhite(e.target.checked)}
          className="h-4 w-4 accent-racing-red"
        />
        <span className="font-display text-[11px] tracking-[0.2em] text-racing-white/70">
          白背景を自動で透過にする
        </span>
      </label>

      <div className="grid grid-cols-2 gap-8">
        {/* 現在のアイコン */}
        <div>
          <div className="mb-2 font-display text-[10px] tracking-[0.3em] text-racing-white/50">
            現在のアイコン
          </div>
          <div className="flex h-40 items-center justify-center border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icon.png?t=${Date.now()}`}
              alt="current icon"
              className="max-h-32 max-w-full object-contain"
            />
          </div>
          <div className="mt-1 text-[10px] text-racing-white/30">（明るい背景）</div>
          <div className="mt-2 flex h-40 items-center justify-center border border-white/10 bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icon.png?t=${Date.now()}`}
              alt="current icon dark"
              className="max-h-32 max-w-full object-contain"
            />
          </div>
          <div className="mt-1 text-[10px] text-racing-white/30">（暗い背景）</div>
        </div>

        {/* プレビュー */}
        <div>
          <div className="mb-2 font-display text-[10px] tracking-[0.3em] text-racing-white/50">
            プレビュー（新しいアイコン）
          </div>
          {preview ? (
            <>
              <div className="flex h-40 items-center justify-center border border-white/10 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="max-h-32 max-w-full object-contain" />
              </div>
              <div className="mt-1 text-[10px] text-racing-white/30">（明るい背景）</div>
              <div className="mt-2 flex h-40 items-center justify-center border border-white/10 bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview dark" className="max-h-32 max-w-full object-contain" />
              </div>
              <div className="mt-1 text-[10px] text-racing-white/30">（暗い背景）</div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-4 w-full border border-racing-red px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-red transition-colors hover:bg-racing-red hover:text-white disabled:opacity-50"
              >
                {saving ? "保存中..." : "このアイコンで保存"}
              </button>
            </>
          ) : (
            <div className="flex h-40 items-center justify-center border border-dashed border-white/15 text-sm text-racing-white/40">
              PNG を選択するとここにプレビューが表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
