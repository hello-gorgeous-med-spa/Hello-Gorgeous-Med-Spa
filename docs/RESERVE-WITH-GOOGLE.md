# Reserve with Google — Get a “Book” Button on Search & Maps

**Canonical booking URL (use everywhere, including Google Business Profile):** `https://www.hellogorgeousmedspa.com/book`

**Reserve with Google** lets customers find and book with you through Google Search and Maps. You have two options:

---

## Option 1: Link to Your Booking Page (Recommended — You Keep Full Control)

Your booking lives on **your site** at **https://www.hellogorgeousmedspa.com/book**. Google can show a **“Book”** or **“Reserve”** button that **links to that URL**. No third‑party booking provider required.

### Steps

1. Go to [Google Business Profile](https://business.google.com/) and sign in.
2. Select **Hello Gorgeous Med Spa** (or the correct location).
3. In the menu, open **Bookings** (or **Services** / **Edit profile** depending on your layout).
4. Choose **“Links to your online booking tools”** or **“Add a link”** (not “Set up with a booking partner”).
5. Add this URL as your booking link:  
   **`https://www.hellogorgeousmedspa.com/book`**
6. Save. The button usually appears on Search and Maps within a few hours to a day.

### What You Already Have on the Site

- **Schema:** The site outputs `ReserveAction` JSON-LD pointing to `/book`, which helps Google understand your booking URL.
- **Canonical booking URL:** Use the same URL everywhere (e.g. in GBP, ads, social):  
  **https://www.hellogorgeousmedspa.com/book**

Result: more exposure on Google; when people click “Book,” they go to **your** booking flow (no Fresha or other provider in the middle).

---

## Option 2: Full “Reserve with Google” (Book & Pay on Google)

**Reserve with Google** in the strict sense means customers **book and pay on Google** (e.g. in Search/Maps) without leaving Google. That requires:

- A **supported scheduling provider** (Google’s [Reserve with Google partners](https://www.google.com/maps/reserve/partners)), **or**
- Becoming a scheduling partner (for developers).

So if you want to keep **all** booking on **your** website and only want a “Book” button that **links** to you, use **Option 1**. If you later decide to offer “book on Google” as well, you’d need to integrate with one of Google’s booking partners.

---

## Summary

| Goal | What to do |
|------|------------|
| “Book” button on Google that goes to your site | **Option 1:** In GBP → Bookings → add link **https://www.hellogorgeousmedspa.com/book** |
| Customers book and pay directly on Google | **Option 2:** Use a [Reserve with Google partner](https://www.google.com/maps/reserve/partners) (e.g. a scheduling provider that supports it) |

For **increased exposure and reach** while keeping full control of your booking, use **Option 1** and keep your single booking URL everywhere.
