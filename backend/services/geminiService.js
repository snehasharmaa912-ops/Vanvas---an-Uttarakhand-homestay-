const GEMINI_MODEL = 'gemini-3.5-flash'
const GEMINI_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`
const TIMEOUT_MS = 15000
const MAX_RETRIES = 2

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
]

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
    safetySettings: SAFETY_SETTINGS,
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
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Gemini blocked the prompt: ${data.promptFeedback.blockReason}`)
      }
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
    safetySettings: SAFETY_SETTINGS,
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
    buffer = frames.pop()

    for (const frame of frames) {
      const line = frame.trim()
      if (!line.startsWith('data:')) continue
      const jsonStr = line.slice(5).trim()
      if (!jsonStr) continue
      try {
        const parsed = JSON.parse(jsonStr)
        if (parsed.error) {
          throw new Error(parsed.error.message || 'Gemini stream returned an error')
        }
        if (parsed.promptFeedback?.blockReason) {
          throw new Error(`Gemini blocked the prompt: ${parsed.promptFeedback.blockReason}`)
        }
        const candidate = parsed?.candidates?.[0]
        if (!candidate) {
          console.error('Gemini stream: unexpected payload shape:', JSON.stringify(parsed))
          continue
        }
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Gemini blocked the response for safety reasons')
        }
        const text = candidate?.content?.parts?.[0]?.text
        if (text) {
          yield text
        } else if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
          throw new Error(`Gemini stopped generating: ${candidate.finishReason}`)
        }
      } catch (parseErr) {
        if (parseErr.message?.startsWith('Gemini')) throw parseErr
      }
    }
  }
}
