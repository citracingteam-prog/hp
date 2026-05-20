import fs from "fs";
import path from "path";
import { YearGalleryClient } from "./YearGalleryClient";

type GalleryYear = { year: string; headline: string; photos: string[] };

function loadGalleryYears(): GalleryYear[] {
  const filePath = path.join(process.cwd(), "content", "gallery-years.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as GalleryYear[];
}

export default function YearGalleryPage() {
  const galleryYears = loadGalleryYears();
  return <YearGalleryClient galleryYears={galleryYears} />;
}

export const dynamic = "force-dynamic";
