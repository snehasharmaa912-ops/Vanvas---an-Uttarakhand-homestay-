import { Router } from 'express'
import Stay from '../models/Stay.js'
import Booking from '../models/Booking.js'
import { validate, tripPlannerSchema, tripRefineSchema } from '../middleware/validate.js'
import { aiLimiter } from '../middleware/rateLimiter.js'
import { optionalAuth } from '../middleware/auth.js'
import { generateJSON, generateStream } from '../services/geminiService.js'

const router = Router()

const PICKS_SYSTEM_PROMPT = `You are the trip-matching assistant for VanaVas, a homestay booking platform in Uttarakhand, India.
You will be given a traveler's description of their ideal stay, optionally their past booking preferences, and a list of available homestays as JSON.
Respond ONLY with valid JSON matching this exact shape, with no extra commentary:
{
  "picks": [
    { "id": "<stay _id from the list>", "reason": "<1-2 sentence reason this matches, referencing what the traveler asked for>" }
  ]
}
Rules:
- "picks" must contain exactly 3 stays, chosen only from the provided list, ranked best match first.
- Use the stay's exact "_id" string from the list — never invent an id.
- If past booking preferences are given, let them mildly influence the ranking, but the current request always takes priority.
- Do not wrap the JSON in markdown code fences.`

const ITINERARY_SYSTEM_PROMPT = `You are the trip-planning assistant for VanaVas, a homestay booking platform in Uttarakhand, India.
Given a traveler's request and their top 3 matched homestays, write a warm, specific 3-day itinerary in plain text (headers like "Day 1: ..." are fine, but no JSON, no code fences).
Reference the actual homestay names and locations you're given. Keep it concise — 2-4 sentences per day.`

const REFINE_SYSTEM_PROMPT = `You are the trip-planning assistant for VanaVas. A traveler already received trip picks and an itinerary, and is now asking for a refinement (e.g. cheaper, more eco-friendly, different region).
Respond ONLY with valid JSON matching this exact shape, with no extra commentary:
{
  "picks": [ { "id": "<stay _id from the list>", "reason": "<why this fits the refinement>" } ],
  "itineraryText": "<updated 3-day itinerary as plain text, Day 1 / Day 2 / Day 3>"
}
Rules:
- "picks" must contain exactly 3 stays from the provided list, using their exact "_id".
- Apply the traveler's refinement request as the primary change while still respecting their original description.
- Do not wrap the JSON in markdown code fences.`

async function buildCandidateList(budget) {
  return Stay.find(budget ? { price: { $lte: budget } } : {})
    .select('title location price rating tags eco image')
    .limit(40)
    .lean()
}

async function buildPersonalizationHint(userId) {
  if (!userId) return ''
  const bookings = await Booking.find({ guest: userId, status: 'confirmed' })
    .populate('stay', 'location tags price')
    .sort('-createdAt')
    .limit(5)
    .lean()
  if (bookings.length === 0) return ''

  const locations = [...new Set(bookings.map(b => b.stay?.location).filter(Boolean))]
  const tags = [...new Set(bookings.flatMap(b => b.stay?.tags || []))]
  const avgPrice = Math.round(bookings.reduce((sum, b) => sum + (b.stay?.price || 0), 0) / bookings.length)

  return `\nTraveler's past booking preferences (mild signal only, not a hard rule): previously stayed near ${locations.join(', ') || 'various regions'}, liked tags like ${tags.slice(0, 5).join(', ') || 'various'}, average price ₹${avgPrice}/night.`
}

router.post('/trip-planner/picks', optionalAuth, aiLimiter, validate(tripPlannerSchema), async (req, res) => {
  try {
    const { description, budget, travelers } = req.body
    const stays = await buildCandidateList(budget)
    if (stays.length === 0) {
      return res.status(404).json({ error: 'No stays are available to recommend right now' })
    }

    const candidateList = stays.map(s => ({
      id: s._id.toString(), title: s.title, location: s.location, price: s.price,
      rating: s.rating, tags: s.tags, eco: s.eco,
    }))

    const personalizationHint = await buildPersonalizationHint(req.userId)

    const userPrompt = `Traveler's request: "${description}"
${budget ? `Budget per night: up to ₹${budget}` : ''}
${travelers ? `Number of travelers: ${travelers}` : ''}${personalizationHint}

Available homestays (JSON array):
${JSON.stringify(candidateList)}`

    const result = await generateJSON({ systemPrompt: PICKS_SYSTEM_PROMPT, userPrompt })
    if (!Array.isArray(result.picks)) {
      return res.status(502).json({ error: 'AI response was not in the expected format. Please try again.' })
    }

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

    res.status(200).json({ picks })
  } catch (err) {
    console.error('AI picks error:', err.message)
    res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again shortly.', detail: err.message })
  }
})

router.post('/trip-planner/itinerary/stream', optionalAuth, aiLimiter, async (req, res) => {
  const { description, budget, travelers, picks } = req.body
  if (!description || !Array.isArray(picks) || picks.length === 0) {
    return res.status(400).json({ error: 'description and picks are required' })
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Accel-Buffering', 'no') // disable proxy buffering so chunks flush immediately

  const userPrompt = `Traveler's request: "${description}"
${budget ? `Budget per night: up to ₹${budget}` : ''}
${travelers ? `Number of travelers: ${travelers}` : ''}

Top matched homestays:
${picks.map(p => `- ${p.title} (${p.location})`).join('\n')}`

  try {
    for await (const chunk of generateStream({ systemPrompt: ITINERARY_SYSTEM_PROMPT, userPrompt })) {
      res.write(chunk)
    }
    res.end()
  } catch (err) {
    console.error('AI itinerary stream error:', err.message)
    res.write(`\n\n[AI error: ${err.message}]`)
    res.end()
  }
})

router.post('/trip-planner/refine', optionalAuth, aiLimiter, validate(tripRefineSchema), async (req, res) => {
  try {
    const { description, budget, travelers, currentItineraryText, refinementMessage } = req.body
    const stays = await buildCandidateList(budget)
    if (stays.length === 0) {
      return res.status(404).json({ error: 'No stays are available to recommend right now' })
    }

    const candidateList = stays.map(s => ({
      id: s._id.toString(), title: s.title, location: s.location, price: s.price,
      rating: s.rating, tags: s.tags, eco: s.eco,
    }))

    const userPrompt = `Original request: "${description}"
${budget ? `Budget per night: up to ₹${budget}` : ''}
${travelers ? `Number of travelers: ${travelers}` : ''}

Current itinerary:
${currentItineraryText}

Traveler's refinement: "${refinementMessage}"

Available homestays (JSON array):
${JSON.stringify(candidateList)}`

    const result = await generateJSON({ systemPrompt: REFINE_SYSTEM_PROMPT, userPrompt })
    if (!Array.isArray(result.picks) || typeof result.itineraryText !== 'string') {
      return res.status(502).json({ error: 'AI response was not in the expected format. Please try again.' })
    }

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

    res.status(200).json({ picks, itineraryText: result.itineraryText })
  } catch (err) {
    console.error('AI refine error:', err.message)
    res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again shortly.', detail: err.message })
  }
})

export default router
