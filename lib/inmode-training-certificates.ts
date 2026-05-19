/** Official InMode training certificates — PDFs in /public/images/certificates/ */

export type InModeTrainingCertificate = {
  providerName: string;
  credentialLabel: string;
  trainingTitle: string;
  completedDate: string;
  file: string;
};

export const INMODE_TRAINING_ATTESTATION =
  "Training conducted by Wanda Cummings, RN BSN — VP Clinical Operations, InMode";

export const INMODE_TRAINING_CERTIFICATES: InModeTrainingCertificate[] = [
  {
    providerName: "Danielle Alcala-Glazier",
    credentialLabel: "Owner & Founder · Licensed Esthetician",
    trainingTitle: "Luxora: Morpheus8 Deep, Quantum 10/17",
    completedDate: "May 4, 2026",
    file: "/images/certificates/danielle-luxora-morpheus8-deep-quantum-inmode-cert.pdf",
  },
  {
    providerName: "Danielle Alcala-Glazier",
    credentialLabel: "Licensed Esthetician",
    trainingTitle: "Morpheus8 (Luxora)",
    completedDate: "March 20, 2026",
    file: "/images/certificates/danielle-morpheus8-inmode-cert.pdf",
  },
  {
    providerName: "Danielle Alcala-Glazier",
    credentialLabel: "Licensed Esthetician",
    trainingTitle: "Solaria CO₂",
    completedDate: "March 17, 2026",
    file: "/images/certificates/danielle-solaria-inmode-cert.pdf",
  },
  {
    providerName: "Ryan Kent, FNP-BC",
    credentialLabel: "Medical Director",
    trainingTitle: "Morpheus8 (Luxora)",
    completedDate: "March 20, 2026",
    file: "/images/certificates/ryan-morpheus8-inmode-cert.pdf",
  },
  {
    providerName: "Ryan Kent, FNP-BC",
    credentialLabel: "Medical Director",
    trainingTitle: "Solaria CO₂",
    completedDate: "March 17, 2026",
    file: "/images/certificates/ryan-solaria-inmode-cert.pdf",
  },
];

export const DANIELLE_INMODE_CERTIFICATES = INMODE_TRAINING_CERTIFICATES.filter((c) =>
  c.providerName.includes("Danielle"),
);
