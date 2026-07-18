import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Ruta absoluta al .env (siempre en la carpeta raíz del proyecto)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.SERVER_PORT || 3001

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['POST', 'GET'],
}))

// ── Rate limiter simple (en memoria) ──────────────────────
const rateLimitMap = new Map()
const RATE_LIMIT  = 20           // máx solicitudes por ventana
const RATE_WINDOW = 15 * 60 * 1000  // 15 minutos

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip  = req.ip || 'unknown'
  const now = Date.now()
  const rec = rateLimitMap.get(ip)
  if (!rec || now > rec.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return next()
  }
  if (rec.count >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en 15 minutos.' })
  }
  rec.count++
  next()
}

// ── POST /api/contact ─────────────────────────────────────
app.post('/api/contact', rateLimit, async (req, res) => {
  const { name, email, message } = req.body
  console.log('[CONTACT] Datos recibidos:', { name, email, message })

  if (!name?.trim() || !email?.trim() || !message?.trim())
    return res.status(400).json({ error: 'Todos los campos son requeridos.' })

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Email inválido.' })

  if (message.trim().length < 10)
    return res.status(400).json({ error: 'El mensaje es demasiado corto.' })

  if (name.length > 100 || email.length > 200 || message.length > 2000)
    return res.status(400).json({ error: 'Los campos exceden el límite permitido.' })

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL
  if (!scriptUrl) {
    console.error('[CONFIG ERROR] GOOGLE_SCRIPT_URL no está configurado en el archivo .env')
    return res.status(500).json({ error: 'El servidor no está configurado para procesar esta solicitud.' })
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    })

    if (!response.ok) {
      throw new Error(`Google Script retornó status ${response.status}`)
    }

    const data = await response.json()
    console.log('[SHEET RESPONSE]', data)

    res.json({ success: true })
  } catch (err: any) {
    console.error('[SHEETS ERROR]', err.message || err)
    res.status(500).json({ error: 'Error al registrar en Google Sheets. Intenta más tarde.' })
  }
})

app.get('/api/spotify', async (req, res) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return res.status(500).json({ error: 'Faltan variables' })

  try {
    const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN })
    })
    if (!tokenResponse.ok) throw new Error('Error token')
    const { access_token } = await tokenResponse.json()

    const playingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${access_token}` },
    })

    if (playingResponse.status === 204 || playingResponse.status === 404) return res.json({ is_playing: false })
    if (!playingResponse.ok) throw new Error('Error obteniendo canción')
    
    const playingData = await playingResponse.json()
    res.json({
      is_playing: playingData.is_playing,
      progress_ms: playingData.progress_ms,
      item: playingData.item ? {
        id: playingData.item.id,
        name: playingData.item.name,
        duration_ms: playingData.item.duration_ms,
        uri: playingData.item.uri,
        artists: playingData.item.artists?.map((a: any) => ({ name: a.name, uri: a.uri })),
        album: playingData.item.album ? { name: playingData.item.album.name, images: playingData.item.album.images } : null,
      } : null,
    })
  } catch (err: any) {
    res.status(500).json({ error: 'Error interno en Spotify local' })
  }
})

app.post('/api/spotify/action', async (req, res) => {
  const { action, uri } = req.body
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return res.status(500).json({ error: 'Faltan variables' })

  try {
    const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN })
    })
    const { access_token } = await tokenResponse.json()

    let url = ''
    let method = 'POST'
    let body: any = null

    if (action === 'play') {
      url = 'https://api.spotify.com/v1/me/player/play'
      method = 'PUT'
      if (uri) body = JSON.stringify({ uris: [uri] })
    } else if (action === 'pause') {
      url = 'https://api.spotify.com/v1/me/player/pause'
      method = 'PUT'
    } else if (action === 'next') {
      url = 'https://api.spotify.com/v1/me/player/next'
    } else if (action === 'previous') {
      url = 'https://api.spotify.com/v1/me/player/previous'
    } else {
      return res.status(400).json({ error: 'Acción no válida' })
    }

    await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body
    })

    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: 'Error en acción Spotify' })
  }
})

app.get('/api/spotify/search', async (req, res) => {
  const query = req.query.q
  if (!query) return res.json({ tracks: { items: [] } })
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

  try {
    const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN })
    })
    const { access_token } = await tokenResponse.json()

    const searchRes = await fetch(`https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(query as string)}`, {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })
    const data = await searchRes.json()
    res.json(data)
  } catch (err: any) {
    res.status(500).json({ error: 'Error en búsqueda Spotify' })
  }
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
