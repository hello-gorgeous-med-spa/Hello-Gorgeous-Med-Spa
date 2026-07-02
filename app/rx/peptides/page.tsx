import { redirect } from "next/navigation";

/** Canonical peptide hub is /peptides (see next.config.js redirect). */
export default function RxPeptidesRedirectPage() {
  redirect("/peptides");
}
