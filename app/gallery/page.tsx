import type { Metadata } from "next";
import galleryJson from "@/content/gallery.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "HIGHLIGHT",
  description: "CIT-Racing Team のハイライト写真",
};

type GalleryItem = { src: string; caption: string; category: string };

export default function GalleryPage() {
  const items = galleryJson as GalleryItem[];

  // カテゴリーごとにグループ化（順序を保持）
  const groups: { category: string; items: GalleryItem[] }[] = [];
  for (const item of items) {
    const cat = item.category?.trim() || "その他";
    const existing = groups.find((g) => g.category === cat);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ category: cat, items: [item] });
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-racing-black px-5 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Page header */}
          <div className="mb-16">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-racing-red" />
              <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                PHOTO
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-racing-white md:text-7xl">
              HIGHLIGHT
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="flex h-64 items-center justify-center border border-dashed border-white/10 text-racing-white/40">
              写真は準備中です
            </div>
          ) : (
            <div className="space-y-20">
              {groups.map((group) => (
                <section key={group.category}>
                  {/* Category heading */}
                  <div className="mb-6 flex items-center gap-4">
                    <span className="h-[2px] w-8 bg-racing-red" />
                    <h2 className="font-display text-sm tracking-[0.4em] text-racing-white">
                      {group.category}
                    </h2>
                    <span className="font-display text-[11px] text-racing-white/30">
                      {group.items.length} PHOTOS
                    </span>
                    <span className="flex-1 border-t border-white/10" />
                  </div>

                  {/* Masonry grid */}
                  <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
                    {group.items.map((item, i) => (
                      <div key={i} className="mb-3 break-inside-avoid">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt={item.caption || ""}
                          className="w-full object-cover"
                          loading="lazy"
                        />
                        {item.caption && (
                          <p className="mt-1.5 text-[11px] text-racing-white/50">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
