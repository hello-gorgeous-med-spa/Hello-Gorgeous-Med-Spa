import { redirect } from "next/navigation";

/** Legacy path — canonical RE GEN hair & skin hub is /rx/hair-skin */
export default function DermatologyRedirectPage() {
  redirect("/rx/hair-skin");
}
