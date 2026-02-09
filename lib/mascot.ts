// ============================================================
// Hello Gorgeous Mascot — script, intro video, feedback intent
// Used by widget, API, and docs.
// ============================================================

/** Short version for chat welcome / first message */
export const MASCOT_WELCOME =
  "Hi! I'm the Hello Gorgeous assistant — think of me as Danielle's mini me, built so you can get help anytime. I can answer questions about our services, hours, booking, and supplements. Need to book, get in touch, or send something straight to the owner? I'm here. Just ask!";

/** Full "who she is" script — for Business Memory, widget knowledge, and the intro video */
export const MASCOT_SCRIPT = {
  whoSheIs:
    "I'm the Hello Gorgeous assistant — your mini version of Danielle, the owner. I was built to stand in for her when you need anything: answers about services, booking, hours, supplements, or to get a message, feedback, or request straight to her.",
  whatSheCanDo:
    "I can answer questions about our services, location, hours, and practitioner-grade supplements (Fullscript). I can help you book an appointment or get our phone number. If you have feedback, a complaint, or need the owner to follow up, I'll send it right to Danielle so she has everything she needs to take care of you.",
  howToUseHer:
    "Just type or use the mic — ask about services, book now, or say you want to speak to the owner or leave feedback. Use the buttons to Book now or Call us. Everything you send to the owner (feedback, requests, complaints) comes to me first, and I make sure Danielle gets it.",
};

/** Path for the mascot intro video (waving + script). Put your file at public/videos/mascots/hello-gorgeous-intro.mp4 */
export const MASCOT_INTRO_VIDEO_PATH = "/videos/mascots/hello-gorgeous-intro.mp4";

/** Keywords that suggest the user wants to reach the owner / leave feedback / complain */
export const FEEDBACK_OWNER_KEYWORDS = [
  "owner",
  "danielle",
  "manager",
  "complaint",
  "complaints",
  "feedback",
  "unhappy",
  "issue",
  "problem",
  "callback",
  "call me back",
  "speak to someone",
  "talk to someone",
  "human",
  "real person",
  "request",
  "concern",
  "escalate",
];

export function isFeedbackOrOwnerIntent(message: string): boolean {
  const lower = message.toLowerCase().trim();
  return FEEDBACK_OWNER_KEYWORDS.some((k) => lower.includes(k));
}
