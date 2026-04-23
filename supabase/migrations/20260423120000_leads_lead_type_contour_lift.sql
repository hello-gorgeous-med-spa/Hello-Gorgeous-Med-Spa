-- Allow Contour Lift™ inquiry leads (app uses lead_type = 'contour_lift' in lib/leads.ts)
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_lead_type_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_lead_type_check CHECK (lead_type IN (
  'contact_form',
  'roadmap',
  'hormone',
  'face',
  'quiz',
  'social',
  'concern',
  'subscribe',
  'waitlist',
  'contour_lift',
  'other'
));
