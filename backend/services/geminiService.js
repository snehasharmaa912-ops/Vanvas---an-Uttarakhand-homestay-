const GEMINI_MODEL = 'gemini-1.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const TIMEOUT_MS = 15000
const MAX_RETRIES = 2

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function callWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Calls Gemini and returns parsed JSON.
 * Retries with exponential backoff on 429 / 5xx / network errors — NOT on
 * other 4xx, since those are request problems that won't fix themselves.
 */
export async function generateJSON({ systemPrompt, userPrompt, temperature = 0.7 }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server')

  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature, responseMimeType: 'application/json' },
  }

  let lastError
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await callWithTimeout(
        `${GEMINI_URL}?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        TIMEOUT_MS
      )

      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Gemini API returned ${res.status}`)
        await sleep(500 * Math.pow(2, attempt))
        continue
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody?.error?.message || `Gemini API error (${res.status})`)
      }

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Gemini returned an empty response')

      try {
        return JSON.parse(text)
      } catch {
        throw new Error('Gemini returned malformed JSON')
      }
    } catch (err) {
      lastError = err.name === 'AbortError' ? new Error('Gemini API request timed out') : err
      if (attempt === MAX_RETRIES) break
    }
  }
  throw lastError
}
