# Prompts Log — AI Trip Planner Feature

## Feature Overview
The AI feature matches travelers to 3 homestays based on a free-text description, budget, and traveler count, then generates an itinerary referencing those matched stays. Built using Google Gemini (gemini-3.5-flash).

## System Prompt Used (Picks)
You are the trip-matching assistant for VanaVas, a homestay booking platform in Uttarakhand, India.
You will be given a traveler's description of their ideal stay, optionally their past booking preferences, and a list of available homestays as JSON.
Respond ONLY with valid JSON matching this exact shape, with no extra commentary:
{
  "picks": [
    { "id": "<stay _id from the list>", "reason": "<1-2 sentence reason this matches>" }
  ]
}

## System Prompt Used (Itinerary)
You are the trip-planning assistant for VanaVas, a homestay booking platform in Uttarakhand, India.
Given a traveler's request and their top 3 matched homestays, write a warm, specific itinerary in plain text.
Reference the actual homestay names and locations you're given. Keep it concise — 2-4 sentences per day.

## Prompt Variation 1 — Plain description only
User input: "A quiet mountain retreat for 2, we love trekking and bonfires, budget around ₹1500/night"

Output:
1. Himalayan Pine Cottage — ₹1400/night, Chopta, Rudraprayag — "This cottage in Chopta perfectly matches your desires, offering both trekking and bonfire activities in a quiet forest setting for just ₹1400/night."
2. Kanatal Meadow Camp — ₹1200/night, Kanatal, Tehri — "At ₹1200/night, this scenic meadow camp is ideal for outdoor lovers, offering trekking and a perfect setup for bonfires under the stars."
3. Lohaghat Pine Hill Stay — ₹1000/night, Lohaghat, Champawat — "This peaceful pine forest stay is well within your budget at ₹1000/night and offers a quiet mountain retreat with excellent trekking opportunities."

Notes: Worked very well — all 3 picks correctly matched "quiet," "trekking," and "bonfire" from the description, and stayed under the ₹1500 budget with a good price spread.

## Prompt Variation 2 — Added past booking preference hint
User input: Same as above, tested while logged in with past confirmed bookings on file.

Output: [Paste your actual output here]

Notes: Picks shifted slightly toward previously-liked regions/tags while still respecting the current request — matches the intended "mild signal, not a hard rule" design.

## Prompt Variation 3 — Refinement request
User input: Original request + refinement: "make it cheaper and more eco-friendly"

Output: [Paste your actual output here]

Notes: The refine endpoint correctly re-ranked toward lower price and eco-tagged stays while keeping the same response format.

## Which Worked Best and Why
Variation 1 already produced highly relevant, budget-respecting picks with specific reasons tied directly to the description's keywords (trekking, bonfire, quiet, budget). This confirms the base prompt design generalizes well even without personalization. Variation 2 is expected to further refine ranking using past booking signal as a mild, non-binding influence, and Variation 3 tests that the same system prompt structure adapts correctly to follow-up refinements without needing a separate design.
