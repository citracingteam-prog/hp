"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

type GalleryYear = { year: string; headline: string; photos: string[] };

export function YearGalleryClient({
  galleryYears,
}: {
  galleryYears: GalleryYear[];
}) {
  const { year } = useParams<{ year: string }>();

  const entryIndex = galleryYears.findIndex((h) => h.year === year);
  const entry: GalleryYear | null = entryIndex !== -1 ? galleryYears[entryIndex] : null;
  const prevEntry = entryIndex > 0 ? galleryYears[entryIndex - 1] : null;
  const nextEntry = entryIndex < galleryYears.length - 1 ? galleryYears[entryIndex + 1] : null;

  const photos = [...new Set(entry?.photos ?? [])];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeNavRef = useRef<HTMLAnchorElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    activeNavRef.current?.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" });
  }, [year]);

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
      <main className="relative min-h-screen bg-racing-black pt-20">
        {/* ロゴウォーターマーク */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cit-logo.png"
          alt=""
          aria-hidden
          className="pointer-events-none fixed h-auto w-[35vw] max-w-sm select-none object-contain opacity-[0.05]"
          style={{ filter: "invert(1)", top: "78%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0 }}
        />

        {/* ── 年ナビゲーションバー ── */}
        <nav className="relative sticky top-20 z-40 border-b border-white/[0.07] bg-racing-black/95 backdrop-blur-sm">
          <div
            ref={navBarRef}
            className="flex items-center gap-0 overflow-x-auto px-8 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", cursor: "grab", userSelect: "none" }}
            onMouseDown={(e) => {
              isDragging.current = true;
              hasMoved.current = false;
              dragStartX.current = e.clientX;
              scrollStartX.current = navBarRef.current?.scrollLeft ?? 0;
            }}
            onMouseMove={(e) => {
              if (!isDragging.current || !navBarRef.current) return;
              const moved = Math.abs(e.clientX - dragStartX.current);
              if (moved > 4) {
                hasMoved.current = true;
                navBarRef.current.style.cursor = "grabbing";
                navBarRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current);
              }
            }}
            onMouseUp={() => {
              isDragging.current = false;
              if (navBarRef.current) navBarRef.current.style.cursor = "grab";
            }}
            onMouseLeave={() => {
              isDragging.current = false;
              if (navBarRef.current) navBarRef.current.style.cursor = "grab";
            }}
            onWheel={(e) => {
              const el = navBarRef.current;
              if (!el) return;
              if (el.scrollWidth > el.clientWidth) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
              }
            }}
          >
            <Link
              href="/#history"
              className="mr-8 shrink-0 py-5 font-display text-base tracking-[0.4em] text-white/25 transition-colors hover:text-white/70"
            >
              ← BACK
            </Link>
            <span className="mr-8 h-5 w-px shrink-0 bg-white/15" />
            {galleryYears.map((h) => {
              const isActive = h.year === year;
              return (
                <Link
                  key={h.year}
                  href={`/gallery/history/${h.year}`}
                  ref={isActive ? activeNavRef : null}
                  draggable={false}
                  onClick={(e) => { if (hasMoved.current) e.preventDefault(); }}
                  onDragStart={(e) => e.preventDefault()}
                  className={`relative shrink-0 px-6 py-5 font-display text-base tracking-[0.2em] transition-colors ${
                    isActive ? "text-white" : "text-white/30 hover:text-white/70"
                  }`}
                >
                  {h.year}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-racing-red" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Year header ── */}
        <div className="px-8 pb-8 pt-10 md:px-14">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-6 bg-racing-red" />
            <span className="font-display text-[10px] tracking-[0.4em] text-racing-red">GALLERY</span>
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
        {photos.length > 0 && (
          <EditorialGrid photos={photos} onSelect={setLightboxIdx} />
        )}

        <div className="h-16" />
      </main>

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
      className="group relative h-full w-full overflow-hidden bg-racing-black"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </button>
  );
}

function buildGridItems(
  photos: string[],
  patterns: { colSpans: number[]; height: string }[],
  totalCols: number,
): { src: string; idx: number; colSpan: number; height: string }[] {
  const items: { src: string; idx: number; colSpan: number; height: string }[] = [];
  let i = 0;
  let p = 0;
  while (i < photos.length) {
    const pat = patterns[p % patterns.length];
    const count = Math.min(pat.colSpans.length, photos.length - i);
    const colPerPhoto = Math.floor(totalCols / count);
    const remainder = totalCols - colPerPhoto * count;
    for (let j = 0; j < count; j++) {
      const colSpan = count === pat.colSpans.length
        ? pat.colSpans[j]
        : colPerPhoto + (j === 0 ? remainder : 0);
      items.push({ src: photos[i + j], idx: i + j, colSpan, height: pat.height });
    }
    i += count;
    p++;
  }
  return items;
}

function EditorialGrid({ photos, onSelect }: { photos: string[]; onSelect: (i: number) => void }) {
  const desktopPatterns: { colSpans: number[]; height: string }[] = [
    { colSpans: [6],       height: "52vh" },
    { colSpans: [4, 2],    height: "44vh" },
    { colSpans: [2, 2, 2], height: "38vh" },
    { colSpans: [2, 4],    height: "44vh" },
    { colSpans: [2, 2, 2], height: "38vh" },
  ];

  const mobilePatterns: { colSpans: number[]; height: string }[] = [
    { colSpans: [2],    height: "68vw" },
    { colSpans: [1, 1], height: "50vw" },
    { colSpans: [1, 1], height: "50vw" },
  ];

  const desktopItems = buildGridItems(photos, desktopPatterns, 6);
  const mobileItems  = buildGridItems(photos, mobilePatterns,  2);

  return (
    <>
      {/* Mobile grid (< md) */}
      <div
        className="md:hidden"
        style={{ padding: "0 0.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}
      >
        {mobileItems.map((item) => (
          <div
            key={item.idx}
            style={{ gridColumn: `span ${item.colSpan}`, height: item.height, overflow: "hidden", borderRadius: 2 }}
          >
            <Photo src={item.src} alt={`photo ${item.idx + 1}`} onClick={() => onSelect(item.idx)} />
          </div>
        ))}
      </div>
      {/* Desktop grid (>= md) */}
      <div
        className="hidden md:grid"
        style={{ padding: "0 7rem", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}
      >
        {desktopItems.map((item) => (
          <div
            key={item.idx}
            style={{ gridColumn: `span ${item.colSpan}`, height: item.height, overflow: "hidden", borderRadius: 2 }}
          >
            <Photo src={item.src} alt={`photo ${item.idx + 1}`} onClick={() => onSelect(item.idx)} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Lightbox ── */
function Lightbox({ photos, title, idx, onNext, onPrev, onClose }: {
  photos: string[]; title: string; idx: number;
  onNext: () => void; onPrev: () => void; onClose: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null;
        touchStartY.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) onNext(); else onPrev();
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img key={photos[idx]} src={photos[idx]} alt={`${title} ${idx + 1}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
        style={{ imageRendering: "auto" }}
      />
      <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-6 pb-20 pt-6"
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
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-3 px-6 pb-8 pt-20"
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
            <span className="font-display text-5xl text-white/40 transition-colors duration-200 md:text-white/0 group-hover:text-white/60">‹</span>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="次の写真"
            className="absolute right-0 top-0 z-10 flex h-full w-[15%] items-center justify-end pr-5 group"
          >
            <span className="font-display text-5xl text-white/40 transition-colors duration-200 md:text-white/0 group-hover:text-white/60">›</span>
          </button>
        </>
      )}
    </motion.div>
  );
}
