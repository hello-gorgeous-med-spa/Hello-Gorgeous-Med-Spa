/** WebVTT captions paired with InMode clinic MP4s (same basename, .vtt extension). */

export const INMODE_CLINIC_VIDEO_CAPTIONS: Record<string, string> = {
  "/videos/solaria/solaria-co2-clinic-reedit-oswego.mp4":
    "/videos/solaria/solaria-co2-clinic-reedit-oswego.vtt",
  "/videos/quantum/quantum-rf-clinic-reedit-oswego.mp4":
    "/videos/quantum/quantum-rf-clinic-reedit-oswego.vtt",
  "/videos/morpheus8/morpheus8-burst-deep-treatment-oswego.mp4":
    "/videos/morpheus8/morpheus8-burst-deep-treatment-oswego.vtt",
  "/videos/morpheus8/morpheus8-burst-deep-faq-social.mp4":
    "/videos/morpheus8/morpheus8-burst-deep-faq-social.vtt",
};

/** Plain-text transcripts for VideoObject schema (matches cleaned WebVTT copy). */
export const INMODE_CLINIC_VIDEO_TRANSCRIPTS: Record<string, string> = {
  "/videos/solaria/solaria-co2-clinic-reedit-oswego.mp4":
    "We are so excited to introduce Solaria, our next-level CO₂ laser for glowing, healthy skin at Hello Gorgeous Med Spa in Oswego, Illinois. Solaria uses advanced fractional ablative technology to target fine lines, wrinkles, sun damage, and uneven texture — giving you smoother, brighter skin. We can treat the face and body with precision and comfort, making it a gold standard in skin resurfacing. Most patients notice results right away, and improvements continue over the next few months. Ready to refresh your skin and reveal your glow? Call us today to book your Solaria CO₂ consultation and get started.",
  "/videos/quantum/quantum-rf-clinic-reedit-oswego.mp4":
    "I am so excited today to talk to you about Quantum RF at Hello Gorgeous Med Spa in Oswego, Illinois. It's designed to tighten, lift, and contour with the latest innovation in non-surgical skin rejuvenation. This advanced treatment uses fractionated bipolar radiofrequency to stimulate collagen and firm skin, treating areas like the face, neck, arms, abdomen, and thighs. A tiny cannula delivers controlled heat under the skin to tighten tissue and improve elasticity. Patients see immediate improvements with results continuing as the skin naturally remodels over several weeks. Schedule your Quantum RF consultation today and experience firmer, more youthful skin.",
  "/videos/morpheus8/morpheus8-burst-deep-treatment-oswego.mp4":
    "Get the body you've been wanting with Morpheus8 Burst Deep at Hello Gorgeous Med Spa in Oswego, Illinois. It's a non-surgical treatment that firms your skin, smooths cellulite, and reshapes targeted areas. Safe for all skin types — it works on the stomach, thighs, upper arms, and back. Using Burst and stepless RF technology, it delivers energy deep into the skin to boost collagen for tighter, more toned results. Many patients see immediate improvements, with results continuing to enhance over several months. Feel confident and refreshed — call us today to book your complimentary Morpheus8 Burst Deep consultation.",
  "/videos/morpheus8/morpheus8-burst-deep-faq-social.mp4":
    "Realistically, anybody is a candidate for Morpheus8 Burst Deep — anyone who's looking to improve skin elasticity and tighten things up. Results appear pretty quickly; most show up in the first month or so, and continue to improve from there. Morpheus8 Burst Deep is different from other technologies — typical microneedling reaches up to two millimeters in depth. Burst technology reaches up to eight millimeters and targets the subdermal fat layer.",
};

export function captionsPathForClinicVideo(src: string): string | undefined {
  return INMODE_CLINIC_VIDEO_CAPTIONS[src];
}

export function transcriptForClinicVideo(src: string): string | undefined {
  return INMODE_CLINIC_VIDEO_TRANSCRIPTS[src];
}
