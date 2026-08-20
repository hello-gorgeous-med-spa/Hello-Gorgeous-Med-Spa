import { permanentRedirect } from "next/navigation";

/** Public BPC-157 marketing is paused. Staff catalog still holds the SKU. */
export default function Bpc157LearnPage() {
  permanentRedirect("/rx");
}
