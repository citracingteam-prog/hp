import galleryJson from "@/content/gallery.json";
import { GalleryEditor, type GalleryItem } from "@/components/admin/editors/GalleryEditor";

export default function GalleryPage() {
  return <GalleryEditor initial={galleryJson as GalleryItem[]} />;
}
