"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedText";
import { MEMBERS } from "@/lib/data";

export function Members() {
  return (
    <section
      id="members"
      className="relative bg-racing-carbon px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-12 bg-racing-red" />
                <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                  2026 ROSTER
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                THE ENGINEERS
                <br />& DRIVERS
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <p className="max-w-sm text-sm leading-relaxed text-racing-white/70">
              2026年度体制。学部2年を中心にしたチームが、班ごとの専門性を持ち寄って一台のマシンを完成させます。
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-px bg-white/10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {MEMBERS.map((m, i) => (
            <motion.article
              key={m.id}
              tabIndex={0}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative flex flex-col bg-racing-black transition-colors hover:bg-racing-carbon focus:bg-racing-carbon focus:outline-none"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-racing-carbon">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    className={`h-full w-full ${
                      m.photoOffsetY ? "-translate-y-[15px]" : "-translate-y-[5px]"
                    } object-cover object-top grayscale brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 group-focus:scale-105 group-focus:grayscale-0 group-focus:brightness-100`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-[10px] tracking-[0.3em] text-racing-white/30">
                    NO IMAGE
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-racing-black via-racing-black/20 to-transparent" />
                <div className="absolute left-3 top-3 border border-white/20 bg-racing-black/50 px-2 py-0.5 font-display text-[9px] tracking-[0.2em] text-racing-white/80 backdrop-blur-sm">
                  {m.year}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="font-display text-[9px] tracking-[0.3em] text-racing-red">
                    {m.squad}
                  </div>
                  <div className="mt-0.5 font-display text-[9px] tracking-[0.25em] text-racing-white/50">
                    No. {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4 md:p-5">
                <h3 className="font-display text-lg font-bold leading-tight tracking-wide md:text-xl">
                  {m.name}
                </h3>
                <div className="font-display text-[10px] tracking-[0.25em] text-racing-white/50">
                  {m.reading}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-racing-white/75">
                  {m.role}
                </p>
              </div>

              <div className="absolute left-0 top-0 z-10 h-0 w-[2px] bg-racing-red transition-all duration-500 group-hover:h-full group-focus:h-full" />
            </motion.article>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col justify-center gap-2 bg-racing-black p-5 text-center"
          >
            <div className="font-display text-[9px] tracking-[0.3em] text-racing-red">
              + MORE CREW
            </div>
            <p className="mx-auto max-w-[18ch] text-xs leading-relaxed text-racing-white/70">
              各班には設計・製造・試験走行を支える30名規模のメンバーが所属しています。
            </p>
            <a
              href="#contact"
              className="mt-1 inline-flex items-center justify-center gap-2 font-display text-[10px] tracking-[0.25em] text-racing-white transition-colors hover:text-racing-red"
            >
              チームに関わる
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
