"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedText";
import { Countdown } from "@/components/ui/Countdown";
import { RACES } from "@/lib/data";
import { formatRaceDate } from "@/lib/utils";

export function Calendar() {
  const [now, setNow] = useState(() => Date.now());

  const upcomingRaces = RACES.filter(
    (r) => new Date(r.date).getTime() > now
  );
  const nextRace = upcomingRaces[0] ?? RACES[RACES.length - 1];

  const handleExpired = useCallback(() => {
    setNow(Date.now());
  }, []);

  return (
    <section
      id="calendar"
      className="relative bg-racing-carbon px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-12 bg-racing-red" />
                <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                  2026 RACE CALENDAR
                </span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                NEXT EVENT
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div className="text-right">
              <div className="font-display text-xs tracking-[0.3em] text-racing-gray">
                UPCOMING
              </div>
              <div className="mt-1 text-lg font-semibold md:text-xl">
                {nextRace.name}
              </div>
              <div className="text-sm text-racing-white/60">
                {formatRaceDate(nextRace.date).date}・{nextRace.location}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="relative mb-20 flex justify-center rounded-sm border border-white/10 bg-racing-black p-4 md:p-16">
            <div className="absolute -top-px left-0 h-px w-24 bg-racing-red" />
            <div className="absolute -bottom-px right-0 h-px w-24 bg-racing-red" />
            <Countdown target={nextRace.date} onExpired={handleExpired} />
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {RACES.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden border border-white/10 bg-racing-black"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={r.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-racing-black to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 border border-racing-red bg-racing-black/80 px-3 py-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-racing-red" />
                  <span className="font-display text-[10px] tracking-[0.25em] text-racing-red">
                    {new Date(r.date).getTime() > now ? "UPCOMING" : "FINISHED"}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <div className="font-display text-xs tracking-[0.25em] text-racing-gray">
                  {formatRaceDate(r.date).date}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold md:text-xl">
                  {r.name}
                </h3>
                <div className="mt-2 text-sm text-racing-white/60">
                  {r.location}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
