import { permanentRedirect } from "next/navigation";

/** GHK-Cu / peptide-finder campaign is offline pending compliance review. */
export default function FindYourPeptidePage() {
  permanentRedirect("/rx/request");
}
