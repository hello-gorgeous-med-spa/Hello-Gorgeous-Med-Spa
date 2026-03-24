# Blog SEO Guidelines — Hello Gorgeous

**Use this checklist when creating or publishing any new blog content.**

> **LOCAL SEO IS CRITICAL:** We are **Oswego, IL** and **surrounding areas only** (Naperville, Aurora, Plainfield, Fox Valley). Never use Phoenix or other non-local cities. See [`docs/LOCAL-SEO-OSWEGO.md`](LOCAL-SEO-OSWEGO.md).

---

## ✅ Mandatory: Before Publishing Any New Blog Post

### 1. Include City/Neighborhood in Title and First 100 Words

- **Title:** Add "Oswego, IL" or "in Oswego" (e.g., "Morpheus8 in Oswego, IL" or "VIP Model Program at Hello Gorgeous — Oswego, IL")
- **First 100 words:** Mention Oswego, Naperville, Aurora, Plainfield, or Fox Valley in the opening paragraphs
- **Why:** Local SEO. Search engines and users need to see the location immediately. **This is huge for us to rank and be recognized.**

### 2. Add an FAQ Section at the Bottom

- Use **exact questions people ask** ("Does it hurt?", "How long is recovery?", "How much does it cost?")
- Format as `## Frequently Asked Questions` with `### Q: [question]` and `A:` or bullet answers
- **Why:** FAQ schema can trigger rich results in Google. Questions match search intent.

### 3. Link to the Related Service Page

- Add at least one internal link to the relevant service: `/services/morpheus8`, `/services/weight-loss-therapy`, `/vip-model`, `/services/solaria-co2`, etc.
- Use descriptive anchor text: "Learn more about Morpheus8 Burst" not "click here"
- **Why:** Internal linking passes authority and helps users find the booking page.

### 4. Use Client Reviews as Quotes

- Add 1–2 blockquotes with **keyword-rich testimonials** (e.g., "My skin tightened after Morpheus8" or "Weight loss at Hello Gorgeous was life-changing")
- Include location or service in the quote when natural
- **Why:** User-generated content signals quality. Keywords in quotes help SEO.

---

## Quick Checklist

| Item | Done |
|------|------|
| City in title | ☐ |
| City in first 100 words | ☐ |
| FAQ section at bottom | ☐ |
| Link to related service page | ☐ |
| Client review quote(s) | ☐ |

---

## Where to Add New Blog Posts

- **File:** `data/blog-posts.ts`
- **Format:** Follow existing `BlogPost` interface (slug, title, metaTitle, metaDescription, excerpt, category, date, readTime, keywords, content)
- **Content:** Use Markdown (`#`, `##`, `###`, `-`, `**bold**`, `[links](url)`)

---

## Related Docs

- [Content Guidelines](../README.md#-content-guidelines-blog--marketing) — Never disparage competitors
- [Google Post Campaigns](./GOOGLE_POST_CAMPAIGNS.md) — Promote new posts on GBP
