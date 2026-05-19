"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { HISTORY } from "@/lib/data";

export default function YearGalleryPage() {
  const { year } = useParams<{ year: string }>();

  const entryIndex = HISTORY.findIndex((h) => h.year === year);
  const entry = entryIndex !== -1 ? HISTORY[entryIndex] : null;
  const prevEntry = entryIndex > 0 ? HISTORY[entryIndex - 1] : null;
  const nextEntry = entryIndex < HISTORY.length - 1 ? HISTORY[entryIndex + 1] : null;

  const photos = entry?.photos ?? [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIdx, photos.length]);

  if (!entry) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-racing-black">
          <Link href="/gallery/history" className="font-display text-[10px] tracking-widest text-racing-red">
            ← GALLERY へ戻る
          </Link>
        </main>
      </>
    );
  }

  function next() { setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length)); }
  function prev() { setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)); }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-racing-black pt-20">

        {/* ── 年ナビゲーションバー ── */}
        <nav className="sticky top-20 z-40 border-b border-white/[0.07] bg-racing-black/95 backdrop-blur-sm">
          <div className="flex items-center gap-0 overflow-x-auto px-8 scrollbar-none">
            <Link
              href="/#history"
              className="mr-8 shrink-0 py-5 font-display text-base tracking-[0.4em] text-white/25 transition-colors hover:text-white/70"
            >
              ← BACK
            </Link>
            <span className="mr-8 h-5 w-px shrink-0 bg-white/15" />
            {HISTORY.map((h) => {
              const isActive = h.year === year;
              return (
                <Link
                  key={h.year}
                  href={`/gallery/history/${h.year}`}
                  className={`relative shrink-0 px-6 py-5 font-display text-base tracking-[0.2em] transition-colors ${
                    isActive ? "text-white" : "text-white/30 hover:text-white/70"
                  }`}
                >
                  {h.year}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-racing-red" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Year header ── */}
        <div className="px-8 pb-8 pt-10 md:px-14">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-6 bg-racing-red" />
            <span className="font-display text-[10px] tracking-[0.4em] text-racing-red">{entry.event}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-7xl font-bold tabular-nums leading-none text-white md:text-9xl">
                {entry.year}
              </h1>
              <p className="mt-2 font-display text-sm tracking-[0.15em] text-white/40">{entry.headline}</p>
            </div>
            <div className="flex items-center gap-6 pb-2">
              {prevEntry && (
                <Link href={`/gallery/history/${prevEntry.year}`}
                  className="group flex items-center gap-2 transition-colors hover:text-racing-red"
                >
                  <span className="font-display text-xl text-white/25 transition-colors group-hover:text-racing-red">‹</span>
                  <span className="font-display text-xs tracking-widest text-white/30 transition-colors group-hover:text-racing-red">{prevEntry.year}</span>
                </Link>
              )}
              {nextEntry && (
                <Link href={`/gallery/history/${nextEntry.year}`}
                  className="group flex items-center gap-2 transition-colors hover:text-racing-red"
                >
                  <span className="font-display text-xs tracking-widest text-white/30 transition-colors group-hover:text-racing-red">{nextEntry.year}</span>
                  <span className="font-display text-xl text-white/25 transition-colors group-hover:text-racing-red">›</span>
                </Link>
              )}
              <span className="font-display text-[9px] tracking-widest text-white/15">{photos.length}P</span>
            </div>
          </div>
        </div>

        {/* ── Photo grid ── */}
        {photos.length === 0 ? (
          <div className="mx-8 flex h-40 items-center justify-center border border-dashed border-white/10 font-display text-[10px] tracking-[0.3em] text-white/20 md:mx-14">
            写真準備中
          </div>
        ) : (
          <EditorialGrid photos={photos} onSelect={setLightboxIdx} />
        )}

        <div className="h-16" />
      </main>

      {/* Lightbox */}
      {mounted && lightboxIdx !== null &&
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
    </>
  );
}

/* ── EditorialGrid ── */
function Photo({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="group relative h-full w-full overflow-hidden bg-racing-carbon"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
    </button>
  );
}

function EditorialGrid({ photos, onSelect }: { photos: string[]; onSelect: (i: number) => void }) {
  const GAP = 10;
  const PADDING = "4rem";

  if (photos.length === 1) {
    return (
      <div style={{ padding: `0 ${PADDING}` }}>
        <div style={{ aspectRatio: "16/9", borderRadius: 2, overflow: "hidden" }}>
          <Photo src={photos[0]} alt="photo 1" onClick={() => onSelect(0)} />
        </div>
      </div>
    );
  }

  if (photos.length === 2) {
    return (
      <div style={{ padding: `0 ${PADDING}`, display: "flex", gap: GAP, height: 440 }}>
        <div style={{ flex: 3, borderRadius: 2, overflow: "hidden" }}>
          <Photo src={photos[0]} alt="photo 1" onClick={() => onSelect(0)} />
        </div>
        <div style={{ flex: 2, borderRadius: 2, overflow: "hidden" }}>
          <Photo src={photos[1]} alt="photo 2" onClick={() => onSelect(1)} />
        </div>
      </div>
    );
  }

  const top3 = photos.slice(0, 3);
  const rest = photos.slice(3);
  const restCols = Math.min(rest.length, 4);

  return (
    <div style={{ padding: `0 ${PADDING}`, display: "flex", flexDirection: "column", gap: GAP }}>
      {/* Editorial trio */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gridTemplateRows: "1fr 1fr",
        height: 480,
        gap: GAP,
      }}>
        <div style={{ gridRow: "1 / 3", borderRadius: 2, overflow: "hidden" }}>
          <Photo src={top3[0]} alt="photo 1" onClick={() => onSelect(0)} />
        </div>
        {top3[1] && (
          <div style={{ borderRadius: 2, overflow: "hidden" }}>
            <Photo src={top3[1]} alt="photo 2" onClick={() => onSelect(1)} />
          </div>
        )}
        {top3[2] && (
          <div style={{ borderRadius: 2, overflow: "hidden" }}>
            <Photo src={top3[2]} alt="photo 3" onClick={() => onSelect(2)} />
          </div>
        )}
      </div>

      {/* Remaining */}
      {rest.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${restCols}, 1fr)`,
          height: 200,
          gap: GAP,
        }}>
          {rest.map((src, i) => (
            <div key={i} style={{ borderRadius: 2, overflow: "hidden" }}>
              <Photo src={src} alt={`photo ${i + 4}`} onClick={() => onSelect(i + 3)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({ photos, title, idx, onNext, onPrev, onClose }: {
  photos: string[]; title: string; idx: number;
  onNext: () => void; onPrev: () => void; onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img key={photos[idx]} src={photos[idx]} alt={`${title} ${idx + 1}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
        className="absolute inset-0 h-full w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between px-6 pb-20 pt-6"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-racing-red" />
          <span className="font-display text-[10px] tracking-[0.35em] text-white/60">{title}</span>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる"
          className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/30 font-display text-lg text-white/70 backdrop-blur-sm transition hover:border-racing-red hover:text-racing-red"
        >×</button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 pb-8 pt-20"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {photos.length > 1 && (
          <div className="flex items-center gap-2">
            {photos.map((_, i) => (
              <span key={i} className={`h-[2px] transition-all duration-300 ${i === idx ? "w-8 bg-racing-red" : "w-4 bg-white/20"}`} />
            ))}
          </div>
        )}
        <span className="font-display text-[10px] tabular-nums text-white/40">{idx + 1} / {photos.length}</span>
      </div>
      {photos.length > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="前の写真"
            className="absolute left-0 top-0 z-10 flex h-full w-[15%] items-center justify-start pl-5 group"
          >
            <span className="font-display text-5xl text-white/0 transition-colors duration-200 group-hover:text-white/60">‹</span>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="次の写真"
            className="absolute right-0 top-0 z-10 flex h-full w-[15%] items-center justify-end pr-5 group"
          >
            <span className="font-display text-5xl text-white/0 transition-colors duration-200 group-hover:text-white/60">›</span>
          </button>
        </>
      )}
    </motion.div>
  );
}
