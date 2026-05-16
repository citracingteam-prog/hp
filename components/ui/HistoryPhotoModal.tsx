"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  photos: string[];
  title: string;
  idx: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
};

export function HistoryPhotoModal({ photos, title, idx, onNext, onPrev, onClose }: Props) {
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

  const current = photos[idx];
  const total = photos.length;

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
              {idx + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
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
            key={current}
            src={current}
            alt={`${title} ${idx + 1}`}
            className="mx-auto max-h-[72vh] w-full object-contain"
          />

          {/* Side nav buttons */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-0 top-0 flex h-full w-14 items-center justify-center bg-gradient-to-r from-black/40 to-transparent font-display text-xl text-racing-white/40 transition-colors hover:text-racing-red"
                aria-label="前の写真"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-0 top-0 flex h-full w-14 items-center justify-center bg-gradient-to-l from-black/40 to-transparent font-display text-xl text-racing-white/40 transition-colors hover:text-racing-red"
                aria-label="次の写真"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
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
