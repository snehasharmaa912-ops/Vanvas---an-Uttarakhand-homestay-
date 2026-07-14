# AI Feature: Trip Planner — Prompt Log

## System prompt (used in all 3 variations)
Instructs Gemini to act as VanaVas's trip-planning assistant, return strict
JSON (`picks` + `itinerary`), pick exactly 3 stays by `_id` from a provided
candidate list, and produce a 3-day itinerary. Full text in `backend/routes/ai.js`.

## Variation 1 — Free-text only, no output schema
**Prompt:** "Given this list of homestays: [...], recommend the best ones for: 'a quiet mountain retreat for 2, we love trekking and bonfires, budget ₹1500/night' and suggest a 3-day plan."
**Output:** Prose paragraph recommending stays by name (not id), itinerary as unstructured text.
**Problem:** No stable way to map the model's picks back to real database records — it occasionally renamed or paraphrased homestay titles, which broke the frontend.

## Variation 2 — Structured JSON, no explicit id instruction
**Prompt:** Same as above, plus "respond in JSON with picks and itinerary."
**Output:** JSON, but the model sometimes returned made-up ids or omitted the id field entirely (~1 in 5 runs).
**Problem:** Still not reliable enough to trust without a fallback — an invented id can't be matched to a real stay.

## Variation 3 — Structured JSON + explicit id contract + responseMimeType (final)
**Prompt:** Explicit system instruction requiring `"id"` to be copied exactly from the supplied list, `generationConfig.responseMimeType: "application/json"` set on the API call, and a fixed shape (`picks` with reasons, `itinerary` with exactly 3 days).
**Example input:** "A quiet mountain retreat for 2, we love trekking and bonfires, budget ₹1500/night"
**Example output:**
```json
{
  "picks": [
    { "id": "665f1a...", "reason": "Forest-view cottage with a bonfire feature, well under budget." }
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival & Settling In", "plan": "Arrive, check in, evening bonfire with the host." }
  ]
}
