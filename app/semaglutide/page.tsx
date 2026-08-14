import { PeptideLearnPageShell, peptideLearnMetadata } from "@/components/peptides/PeptideLearnPageShell";
import { SEMAGLUTIDE_LEARN_PAGE } from "@/lib/semaglutide-learn";

export const metadata = peptideLearnMetadata(SEMAGLUTIDE_LEARN_PAGE);

export const revalidate = 3600;

export default function SemaglutideLearnPage() {
  return <PeptideLearnPageShell page={SEMAGLUTIDE_LEARN_PAGE} />;
}
