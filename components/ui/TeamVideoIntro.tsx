"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "dialog" | "playing";

export function TeamVideoIntro({ onComplete }: { onComplete?: () => void }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("dialog");
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const fireComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setActive(false);
    fireComplete();
  }, [fireComplete]);

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

  useEffect(() => {
    if (phase !== "playing" || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = muted;
    v.play().catch(() => {
      /* autoplay blocked — skip button still available */
    });
  }, [phase, muted]);

  const handleAudioChoice = useCallback((withAudio: boolean) => {
    setMuted(!withAudio);
    setPhase("playing");
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="team-video-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[70] overflow-hidden bg-racing-black"
        >
          {/* Video */}
          <video
            ref={videoRef}
            src="/shinkan-pv.mp4"
            playsInline
            muted
            preload="auto"
            onEnded={handleSkip}
            onError={handleSkip}
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              phase === "playing" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Gradient overlay during playback */}
          {phase === "playing" && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-racing-black/50 via-transparent to-racing-black/70" />
          )}

          {/* Dialog */}
          <AnimatePresence>
            {phase === "dialog" && (
              <motion.div
                key="dialog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative flex h-full flex-col items-center justify-center gap-10 px-6 text-center"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-x-0 top-0 h-[2px] origin-left bg-racing-red"
                />

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-racing-red" />
                    <span className="font-display text-[10px] tracking-[0.5em] text-racing-red">
                      CIT RACING
                    </span>
                    <span className="h-px w-10 bg-racing-red" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display text-[11px] tracking-[0.35em] text-racing-white/40">
                      TEAM VIDEO 2025
                    </p>
                    <h2 className="font-display text-3xl font-bold tracking-wider text-racing-white md:text-4xl">
                      音声を流しますか？
                    </h2>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex gap-4"
                >
                  <button
                    onClick={() => handleAudioChoice(true)}
                    className="bg-racing-red px-12 py-4 font-display text-sm font-semibold tracking-[0.3em] text-racing-white transition-colors hover:bg-racing-crimson"
                  >
                    はい
                  </button>
                  <button
                    onClick={() => handleAudioChoice(false)}
                    className="border border-racing-white/20 px-12 py-4 font-display text-sm font-semibold tracking-[0.3em] text-racing-white transition-colors hover:border-racing-white/50 hover:bg-racing-white/5"
                  >
                    いいえ
                  </button>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={handleSkip}
                  className="font-display text-[11px] tracking-[0.4em] text-racing-white/25 transition-colors hover:text-racing-white/55"
                >
                  SKIP →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playback UI */}
          {phase === "playing" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute left-8 top-8 z-10 flex items-center gap-3"
              >
                <span className="h-5 w-[2px] bg-racing-red" />
                <span className="font-display text-xs tracking-[0.35em] text-racing-white/70">
                  CIT RACING — 2025
                </span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.6 }}
                onClick={handleSkip}
                className="absolute bottom-10 right-8 z-10 font-display text-xs tracking-[0.4em] text-racing-white/45 transition-colors hover:text-racing-white"
              >
                SKIP →
              </motion.button>

              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-racing-white/10">
                <motion.div
                  className="h-full bg-racing-red"
                  style={{ scaleX: progress, transformOrigin: "left" }}
                  transition={{ duration: 0 }}
                />
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
