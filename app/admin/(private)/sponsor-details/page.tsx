import sponsorsJson from "@/content/sponsors.json";
import type { Company } from "@/lib/data";
import { SponsorDetailsEditor } from "@/components/admin/editors/SponsorDetailsEditor";

export default function SponsorDetailsPage() {
  return <SponsorDetailsEditor initial={sponsorsJson as Company[]} />;
}
