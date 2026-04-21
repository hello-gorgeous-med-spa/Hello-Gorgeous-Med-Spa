/**
 * VIP Device Night — May 14, 2026 · Freddie's Off the Chain, Oswego
 * (Same evening as The Glow Social.) Update dates/venue/offers here; page and schema read from this file.
 */

export const VIP_DEVICE_NIGHT = {
  slugPath: "/events/vip-device-night",
  title: "VIP Device Night",
  headline: "Hello Gorgeous VIP Device Night",
  tagline: "Solaria · Morpheus8 Burst & Deep · Quantum RF — tacos, bites & cocktails",
  /** ISO 8601 for schema (Central Time — adjust if you publish exact end time) */
  startDateIso: "2026-05-14T18:00:00-05:00",
  endDateIso: "2026-05-14T21:00:00-05:00",
  display: {
    dateLine: "Thursday, May 14, 2026",
    timeLine: "6:00 PM",
    endTimeHint: "~9:00 PM",
  },
  venue: {
    name: "Freddie's Off the Chain",
    streetAddress: "11 S Madison St",
    addressLocality: "Oswego",
    addressRegion: "IL",
    postalCode: "60543",
    mapsQuery: "Freddie's Off the Chain 11 S Madison St Oswego IL",
  },
  /** Event neuromodulator pricing — confirm minimum units / product with clinical team */
  botoxEvent: {
    label: "Event Botox pricing",
    /** User specified “10 unit” — interpreted as $10/unit; change if you meant a 10-unit package */
    pricePerUnitDisplay: "$10/unit",
    footnote:
      "Medical evaluation required. Not all candidates are appropriate. Pricing valid for event night sign-ups only; details at check-in. Manufacturer and practice rules apply.",
  },
  hostedFood: "Appetizers & taco station on us — plus goodies to take home.",
  barNote: "Cash bar · 21+ to drink · please drink responsibly.",
  highlights: [
    "Meet Solaria CO₂, Morpheus8 Burst & Deep, and Quantum RF — how they fit your goals",
    "VIP-only device & treatment packages (sold that night)",
    "Raffles & prizes — extra entries for consults and package purchases",
    "Weight loss, filler, and skin tightening conversations with our team",
  ],
} as const;

export function vipDeviceNightMapsUrl(): string {
  const q = encodeURIComponent(VIP_DEVICE_NIGHT.venue.mapsQuery);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
