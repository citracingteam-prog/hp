"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/AnimatedText";
import { HISTORY, type HistoryEntry } from "@/lib/data";

export function History() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section
      id="history"
      ref={ref}
      className="relative overflow-hidden bg-racing-black py-20 md:py-32"
    >
      <motion.span
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 top-[6%] text-center font-display text-[clamp(8rem,22vw,22rem)] font-bold leading-none tracking-tight text-white/[0.025]"
      >
        2002—2026
      </motion.span>

      <div className="relative px-5 md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-5 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3 md:mb-6">
                <span className="h-px w-10 bg-racing-red md:w-12" />
                <span className="font-display text-[11px] tracking-[0.35em] text-racing-red md:text-xs md:tracking-[0.4em]">
                  OUR HISTORY
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-3xl font-bold leading-tight md:text-6xl">
                BUILT FROM <span className="text-racing-red">PASSION</span>.
                <br />
                DRIVEN BY ENGINEERING.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-racing-white/70 md:mt-6 md:text-lg">
                挑戦の軌跡が、今のCIT-Racingをつくっている。
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.25}>
            <Link
              href="/gallery/history"
              className="group inline-flex items-center gap-3 self-start border border-white/20 px-5 py-3 font-display text-[11px] tracking-[0.3em] text-racing-white transition-colors hover:border-racing-red hover:text-racing-red md:gap-4 md:px-6 md:py-3.5 md:text-xs md:tracking-[0.35em]"
            >
              VIEW ALL GALLERY
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>

      <div className="relative mt-10 md:mt-20">
        <FlowingStrip>
          {HISTORY.map((entry, i) => (
            <HistoryCard key={`${entry.year}-${i}`} entry={entry} />
          ))}
        </FlowingStrip>
      </div>
    </section>
  );
}

function FlowingStrip({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverPausedRef = useRef(false);
  const nudgePausedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();
    const SPEED = 75; // px/sec, faster flow

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const track = trackRef.current;
      const container = containerRef.current;
      if (track && container) {
        if (!hoverPausedRef.current && !nudgePausedRef.current) {
          const halfWidth = track.scrollWidth / 2;
          if (halfWidth > 0) {
            offsetRef.current -= SPEED * dt;
            if (offsetRef.current <= -halfWidth) offsetRef.current += halfWidth;
            else if (offsetRef.current > 0) offsetRef.current -= halfWidth;
            track.style.transform = `translateX(${offsetRef.current}px)`;
          }
        }

        // Find the single card closest to container center → instant snap focus
        const containerRect = container.getBoundingClientRect();
        const containerCenter =
          containerRect.left + containerRect.width / 2;

        const cards = track.querySelectorAll<HTMLElement>("[data-card]");
        let closest: HTMLElement | null = null;
        let closestDist = Infinity;
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - containerCenter);
          if (d < closestDist) {
            closestDist = d;
            closest = card;
          }
        });

        cards.forEach((card) => {
          const isActive = card === closest;
          const isHovered = card.dataset.hover === "1";
          const scale = isActive ? 1.15 : isHovered ? 0.86 : 0.78;
          const opacity = isActive ? 1 : 0.35;
          card.style.transform = `scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = isActive ? "30" : isHovered ? "20" : "0";

          const wasActive = card.hasAttribute("data-active");
          if (isActive && !wasActive) card.setAttribute("data-active", "");
          else if (!isActive && wasActive) card.removeAttribute("data-active");
        });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function nudge(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    const c1 = cards[0];
    const c2 = cards[1];
    const step = c1 && c2 ? c2.offsetLeft - c1.offsetLeft : (c1?.offsetWidth ?? 220) + 12;

    nudgePausedRef.current = true;
    track.style.transition = "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";

    offsetRef.current -= direction * step;
    const halfWidth = track.scrollWidth / 2;
    while (halfWidth > 0 && offsetRef.current <= -halfWidth)
      offsetRef.current += halfWidth;
    while (halfWidth > 0 && offsetRef.current > 0)
      offsetRef.current -= halfWidth;
    track.style.transform = `translateX(${offsetRef.current}px)`;

    setTimeout(() => {
      track.style.transition = "";
      nudgePausedRef.current = false;
    }, 310);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        hoverPausedRef.current = true;
      }}
      onMouseLeave={() => {
        hoverPausedRef.current = false;
      }}
    >
      <div className="relative overflow-hidden py-6 md:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30 h-full w-10 bg-gradient-to-r from-racing-black to-transparent md:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 z-30 h-full w-10 bg-gradient-to-l from-racing-black to-transparent md:w-32"
        />
        <div
          ref={trackRef}
          className="flex w-max items-center gap-3 md:gap-4"
          style={{ willChange: "transform" }}
        >
          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            {children}
          </div>
          <div
            className="flex shrink-0 items-center gap-3 md:gap-4"
            aria-hidden
          >
            {children}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="前のカードへ"
        className="absolute left-2 top-1/2 z-40 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-racing-black/70 text-racing-white/85 backdrop-blur-sm transition-all hover:border-racing-red hover:text-racing-red md:left-6 md:h-12 md:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 md:h-5 md:w-5"
        >
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="次のカードへ"
        className="absolute right-2 top-1/2 z-40 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-racing-black/70 text-racing-white/85 backdrop-blur-sm transition-all hover:border-racing-red hover:text-racing-red md:right-6 md:h-12 md:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 md:h-5 md:w-5"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const photo = entry.photos?.[0];

  return (
    <Link
      data-card
      href="/gallery/history"
      onMouseEnter={(e) => {
        e.currentTarget.dataset.hover = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.dataset.hover = "0";
      }}
      className="group/h-card relative block h-[340px] w-[220px] shrink-0 origin-center overflow-hidden border border-white/10 bg-racing-carbon transition-[transform,opacity,border-color,box-shadow] duration-[400ms] ease-out data-[active]:border-racing-red/40 data-[active]:shadow-2xl data-[active]:shadow-black/60 md:h-[460px] md:w-[300px]"
      style={{ transform: "scale(0.78)", opacity: 0.35 }}
    >
      <div className="relative h-full w-full overflow-hidden bg-racing-carbon">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={`${entry.year} - ${entry.headline}`}
            className="h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-racing-carbon via-racing-black to-racing-black">
            <span className="font-display text-7xl font-bold tabular-nums text-white/[0.06]">
              {entry.year}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-racing-black via-racing-black/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <div className="mb-1.5 font-display text-[9px] tracking-[0.3em] text-racing-red md:mb-2 md:text-[10px] md:tracking-[0.35em]">
          {entry.event}
        </div>
        <div className="font-display text-3xl font-bold leading-none tabular-nums text-racing-white md:text-5xl">
          {entry.year}
        </div>
        <h3 className="mt-1.5 font-display text-[13px] font-bold leading-tight text-racing-white md:mt-2 md:text-base">
          {entry.headline}
        </h3>

        {/* Detail only on active card */}
        <div className="max-h-0 translate-y-2 overflow-hidden opacity-0 transition-[opacity,max-height,transform] duration-[400ms] ease-out group-data-[active]/h-card:max-h-40 group-data-[active]/h-card:translate-y-0 group-data-[active]/h-card:opacity-100">
          {entry.detail && (
            <p className="mt-2 max-w-[200px] text-[11px] leading-relaxed text-racing-white/75 md:mt-3 md:max-w-[240px] md:text-[13px]">
              {entry.detail}
            </p>
          )}
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-racing-red transition-transform duration-500 group-hover/h-card:scale-x-100"
      />
    </Link>
  );
}
