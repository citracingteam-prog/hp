"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM_VIDEO } from "@/lib/data";

type Phase = "dialog" | "playing";

export function TeamVideoIntro({ onComplete }: { onComplete?: () => void }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("dialog");
  const completedRef = useRef(false);

  const fireComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* ignore */
    }
    if (reduced) {
      fireComplete();
      return;
    }
    const raf = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(raf);
  }, [fireComplete]);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const handlePlay = useCallback(() => {
    setPhase("playing");
  }, []);

  const handleSkip = useCallback(() => {
    setActive(false);
    fireComplete();
  }, [fireComplete]);

  const embedSrc = `${TEAM_VIDEO.embedUrl}${TEAM_VIDEO.embedUrl.includes("?") ? "&" : "?"}autoplay=1`;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="team-video-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[70] overflow-hidden bg-racing-black"
        >
          {/* Dialog phase */}
          <AnimatePresence>
            {phase === "dialog" && (
              <motion.div
                key="dialog"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center"
              >
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-racing-red" />
                  <span className="font-display text-[10px] tracking-[0.4em] text-racing-red">
                    CIT RACING
                  </span>
                  <span className="h-px w-12 bg-racing-red" />
                </div>

                <div className="space-y-3">
                  <p className="font-display text-xs tracking-[0.3em] text-racing-white/50">
                    TEAM VIDEO 2025
                  </p>
                  <h2 className="font-display text-2xl font-bold tracking-wider text-racing-white md:text-3xl">
                    音声を流しますか？
                  </h2>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePlay}
                    className="font-display text-sm font-semibold tracking-[0.25em] bg-racing-red px-10 py-4 text-racing-white transition-colors hover:bg-racing-crimson"
                  >
                    はい
                  </button>
                  <button
                    onClick={handlePlay}
                    className="font-display text-sm font-semibold tracking-[0.25em] border border-racing-white/30 px-10 py-4 text-racing-white transition-colors hover:bg-racing-white/10"
                  >
                    いいえ
                  </button>
                </div>

                <button
                  onClick={handleSkip}
                  className="font-display text-[11px] tracking-[0.35em] text-racing-white/35 transition-colors hover:text-racing-white/60"
                >
                  SKIP →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video phase */}
          <AnimatePresence>
            {phase === "playing" && (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <iframe
                  src={embedSrc}
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="CIT-Racing Team Video 2025"
                />

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  onClick={handleSkip}
                  className="absolute bottom-8 right-8 flex items-center gap-2 border border-racing-white/15 bg-racing-black/60 px-4 py-2 font-display text-xs tracking-[0.35em] text-racing-white/50 backdrop-blur-sm transition-colors hover:text-racing-white"
                >
                  SKIP →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
