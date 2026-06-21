import { permanentRedirect } from "next/navigation";

/** Legacy URL — stretch mark content now lives on the canonical Solaria CO₂ Oswego page. */
export default function StretchMarkTreatmentRedirectPage() {
  permanentRedirect("/solaria-co2-oswego");
}
