import { redirect } from "next/navigation";
import { HISTORY } from "@/lib/data";

export default function HistoryGalleryIndexPage() {
  const latest = HISTORY[HISTORY.length - 1];
  redirect(`/gallery/history/${latest.year}`);
}
