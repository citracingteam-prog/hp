"use client";

import { useState } from "react";
import { notify } from "./Toast";

type Props<T> = {
  section: "hero-images" | "members" | "history" | "races" | "sponsors" | "gallery" | "sponsor-descriptions" | "special-thanks";
  data: T;
  disabled?: boolean;
  onSaved?: () => void;
};

export function SaveButton<T>({ section, data, disabled, onSaved }: Props<T>) {
  const [saving, setSaving] = useState(false);

  async function onClick() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        notify("error", body.error ?? `保存失敗 (${res.status})`);
        return;
      }
      notify("success", "保存しました。反映まで 1 分ほどお待ちください");
      onSaved?.();
    } catch (e) {
      notify("error", e instanceof Error ? e.message : "通信エラー");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || saving}
      className="border border-racing-red bg-racing-red px-6 py-2 font-display text-xs tracking-[0.3em] text-racing-black transition-colors hover:bg-transparent hover:text-racing-red disabled:opacity-50"
    >
      {saving ? "保存中..." : "保存"}
    </button>
  );
}
