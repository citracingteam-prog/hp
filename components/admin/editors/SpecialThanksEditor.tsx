"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";

type Props = { initial: string[] };

export function SpecialThanksEditor({ initial }: Props) {
  const [items, setItems] = useState<string[]>(initial);

  function update(i: number, value: string) {
    setItems((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function add() {
    setItems((prev) => [...prev, ""]);
  }

  return (
    <div>
      <SectionHeader
        title="SPECIAL THANKS"
        actions={
          <>
            <button
              type="button"
              onClick={add}
              className="border border-white/20 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              ＋ 追加
            </button>
            <SaveButton section="special-thanks" data={items} />
          </>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        {items.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-6 shrink-0 font-display text-[11px] text-racing-white/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              value={name}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 border border-white/15 bg-racing-black px-3 py-2 text-sm text-racing-white outline-none focus:border-racing-red"
              placeholder="名称を入力"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="border border-white/15 px-3 py-2 font-display text-[10px] text-racing-white/50 transition-colors hover:border-red-500 hover:text-red-500"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
