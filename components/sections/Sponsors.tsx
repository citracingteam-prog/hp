"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/AnimatedText";
import { Marquee } from "@/components/ui/Marquee";
import { SPONSORS, SPECIAL_THANKS, type Company } from "@/lib/data";

export function Sponsors() {
  const sponsorsWithLogo = SPONSORS.filter((c) => c.logo);
  const half = Math.ceil(sponsorsWithLogo.length / 2);
  const rowA = sponsorsWithLogo.slice(0, half);
  const rowB = sponsorsWithLogo.slice(half);

  return (
    <section id="sponsors" className="relative bg-racing-black px-0 py-24 md:py-32">
      <div className="px-5 md:px-10">
        <div className="mx-auto max-w-[1600px] text-center">
          <FadeIn>
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-racing-red" />
              <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                OUR PARTNERS
              </span>
              <span className="h-px w-12 bg-racing-red" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              SPONSORS
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-racing-white/70">
              動力系から開発ツール、素材・制動・冷却まで——
              各領域の企業の皆さまに、資金・物品・技術でご支援いただいています。
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-6">
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 border border-racing-red px-6 py-2.5 font-display text-sm tracking-[0.3em] text-racing-red transition-all hover:bg-racing-red hover:text-racing-black"
              >
                <span aria-hidden>›</span>
                MORE
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mt-14 space-y-6 md:mt-20">
        <Marquee direction="left">
          {rowA.map((c, idx) => (
            <SponsorBox key={idx} company={c} />
          ))}
        </Marquee>
        <Marquee direction="right">
          {rowB.map((c, idx) => (
            <SponsorBox key={idx} company={c} />
          ))}
        </Marquee>
      </div>

      <div className="mt-16 px-5 md:mt-20 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <FadeIn>
            <div className="relative overflow-hidden border border-white/10 bg-racing-carbon p-8 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-racing-red/[0.08] blur-3xl"
              />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-display text-[11px] tracking-[0.35em] text-racing-red">
                    SPECIAL THANKS
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-wide">
                    いつも支えてくださる皆さまへ
                  </h3>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-racing-white/70">
                  活動場所、設備、そしてOB・OGの技術的助言が、私たちの挑戦を支えています。
                </p>
              </div>
              <ul className="relative mt-6 grid gap-2 text-sm text-racing-white/85 md:grid-cols-2">
                {SPECIAL_THANKS.map((t) => (
                  <li key={t} className="flex items-start gap-3 leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-3 shrink-0 bg-racing-red"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-14 text-center">
              <a
                href="#sponsorship"
                className="inline-flex items-center gap-2 font-display text-xs tracking-[0.3em] text-racing-white/70 transition-colors hover:text-racing-red"
              >
                ご支援について詳しく
                <span aria-hidden>→</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function SponsorBox({ company }: { company: Company }) {
  const wrapperClass =
    "group relative h-24 w-64 shrink-0 overflow-hidden border border-white/10 bg-white transition-all hover:border-racing-red";
  const inner = (
    <>
      <div className="absolute inset-0 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={company.logo!}
          alt={company.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-racing-red transition-transform duration-500 group-hover:scale-x-100"
      />
    </>
  );

  if (company.url) {
    return (
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={company.name}
        className={wrapperClass}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={wrapperClass} aria-label={company.name}>
      {inner}
    </div>
  );
}
