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

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
