/** Quantum RF clinical model call — 3 reduced-investment model spots. Update dates/availability here only. */
export const QUANTUM_RF_MODEL = {
  headline: "Quantum RF Clinical Model Experience",
  /** YYYY-MM-DD in America/Chicago (display copy below is human-facing) */
  eventDateLocal: "2026-05-04",
  /** ISO for schema.org — procedure block at med spa; adjust if schedule changes */
  startDateIso: "2026-05-04T10:00:00-05:00",
  endDateIso: "2026-05-04T16:00:00-05:00",
  display: {
    dateLine: "Monday, May 4, 2026",
    timeNote: "Procedure timing confirmed at your candidacy visit — clinical block at Hello Gorgeous, Oswego",
  },
  spots: 3,
  provider: {
    primary: "Ryan Kent, FNP-BC",
    supervision: "MD supervision on site",
  },
  investmentNote: "Reduced model investment (details at consultation — not a giveaway)",
} as const;
