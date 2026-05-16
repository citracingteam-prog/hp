"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";
import { SortableList } from "@/components/admin/SortableList";

type Props = { initial: HistoryEntry[] };

function blank(): HistoryEntry {
  return { year: "", event: "", headline: "", detail: "", highlight: false };
}

export function HistoryEditor({ initial }: Props) {
  const [rows, setRows] = useState<HistoryEntry[]>(initial);

  function updateAt(i: number, patch: Partial<HistoryEntry>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
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

      <SortableList<HistoryEntry>
        items={rows}
        getKey={(_, i) => String(i)}
        onChange={setRows}
        renderItem={(r, i, controls) => (
          <div className="flex gap-4">
            <div className="grid flex-1 grid-cols-2 gap-3">
              <Field label="年/回" value={r.year} onChange={(v) => updateAt(i, { year: v })} />
              <Field label="イベント" value={r.event} onChange={(v) => updateAt(i, { event: v })} />
              <Field
                label="見出し"
                value={r.headline}
                onChange={(v) => updateAt(i, { headline: v })}
                full
              />
              <Field
                label="詳細"
                value={r.detail ?? ""}
                onChange={(v) => updateAt(i, { detail: v })}
                full
              />
            </div>
            <div className="shrink-0">{controls}</div>
          </div>
        )}
      />
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
