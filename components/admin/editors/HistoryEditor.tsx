"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { SortableList } from "@/components/admin/SortableList";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = { initial: HistoryEntry[] };

function blank(): HistoryEntry {
  return {
    year: "",
    event: "",
    headline: "",
    detail: "",
    highlight: false,
    photos: [],
  };
}

export function HistoryEditor({ initial }: Props) {
  const [rows, setRows] = useState<HistoryEntry[]>(initial);

  function updateAt(i: number, patch: Partial<HistoryEntry>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function setCover(i: number, path: string | null) {
    setRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        const rest = (r.photos ?? []).slice(1);
        const next = path === null ? rest : [path, ...rest];
        return { ...r, photos: next };
      }),
    );
  }

  function removeAt(i: number) {
    if (!confirm("この履歴を削除しますか?")) return;
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <SectionHeader
        title="HISTORY"
        actions={
          <>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, blank()])}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              + 履歴を追加
            </button>
            <SaveButton section="history" data={rows} />
          </>
        }
      />

      <p className="mb-4 mt-2 text-[11px] text-racing-white/40">
        各エントリの「代表写真」はトップページの HISTORY カルーセルで使用されます。
        ギャラリーで複数枚を管理している場合、1枚目がそのまま代表写真になります。
      </p>

      <SortableList<HistoryEntry>
        items={rows}
        getKey={(_, i) => String(i)}
        onChange={setRows}
        renderItem={(r, i, controls) => (
          <div className="flex gap-5">
            {/* Cover photo */}
            <div className="shrink-0">
              <CoverEditor
                photo={r.photos?.[0]}
                onSet={(p) => setCover(i, p)}
                onClear={() => setCover(i, null)}
              />
            </div>

            {/* Fields */}
            <div className="grid flex-1 grid-cols-2 gap-3 self-start">
              <Field
                label="年(西暦)"
                value={r.year}
                onChange={(v) => updateAt(i, { year: v })}
              />
              <Field
                label="イベント(英)"
                value={r.event}
                onChange={(v) => updateAt(i, { event: v })}
              />
              <Field
                label="見出し"
                value={r.headline}
                onChange={(v) => updateAt(i, { headline: v })}
                full
              />
              <TextareaField
                label="詳細"
                value={r.detail ?? ""}
                onChange={(v) => updateAt(i, { detail: v })}
              />

              <label className="col-span-2 flex items-center gap-2 text-[11px] tracking-[0.2em] text-racing-white/60">
                <input
                  type="checkbox"
                  checked={r.highlight ?? false}
                  onChange={(e) =>
                    updateAt(i, { highlight: e.target.checked })
                  }
                  className="accent-racing-red"
                />
                ハイライト表示
              </label>
            </div>

            <div className="flex shrink-0 flex-col gap-2">
              {controls}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="border border-white/15 px-2 py-1 font-display text-[10px] tracking-[0.25em] text-racing-white/50 transition-colors hover:border-red-500 hover:text-red-400"
              >
                削除
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function CoverEditor({
  photo,
  onSet,
  onClear,
}: {
  photo?: string;
  onSet: (path: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="w-32">
      <div className="font-display text-[9px] tracking-[0.25em] text-racing-white/50 mb-1">
        代表写真
      </div>
      {photo ? (
        <div className="group relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            className="aspect-[3/4] w-32 object-cover border border-white/10"
          />
          <button
            type="button"
            onClick={onClear}
            aria-label="代表写真を外す"
            className="absolute right-1 top-1 hidden bg-red-600/90 px-1.5 py-0.5 font-display text-[10px] text-white group-hover:block"
          >
            外す
          </button>
          <div className="mt-2">
            <ImageUploader label="差し替え" onUploaded={onSet} />
          </div>
        </div>
      ) : (
        <div className="flex aspect-[3/4] w-32 items-center justify-center border border-dashed border-white/15">
          <ImageUploader label="＋ 写真" onUploaded={onSet} />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
      <span className="font-display text-[9px] tracking-[0.25em] text-racing-white/50">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-white/15 bg-racing-black px-2 py-1 text-sm text-racing-white outline-none focus:border-racing-red"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="col-span-2 flex flex-col gap-1">
      <span className="font-display text-[9px] tracking-[0.25em] text-racing-white/50">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="resize-y border border-white/15 bg-racing-black px-2 py-1 text-sm leading-relaxed text-racing-white outline-none focus:border-racing-red"
      />
    </label>
  );
}
