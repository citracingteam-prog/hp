"use client";

import { useState } from "react";
import type { Company } from "@/lib/data";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { SaveButton } from "@/components/admin/SaveButton";

type Props = { initial: Company[] };

export function SponsorDetailsEditor({ initial }: Props) {
  const [companies, setCompanies] = useState<Company[]>(initial);

  function updateDescription(i: number, description: string) {
    setCompanies((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, description } : c)),
    );
  }

  const filledCount = companies.filter((c) => c.description?.trim()).length;

  return (
    <div>
      <SectionHeader
        title="SPONSOR 詳細"
        actions={<SaveButton section="sponsors" data={companies} />}
      />

      <p className="mb-6 text-sm text-racing-white/50">
        各スポンサーが提供してくださっているもの・支援内容を入力してください。
        <span className="ml-2 text-racing-red">
          {filledCount} / {companies.length} 件入力済み
        </span>
      </p>

      <ul className="flex flex-col gap-4">
        {companies.map((company, i) => (
          <li
            key={i}
            className="flex flex-col gap-2 border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex items-center gap-3">
              {company.logo && (
                <div className="flex h-8 w-16 shrink-0 items-center justify-center border border-white/10 bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <span className="font-display text-sm font-bold text-racing-white">
                {company.name}
              </span>
              {company.url && (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 px-3 py-1 font-display text-[11px] tracking-[0.2em] text-racing-white/70 transition-colors hover:border-racing-red hover:text-racing-red"
                >
                  SITE →
                </a>
              )}
            </div>
            <textarea
              value={company.description ?? ""}
              placeholder="支援内容の説明（例: エンジン部品の無償提供およびエンジニアによる技術指導をいただいています）"
              rows={3}
              onChange={(e) => updateDescription(i, e.target.value)}
              className="w-full resize-y border border-white/15 bg-racing-black px-3 py-2 text-sm leading-relaxed text-racing-white/80 outline-none focus:border-racing-red"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
