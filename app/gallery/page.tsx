import type { Metadata } from "next";
import galleryJson from "@/content/gallery.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "GALLERY",
  description: "CIT-Racing Team の活動写真ギャラリー",
};

type GalleryItem = { src: string; caption: string };

export default function GalleryPage() {
  const items = galleryJson as GalleryItem[];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-racing-black px-5 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-racing-red" />
              <span className="font-display text-xs tracking-[0.4em] text-racing-red">
                PHOTO
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight text-racing-white md:text-7xl">
              GALLERY
            </h1>
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="flex h-64 items-center justify-center border border-dashed border-white/10 text-racing-white/40">
              写真は準備中です
            </div>
          ) : (
            <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
              {items.map((item, i) => (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
