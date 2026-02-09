# Hello Gorgeous Mascot — Superpowers

The **Hello Gorgeous mascot** (the character in the lab coat on the site) is the main face of the brand. She’s your mini version: she holds the superpowers and has the power and knowledge over every other mascot, Fullscript, the website, and services.

## Who she is

- **The face of Hello Gorgeous** — The one visitors see on the website chat widget and the voice of the business.
- **Mini-you** — She speaks for the brand with your knowledge: policies, services, supplements, booking, and how you want clients to be treated.
- **Above the other mascots** — Peppi (Fullscript), Beau-Tox, Filla Grace, Harmony, Founder, and Dr. Ryan each have a specialty. The Hello Gorgeous mascot can answer across all of them and point people to the right place (book, call, Fullscript, or a specific topic).

## What she knows (her knowledge stack)

1. **Website**
   - Business name, tagline, description, location, hours, contact (phone, email, address), service areas.
   - Homepage FAQs (e.g. where you’re located, consultations, how to book).

2. **Services**
   - Every service on the site: name, category, short description, and key FAQs (e.g. Botox, fillers, weight loss, hormone therapy, IV therapy, etc.).
   - She can say what you offer and answer common service questions from the site.

3. **Fullscript (supplements)**
   - The same Fullscript collections registry the rest of the app uses (Sleep, Gut Health, Energy, Skin/Hair/Nails, Immunity, Stress/Adaptogens, etc.).
   - She can talk about practitioner-grade supplements, Hello Gorgeous’s dispensary, and direct people to the right collection when it’s about wellness/supplements—no diagnosis, education only.

4. **Business Memory**
   - Whatever you put in **Admin → AI → Business Memory**: FAQs, policies, service details, internal knowledge you want her to use.
   - This is where you teach her things that aren’t on the website or in Fullscript.

5. **Booking and contact**
   - She always knows: book online (link), call, and that you’re in Oswego serving Naperville, Aurora, Plainfield, etc.

## How it works in the app

- **Widget** (`HelloGorgeousAssistant` + `/api/chat/widget`): On the public site, she uses the full knowledge stack above (website, services, Fullscript, Business Memory) to answer questions and offer “Book now” and “Call us.”
- **Other mascots**: Used in the persona chat (e.g. Peppi for supplements, Beau-Tox for injectables). The Hello Gorgeous mascot is the one that can “hold” all of that and still answer broadly; the others stay in their lanes.

## Giving her more power

- **Business Memory**: Add entries in Admin → AI → Business Memory (hours, policies, specials, how you want certain questions answered). She uses these first when they match.
- **Website / services**: Kept in sync with `lib/seo.ts` (SITE, HOME_FAQS, SERVICES). When you update the site, she gets the update.
- **Fullscript**: Kept in sync with `lib/fullscript/collections.ts`. When you add or edit collections, she can recommend them when the topic fits.

She’s designed to be the single place that has the power and knowledge over every mascot, Fullscript, the website, and services—your mini version for the site.
