import { PeptideLearnPageShell, peptideLearnMetadata } from "@/components/peptides/PeptideLearnPageShell";
import { BPC157_LEARN_PAGE } from "@/lib/bpc-157-learn";

export const metadata = peptideLearnMetadata(BPC157_LEARN_PAGE);

export const revalidate = 3600;

export default function Bpc157LearnPage() {
  return <PeptideLearnPageShell page={BPC157_LEARN_PAGE} />;
}
