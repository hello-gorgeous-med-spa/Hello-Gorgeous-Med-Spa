-- Update Ryan's headshot to real clinical image (replaces cartoon)
UPDATE providers
SET headshot_url = 'https://hellogorgeousmedspa.com/images/providers/ryan-kent-clinic.jpg'
WHERE slug = 'ryan' OR id = '47ab9361-4a68-4ab8-a860-c9c9fd64d26c';
