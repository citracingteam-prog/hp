"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/AnimatedText";
import { HISTORY, type HistoryEntry } from "@/lib/data";

export function History() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const progress = useTransform(scrollYProgress, [0.15, 0.9], [0, 1]);

  return (
    <section
      id="history"
      ref={ref}
      className="relative overflow-hidden bg-racing-black py-24 md:py-40"
    >
      <motion.span
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 top-[6%] text-center font-display text-[clamp(8rem,22vw,22rem)] font-bold leading-none tracking-tight text-white/[0.025]"
      >
        2002—2026
      </motion.span>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-14 grid gap-10 md:mb-24 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
          <div>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-12 bg-racing-red" />
                <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                  TRACK RECORD / 沿革
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-5xl font-bold leading-[0.92] md:text-7xl lg:text-8xl">
                20<span className="text-racing-red">+</span> YEARS
                <br />
                OF <span className="italic">PROGRESS</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-racing-white/70 md:text-base">
                2002年の結成から、失敗と更新を繰り返してきました。
                2025年の第23回大会で総合18位・ベスト車検賞(ICV)。
                チーム史上最高を更新した、その続きを走っています。
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <StatCard label="EST." value="2002" sub="Founded" />
              <StatCard label="BEST" value="18" suffix="TH" sub="2025 / 23rd" highlight />
              <StatCard label="AWARDS" value="04" suffix="+" sub="会長賞 / ICV" />
            </div>
          </FadeIn>
        </div>

        <div className="relative">
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute left-0 top-0 hidden h-full w-[2px] origin-top bg-gradient-to-b from-racing-red via-racing-red/60 to-transparent md:block"
          />

          <ol className="relative divide-y divide-white/5 border-y border-white/10 md:border md:border-white/10">
            {HISTORY.map((h, i) => (
              <Row key={h.headline} entry={h} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col gap-2 border p-4 md:p-5 ${
        highlight
          ? "border-racing-red/60 bg-racing-red/[0.08]"
          : "border-white/10 bg-racing-carbon"
      }`}
    >
      <span
        className={`font-display text-[10px] tracking-[0.35em] ${
          highlight ? "text-racing-red" : "text-racing-gray"
        }`}
      >
        {label}
      </span>
      <span className="font-display text-3xl font-bold tabular-nums leading-none md:text-4xl">
        {value}
        {suffix && (
          <span className="ml-0.5 text-lg text-racing-red md:text-xl">
            {suffix}
          </span>
        )}
      </span>
      {sub && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-racing-white/60 md:text-[11px]">
          {sub}
        </span>
      )}
    </div>
  );
}

function Row({ entry, index }: { entry: HistoryEntry; index: number }) {
  const counter = String(index + 1).padStart(2, "0");
  const photos = entry.photos ?? [];

  return (
    <>
      <motion.li
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className={`group relative overflow-hidden transition-colors ${
          entry.highlight
            ? "bg-gradient-to-r from-racing-red/[0.1] via-racing-red/[0.02] to-transparent"
            : "hover:bg-white/[0.02]"
        }`}
      >
        <span
          aria-hidden
          className={`absolute left-0 top-0 h-full transition-all duration-500 ${
            entry.highlight
              ? "w-[4px] bg-racing-red"
              : "w-[2px] bg-white/5 group-hover:w-[4px] group-hover:bg-racing-red"
          }`}
        />

        <div className="relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-7 pl-7 pr-5 md:grid-cols-[80px_140px_160px_1fr_auto] md:items-center md:gap-x-10 md:py-9 md:pl-12 md:pr-8">
          <div className="row-span-2 font-display text-4xl font-bold tabular-nums leading-none text-racing-white/15 md:row-span-1 md:text-5xl">
            {counter}
          </div>

          <div className="font-display text-sm tracking-[0.22em] text-racing-white md:text-base">
            {entry.year}
          </div>

          <div className="col-start-2 font-display text-[11px] tracking-[0.35em] text-racing-red md:col-start-3 md:text-xs">
            {entry.event}
          </div>

          <div className="col-span-2 md:col-span-1 md:col-start-4">
            <h3 className="font-display text-xl font-bold leading-tight md:text-2xl">
              {entry.headline}
            </h3>
            {entry.detail && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-racing-white/65">
                {entry.detail}
              </p>
            )}
          </div>

          <div className="col-span-2 flex flex-col items-start gap-2 md:col-span-1 md:col-start-5 md:items-end md:justify-self-end">
            <Link
              href={`/gallery/history#entry-${index}`}
              className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 font-display text-xs tracking-[0.35em] text-racing-white/50 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm4.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM3 11l2-2.5 1.5 1.5L9 7l4 5H3Z" />
              </svg>
              GALLERY
              {photos.length > 0 && (
                <span className="text-racing-white/30">({photos.length})</span>
              )}
            </Link>
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-0 bg-racing-red transition-all duration-700 group-hover:w-full"
        />
      </motion.li>

    </>
  );
}
