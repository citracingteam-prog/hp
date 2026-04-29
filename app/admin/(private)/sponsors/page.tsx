import sponsors from "@/content/sponsors.json";
import type { Company } from "@/lib/data";
import { SponsorsEditor } from "@/components/admin/editors/SponsorsEditor";

export default function SponsorsPage() {
  return <SponsorsEditor initial={sponsors as Company[]} />;
}
