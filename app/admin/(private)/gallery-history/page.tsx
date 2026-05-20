import galleryYears from "@/content/gallery-years.json";
import { GalleryYearsEditor } from "@/components/admin/editors/GalleryYearsEditor";

type GalleryYear = { year: string; headline: string; photos: string[] };

export default function GalleryHistoryPage() {
  return <GalleryYearsEditor initial={galleryYears as GalleryYear[]} />;
}
