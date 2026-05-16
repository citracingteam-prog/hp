import specialThanksJson from "@/content/special-thanks.json";
import { SpecialThanksEditor } from "@/components/admin/editors/SpecialThanksEditor";

export default function SpecialThanksPage() {
  return <SpecialThanksEditor initial={specialThanksJson as string[]} />;
}
