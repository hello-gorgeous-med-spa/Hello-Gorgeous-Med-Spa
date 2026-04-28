-- Allow org staff to INSERT FAQs via dashboard API/client RLS
GRANT INSERT ON public.ai_concierge_knowledge TO authenticated;

CREATE POLICY "Staff insert ai_concierge_knowledge"
  ON public.ai_concierge_knowledge
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_org_staff());

-- Seed initial knowledge (idempotent per question text)
INSERT INTO public.ai_concierge_knowledge (category, question, answer, enabled)
SELECT * FROM (VALUES
  ('hours', 'What are your hours?', 'We''re open 7 days a week! Hours vary, so I can connect you with Dani who can tell you what works best for your schedule.', true),
  ('location', 'Where are you located?', 'We''re at 74 West Washington Street in downtown Oswego, right across from the Oswego Municipal Building.', true),
  ('pricing', 'How much does Morpheus8 cost?', 'Pricing varies based on the treatment area and your specific goals. When Dani texts to confirm your appointment, she''ll go over exact pricing and can customize a treatment plan for you.', true),
  ('services', 'What is Morpheus8?', 'Morpheus8 is radiofrequency microneedling that''s fantastic for skin tightening and improving texture. It uses tiny needles with RF energy to stimulate collagen deep in the skin.', true),
  ('services', 'What''s the difference between Morpheus8 and CO2 laser?', 'Both are amazing for skin rejuvenation! Morpheus8 uses radiofrequency with tiny needles for tightening and texture. CO2 laser is more for resurfacing and treating sun damage and pigmentation. They work great together too!', true),
  ('policies', 'Do you take insurance?', 'We don''t take insurance directly, but we do accept CareCredit and Cherry financing, which makes treatments very affordable with monthly payments.', true),
  ('policies', 'What''s your cancellation policy?', 'We ask for 24-hour notice for cancellations. Dani will go over all the details when she confirms your appointment!', true)
) AS v(category, question, answer, enabled)
WHERE NOT EXISTS (
  SELECT 1 FROM public.ai_concierge_knowledge k WHERE k.question = v.question
);
