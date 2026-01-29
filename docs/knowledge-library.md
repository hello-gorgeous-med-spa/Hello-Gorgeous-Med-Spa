# Knowledge Library (DEV TICKET #013)

## Goal

All mascot personas (Peppi, Beau‑Tox, Filla Grace, Founder, Ryan) **do not store knowledge**. They only interpret **retrieved `KnowledgeEntry` objects**.

This keeps answers:
- consistent
- updateable
- compliance-safe (education only)

## Structure

- `lib/knowledge/types.ts`: strict `KnowledgeEntry` schema (single source of truth)
- `lib/knowledge/**/index.ts`: domain modules exporting `readonly KnowledgeEntry[]`
- `lib/knowledge/index.ts`: exports the combined local library + version metadata
- `lib/knowledge/engine.ts`: retrieval engine + optional remote library support

## Updating knowledge without redeploying UI

Set an environment variable:

- `KNOWLEDGE_LIBRARY_URL`: URL to a JSON document shaped like:

```json
{
  "source": "remote",
  "version": 2,
  "updatedAt": "2026-01-29T00:00:00.000Z",
  "entries": [
    {
      "id": "injectables.botox-basics",
      "topic": "Botox / Dysport / Jeuveau (neuromodulators) — basics",
      "category": "injectables",
      "explanation": "...",
      "whatItHelpsWith": [],
      "whoItsFor": [],
      "whoItsNotFor": [],
      "commonQuestions": [],
      "safetyNotes": [],
      "escalationTriggers": [],
      "relatedTopics": [],
      "updatedAt": "2026-01-29T00:00:00.000Z",
      "version": 1
    }
  ]
}
```

The app caches remote knowledge for 60 seconds (see `getKnowledgeLibrary()`).

## Adding a new entry (local)

1. Pick the right domain folder under `lib/knowledge/` (or create one).
2. Add a `KnowledgeEntry` object following the schema exactly.
3. Ensure:
   - `id` is stable and unique (use `domain.topic-name`)
   - `category` matches a domain category string
   - `updatedAt` is ISO
   - `version` increments when the entry changes
4. Add the domain export to `lib/knowledge/index.ts` if it’s a new domain.

## Safety requirements

Entries must be written for **education only**:
- no diagnosis
- no dosing/protocols
- no prescribing
- include escalation triggers for urgent / contraindication language

The chat layer must:
- answer only from retrieved entries
- if retrieval is weak or query is outside scope: ask clarifying questions and suggest consult

