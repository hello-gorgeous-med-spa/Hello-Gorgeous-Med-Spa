/** Claude tools for Sarah (voice concierge). */
export function sarahTools() {
  return [
    {
      name: "collect_booking_info",
      description:
        "Call once you have collected at minimum the caller's full name, phone number, and requested service. Include preferred date/time when known.",
      input_schema: {
        type: "object",
        properties: {
          client_name: { type: "string" },
          client_phone: { type: "string" },
          service: { type: "string" },
          preferred_date: { type: "string" },
          preferred_time: { type: "string" },
          is_new_client: { type: "boolean" },
        },
        required: ["client_name", "client_phone", "service"],
      },
    },
    {
      name: "transfer_call",
      description:
        "Call when the caller should speak with Dani (or staff) immediately — live schedule, billing, medical nuance, or explicit request for a human.",
      input_schema: {
        type: "object",
        properties: {
          reason: { type: "string" },
        },
        required: ["reason"],
      },
    },
  ];
}
