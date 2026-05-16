import history from "@/content/history.json";
import type { HistoryEntry } from "@/lib/data";
import { HistoryGalleryEditor } from "@/components/admin/editors/HistoryGalleryEditor";

export default function GalleryHistoryPage() {
  return <HistoryGalleryEditor initial={history as HistoryEntry[]} />;
}
