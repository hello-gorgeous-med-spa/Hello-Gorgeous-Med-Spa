import { PeptideLearnPageShell, peptideLearnMetadata } from "@/components/peptides/PeptideLearnPageShell";
import { SERMORELIN_LEARN_PAGE } from "@/lib/sermorelin-learn";

export const metadata = peptideLearnMetadata(SERMORELIN_LEARN_PAGE);

export const revalidate = 3600;

export default function SermorelinLearnPage() {
  return <PeptideLearnPageShell page={SERMORELIN_LEARN_PAGE} />;
}
