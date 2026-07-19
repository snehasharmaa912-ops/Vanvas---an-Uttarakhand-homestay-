const GEMINI_MODEL = 'gemini-3.5-flash'
const GEMINI_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`
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
        `${GEMINI_BASE}:generateContent?key=${apiKey}`,
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

export async function* generateStream({ systemPrompt, userPrompt, temperature = 0.8 }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server')

  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature },
  }

  const res = await fetch(`${GEMINI_BASE}:streamGenerateContent?alt=sse&key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok || !res.body) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody?.error?.message || `Gemini streaming error (${res.status})`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const frames = buffer.split('\n\n')
    buffer = frames.pop() // keep the last (possibly incomplete) frame for next read

    for (const frame of frames) {
      const line = frame.trim()
      if (!line.startsWith('data:')) continue
      const jsonStr = line.slice(5).trim()
      if (!jsonStr) continue
      try {
        const parsed = JSON.parse(jsonStr)
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) yield text
      } catch {
        // partial frame split across chunks — safe to skip, next read completes it
      }
    }
  }
}
