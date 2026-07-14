import { Router } from 'express'
import Stay from '../models/Stay.js'
import { validate, tripPlannerSchema } from '../middleware/validate.js'
import { aiLimiter } from '../middleware/rateLimiter.js'
import { generateJSON } from '../services/geminiService.js'

const router = Router()

const SYSTEM_PROMPT = `You are the trip-planning assistant for VanaVas, a homestay booking platform in Uttarakhand, India.
You will be given a traveler's description of their ideal stay and a list of available homestays as JSON.
Respond ONLY with valid JSON matching this exact shape, with no extra commentary:
{
  "picks": [
    { "id": "<stay _id from the list>", "reason": "<1-2 sentence reason this matches, referencing what the traveler asked for>" }
  ],
  "itinerary": [
    { "day": 1, "title": "<short title>", "plan": "<2-3 sentence plan for the day>" }
  ]
}
Rules:
- "picks" must contain exactly 3 stays, chosen only from the provided list, ranked best match first.
- Use the stay's exact "_id" string from the list — never invent an id.
- "itinerary" must contain exactly 3 days, tailored to the traveler's description and the region of the top pick.
- Do not wrap the JSON in markdown code fences.`

router.post('/trip-planner', aiLimiter, validate(tripPlannerSchema), async (req, res) => {
  try {
    const { description, budget, travelers } = req.body

    // Keep the candidate list lean — sending every field for every stay
    // would bloat the prompt and the token bill for no real benefit.
    const stays = await Stay.find(budget ? { price: { $lte: budget } } : {})
      .select('title location price rating tags eco')
      .limit(40)
      .lean()

    if (stays.length === 0) {
      return res.status(404).json({ error: 'No stays are available to recommend right now' })
    }

    const candidateList = stays.map(s => ({
      id: s._id.toString(),
      title: s.title,
      location: s.location,
      price: s.price,
      rating: s.rating,
      tags: s.tags,
      eco: s.eco,
    }))

    const userPrompt = `Traveler's request: "${description}"
${budget ? `Budget per night: up to ₹${budget}` : ''}
${travelers ? `Number of travelers: ${travelers}` : ''}

Available homestays (JSON array):
${JSON.stringify(candidateList)}`

    const result = await generateJSON({ systemPrompt: SYSTEM_PROMPT, userPrompt })

    if (!Array.isArray(result.picks) || !Array.isArray(result.itinerary)) {
      return res.status(502).json({ error: 'AI response was not in the expected format. Please try again.' })
    }

    // Re-attach full stay data server-side — never trust the model to echo
    // back prices/images, only ids and its reasoning.
    const stayMap = new Map(stays.map(s => [s._id.toString(), s]))
    const picks = result.picks
      .map(p => {
        const stay = stayMap.get(p.id)
        return stay ? { ...stay, reason: p.reason } : null
      })
      .filter(Boolean)

    if (picks.length === 0) {
      return res.status(502).json({ error: 'AI could not match any real stays. Please try again.' })
    }

    res.status(200).json({ picks, itinerary: result.itinerary })
  } catch (err) {
    console.error('AI trip planner error:', err.message)
    if (err.message.includes('timed out')) {
      return res.status(504).json({ error: 'The AI is taking too long to respond. Please try again.' })
    }
    res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again shortly.' })
  }
})

export default router
