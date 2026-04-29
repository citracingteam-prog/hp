import type { Metadata } from "next";
import Link from "next/link";
import sponsorsJson from "@/content/sponsors.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Company } from "@/lib/data";

export const metadata: Metadata = {
  title: "SPONSORS | CIT-Racing",
  description: "CIT-Racing Team を支えてくださるスポンサー企業の詳細紹介",
};

export default function SponsorsPage() {
  const allCompanies = sponsorsJson as Company[];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-racing-black pb-24 pt-28">

        {/* Recruitment notice */}
        <div className="border-b border-t border-racing-red/40 bg-racing-red/10 px-5 py-4 text-center md:px-10">
          <p className="text-sm leading-relaxed text-racing-white">
            ご支援いただける企業様・個人スポンサー様を募集中！
            <Link
              href="/#contact"
              className="ml-2 inline-flex items-center gap-1 font-display text-xs tracking-widest text-racing-red underline underline-offset-2 hover:opacity-70"
            >
              CONTACT ページよりお進みください →
            </Link>
          </p>
        </div>

        <div className="px-5 md:px-10">
          <div className="mx-auto max-w-[1200px]">

            {/* Section title bar */}
            <div className="mt-10 border border-white/15 bg-racing-carbon px-6 py-4">
              <h1 className="font-display text-sm tracking-[0.2em] text-racing-white md:text-base">
                2025年度ご支援いただいているスポンサー様一覧
                <span className="ml-3 text-[11px] text-racing-white/40">（敬称略、順不同）</span>
              </h1>
            </div>

            {/* Sponsor grid — flat list, no visible category separators */}
            <div className="mt-0 border border-t-0 border-white/15">
              <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 md:grid-cols-3">
                {allCompanies.map((company, i) => (
                  <div
                    key={i}
                    className={`flex flex-col border-white/10 ${
                      /* right border except last in row */
                      "sm:[&:not(:nth-child(2n))]:border-r md:[&:not(:nth-child(3n))]:border-r sm:border-b md:border-b"
                    }`}
                  >
                    {/* Logo area */}
                    <div className="flex h-36 items-center justify-center bg-white p-6">
                      {company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="max-h-full max-w-[200px] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-display text-lg font-bold text-racing-black">
                          {company.name}
                        </span>
                      )}
                    </div>

                    {/* Description area */}
                    <div className="flex flex-1 flex-col gap-2 border-t border-white/10 bg-racing-carbon p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-xs font-bold tracking-wide text-racing-white">
                          {company.name}
                        </span>
                        {company.url && (
                          <a
                            href={company.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display text-[9px] tracking-[0.25em] text-racing-red transition-opacity hover:opacity-70"
                          >
                            SITE →
                          </a>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-racing-white/60">
                        {company.description ?? "支援内容は準備中です。"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                href="/#sponsors"
                className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.3em] text-racing-white/40 transition-colors hover:text-racing-red"
              >
                ← BACK TO TOP
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
