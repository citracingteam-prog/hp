"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HISTORY } from "@/lib/data";

const entries = HISTORY.map((h, i) => ({ ...h, originalIndex: i }));

export default function HistoryGalleryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-racing-black px-5 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Page header */}
          <div className="mb-4 flex items-center gap-3">
            <Link
              href="/#history"
              className="font-display text-[10px] tracking-[0.3em] text-racing-white/40 transition-colors hover:text-racing-white/70"
            >
              ← HISTORY
            </Link>
          </div>
          <div className="mb-16">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-racing-red" />
              <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                TRACK RECORD / 年度別ギャラリー
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-racing-white md:text-7xl">
              GALLERY
            </h1>
            <p className="mt-4 text-sm text-racing-white/50">
              年度ごとの活動写真をご覧いただけます。
            </p>
          </div>

              <div className="space-y-16">
              {entries.map((entry) => (
                <YearSection key={entry.originalIndex} entry={entry} index={entry.originalIndex} />
              ))}
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function YearSection({
  entry,
  index,
}: {
  entry: (typeof HISTORY)[number] & { originalIndex?: number };
  index: number;
}) {
  const photos = entry.photos ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const hash = window.location.hash;
    if (hash === `#entry-${index}` && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [index]);

  function next() {
    setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));
  }
  function prev() {
    setLightboxIdx((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length,
    );
  }

  return (
    <section ref={sectionRef} id={`entry-${index}`}>
      {/* Section heading */}
      <div className="mb-6 flex items-center gap-4">
        <span className="h-[2px] w-8 bg-racing-red" />
        <div>
          <span className="font-display text-base tracking-[0.35em] text-racing-white md:text-lg">
            {entry.year}
          </span>
          {entry.event && (
            <span className="ml-3 font-display text-[11px] tracking-[0.3em] text-racing-red">
              {entry.event}
            </span>
          )}
        </div>
        <div className="ml-2">
          <h2 className="font-display text-sm tracking-[0.2em] text-racing-white/60">
            {entry.headline}
          </h2>
        </div>
        <span className="font-display text-[11px] text-racing-white/30">
          {photos.length} PHOTOS
        </span>
        <span className="flex-1 border-t border-white/10" />
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="flex h-32 items-center justify-center border border-dashed border-white/10 text-racing-white/30 font-display text-[11px] tracking-[0.3em]">
          写真準備中
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIdx(i)}
              className="group relative aspect-[4/3] overflow-hidden border border-white/5 bg-racing-carbon transition-colors hover:border-racing-red/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${entry.year} - ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              <div className="absolute bottom-0 right-0 bg-racing-black/70 px-2 py-1 font-display text-[9px] tracking-widest text-racing-white/60 opacity-0 transition-opacity group-hover:opacity-100">
                {i + 1} / {photos.length}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {mounted &&
        lightboxIdx !== null &&
        createPortal(
          <AnimatePresence>
            <Lightbox
              photos={photos}
              title={`${entry.year} — ${entry.headline}`}
              idx={lightboxIdx}
              onNext={next}
              onPrev={prev}
              onClose={() => setLightboxIdx(null)}
            />
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

function Lightbox({
  photos,
  title,
  idx,
  onNext,
  onPrev,
  onClose,
}: {
  photos: string[];
  title: string;
  idx: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-racing-black/95 px-4 py-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-racing-red" />
            <span className="font-display text-[10px] tracking-[0.35em] text-racing-red">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-[10px] tabular-nums text-racing-white/40">
              {idx + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="inline-flex h-9 w-9 items-center justify-center border border-white/20 font-display text-sm text-racing-white/80 transition-colors hover:border-racing-red hover:text-racing-red"
            >
              ×
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1 overflow-hidden border border-white/10 bg-racing-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={photos[idx]}
            src={photos[idx]}
            alt={`${title} ${idx + 1}`}
            className="mx-auto max-h-[72vh] w-full object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-0 top-0 flex h-full w-14 items-center justify-center bg-gradient-to-r from-black/40 to-transparent font-display text-xl text-racing-white/40 transition-colors hover:text-racing-red"
                aria-label="前の写真"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-0 top-0 flex h-full w-14 items-center justify-center bg-gradient-to-l from-black/40 to-transparent font-display text-xl text-racing-white/40 transition-colors hover:text-racing-red"
                aria-label="次の写真"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-[2px] w-5 transition-colors ${
                  i === idx ? "bg-racing-red" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
