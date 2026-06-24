import { redirect } from "next/navigation";

export const revalidate = 3600;

/** Legacy men's peptide URL — canonical hub is /peptides */
export default function PeptideTherapyMenPage() {
  redirect("/peptides");
}
