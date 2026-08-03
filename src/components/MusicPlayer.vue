<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ExternalLink, RefreshCw } from '@lucide/vue'

type SpotifyArtist = {
  name: string
}

type SpotifyImage = {
  url: string
}

type SpotifyTrack = {
  id: string
  name: string
  duration_ms: number
  external_url: string | null
  artists?: SpotifyArtist[]
  album?: {
    name: string
    images?: SpotifyImage[]
  } | null
}

type PlayerState = 'loading' | 'playing' | 'idle' | 'unavailable'

type SpotifyResponse = {
  available?: boolean
  is_playing?: boolean
  progress_ms?: number
  item?: SpotifyTrack | null
  error?: {
    code?: string
    message?: string
  }
}

const MUSIC_API = '/api/music'
const spotifyPlaying = ref<SpotifyTrack | null>(null)
const playerState = ref<PlayerState>('loading')
const progressMs = ref(0)
const durationMs = ref(0)
const errorCode = ref('')
const errorMessage = ref('')
const isRefreshing = ref(false)

let pollingInterval: ReturnType<typeof setInterval> | null = null
let progressTicker: ReturnType<typeof setInterval> | null = null
let activeRequest: AbortController | null = null

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes + ':' + seconds.toString().padStart(2, '0')
}

const progressPercent = computed(() =>
  durationMs.value > 0
    ? Math.min(100, (progressMs.value / durationMs.value) * 100)
    : 0
)

const coverUrl = computed(() => spotifyPlaying.value?.album?.images?.[0]?.url || '')
const artistNames = computed(() =>
  spotifyPlaying.value?.artists?.map(artist => artist.name).join(', ') || ''
)

const statusTitle = computed(() => {
  if (playerState.value === 'loading') return 'Consultando Spotify…'
  if (playerState.value === 'playing') return spotifyPlaying.value?.name || 'En reproducción'
  if (playerState.value === 'idle') return 'Spotify está en pausa'
  if (errorCode.value === 'spotify_access_restricted') return 'Spotify necesita Premium'
  if (errorCode.value === 'spotify_authorization_expired') return 'Autorización vencida'
  if (errorCode.value === 'spotify_rate_limited') return 'Spotify está tomando un respiro'
  return 'Spotify no está disponible'
})

const statusDetail = computed(() => {
  if (playerState.value === 'playing') return artistNames.value
  if (playerState.value === 'idle') return 'No hay música reproduciéndose ahora.'
  return errorMessage.value || 'No se pudo consultar la actividad en este momento.'
})

const clearProgressTicker = () => {
  if (progressTicker) {
    clearInterval(progressTicker)
    progressTicker = null
  }
}

const startProgressTicker = () => {
  clearProgressTicker()
  progressTicker = setInterval(() => {
    if (playerState.value === 'playing' && progressMs.value < durationMs.value) {
      progressMs.value += 1000
    }
  }, 1000)
}

const pollSpotifyStatus = async () => {
  if (document.hidden || isRefreshing.value) return

  activeRequest?.abort()
  activeRequest = new AbortController()
  const timeout = window.setTimeout(() => activeRequest?.abort(), 8000)
  isRefreshing.value = true

  try {
    const response = await fetch(MUSIC_API, {
      signal: activeRequest.signal,
      headers: { Accept: 'application/json' }
    })
    const data = await response.json().catch(() => ({})) as SpotifyResponse

    if (!response.ok && !data.error) {
      throw new Error('Respuesta inválida')
    }

    if (data.available === false || data.error) {
      playerState.value = 'unavailable'
      spotifyPlaying.value = null
      errorCode.value = data.error?.code || 'spotify_unavailable'
      errorMessage.value = data.error?.message || ''
      clearProgressTicker()
      return
    }

    errorCode.value = ''
    errorMessage.value = ''

    if (data.is_playing && data.item) {
      spotifyPlaying.value = data.item
      playerState.value = 'playing'
      progressMs.value = data.progress_ms || 0
      durationMs.value = data.item.duration_ms || 0
      startProgressTicker()
      return
    }

    spotifyPlaying.value = null
    playerState.value = 'idle'
    progressMs.value = 0
    durationMs.value = 0
    clearProgressTicker()
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      errorMessage.value = 'La consulta tardó demasiado. Intenta nuevamente.'
    } else {
      errorMessage.value = 'No se pudo conectar con Spotify.'
    }

    playerState.value = 'unavailable'
    spotifyPlaying.value = null
    errorCode.value = 'spotify_network_error'
    clearProgressTicker()
  } finally {
    window.clearTimeout(timeout)
    isRefreshing.value = false
  }
}

const handleVisibilityChange = () => {
  if (!document.hidden) pollSpotifyStatus()
}

onMounted(() => {
  pollSpotifyStatus()
  pollingInterval = setInterval(pollSpotifyStatus, 30000)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
  clearProgressTicker()
  activeRequest?.abort()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section class="mp-panel" aria-label="Actividad de Spotify">
    <div class="mp-status-line">
      <span
        class="mp-status-dot"
        :class="{ active: playerState === 'playing', warning: playerState === 'unavailable' }"
        aria-hidden="true"
      ></span>
      <span>{{ playerState === 'playing' ? 'Escuchando ahora' : 'Actividad de Spotify' }}</span>
    </div>

    <div class="mp-hero" aria-live="polite">
      <div v-if="coverUrl" class="mp-hero-bg" aria-hidden="true">
        <img :src="coverUrl" alt="" />
      </div>
      <div class="mp-hero-shade" aria-hidden="true"></div>

      <div class="mp-hero-content">
        <div class="mp-cover">
          <img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="'Portada de ' + (spotifyPlaying?.name || 'la canción')"
          />
          <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.68.48-1.04.26-2.9-1.77-6.55-2.17-10.85-1.19-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.7-1.07 8.73-.62 12 1.38.36.22.48.68.26 1.02zm1.46-3.26c-.28.45-.87.6-1.32.32-3.32-2.04-8.38-2.63-12.3-1.44-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18-.15-.5.13-1.03.63-1.18 4.47-1.36 10.05-.7 13.85 1.63.45.28.6.87.32 1.32z"/>
          </svg>

          <div v-if="playerState === 'playing'" class="mp-bars" aria-hidden="true">
            <span v-for="bar in 4" :key="bar"></span>
          </div>
        </div>

        <div class="mp-copy">
          <h3>{{ statusTitle }}</h3>
          <p>{{ statusDetail }}</p>
          <span v-if="spotifyPlaying?.album?.name">{{ spotifyPlaying.album.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="playerState === 'playing'" class="mp-progress">
      <div class="mp-progress-track" aria-hidden="true">
        <div :style="{ transform: 'scaleX(' + progressPercent / 100 + ')' }"></div>
      </div>
      <div class="mp-times">
        <span>{{ formatTime(progressMs) }}</span>
        <span>{{ formatTime(durationMs) }}</span>
      </div>
    </div>

    <div class="mp-actions">
      <a
        v-if="spotifyPlaying?.external_url"
        :href="spotifyPlaying.external_url"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir en Spotify
        <ExternalLink aria-hidden="true" />
      </a>

      <button
        v-else
        type="button"
        :disabled="isRefreshing"
        @click="pollSpotifyStatus"
      >
        <RefreshCw :class="{ spinning: isRefreshing }" aria-hidden="true" />
        {{ isRefreshing ? 'Consultando…' : 'Reintentar' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.mp-panel {
  width: 100%;
  margin-top: 1rem;
  overflow: hidden;
  border: 1px solid #232329;
  border-radius: 14px;
  background: #09090c;
  font-family: 'Inter', sans-serif;
}

.mp-status-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 0…3197 tokens truncated…s universitarios y constancias de participación.'
        }
      }
    },
    contact: {
      label: "05. Hablemos",
      title1: "Ponte en",
      title2: "Contacto",
      subtitle: "Conversemos sobre tu próximo proyecto o colaboración.",
      nameLabel: "Nombre",
      namePh: "Tu nombre completo",
      emailLabel: "Email",
      emailPh: "tu@email.com",
      msgLabel: "Mensaje",
      msgPh: "¿En qué te puedo ayudar?",
      send: "Enviar Mensaje",
      sending: "Enviando...",
      success: "¡Mensaje enviado! Te responderé lo antes posible.",
      errorDef: "Error inesperado. Inténtalo de nuevo.",
      errorConn: "No se pudo conectar con el servidor.",
      errorSend: "Error al enviar.",
      directStart: "¿Prefieres escribirme directo?",
      directMid: "Escríbeme directo a"
    },
    stats: {
      title: "Estadísticas de Laboratorios",
      pwned: "Sistemas Pwned",
      flags: "Banderas (Flags)",
      vulns: "Vulnerabilidades",
      audits: "Auditorías Limpias"
    },
    services: {
      label: "Lo que hago",
      title1: "Áreas de",
      title2: "Especialización",
      subtitle: "Combino la mentalidad ofensiva de un hacker con la capacidad constructiva de un desarrollador para crear soluciones inquebrantables.",
      list: [
        {
          title: 'Auditoría Web & Pentesting',
          desc: 'Análisis de vulnerabilidades, pruebas de penetración y reporte de fallos de seguridad en aplicaciones web utilizando OWASP Top 10 y herramientas especializadas.'
        },
        {
          title: 'Desarrollo SecDevOps',
          desc: 'Construcción de aplicaciones full-stack robustas integrando prácticas de seguridad desde el código fuente, previniendo inyecciones SQL, XSS y CSRF por defecto.'
        },
        {
          title: 'Arquitectura Segura',
          desc: 'Diseño e implementación de infraestructuras en la nube (AWS) y redes locales con configuraciones de firewalls, segmentación y control de accesos estrictos.'
        }
      ]
    },
    nav: {
      home: "Inicio",
      profile: "Perfil",
      skills: "Habilidades",
      certs: "Certificaciones",
      projects: "Proyectos",
      notes: "Apuntes",
      terminal: "Terminal",
      contact: "Contacto"
    },
    header: {
      online: "En línea",
      idle: "Ausente",
      dnd: "No molestar",
      offline: "Desconectado"
    },
    footer: {
      bio: "Security Engineer & Full Stack Developer apasionado por la ciberseguridad, el desarrollo web y el aprendizaje continuo.",
      navigation: "Navegación",
      contact: "Contacto",
      downloadCv: "Descargar CV",
      socials: "Redes",
      rights: "Todos los derechos reservados.",
      backToTop: "Volver arriba"
    }
  },
  en: {
    sidePanel: {
      title: "Command Center",
      language: "Language",
      findMe: "External Networks",
      quote: `"He who stops learning ceases to be dangerous."`,
      quoteAuthor: "— Jean Piero",
      downloadCv: "Extract Resume",
      copyEmail: "Copy Email",
      emailCopied: "Copied!",
      performanceMode: "Performance Mode",
      performanceOn: "Reduced Graphics",
      performanceOff: "Max Graphics",
      sysStatus: "System Status",
      statusSecure: "Secure Connection",
      statusOnline: "Server Online",
      quickAccess: "Quick Access",
      openTerminal: "Init Terminal"
    },
    hero: {
      hi: "Hi, I'm",
      phrases: [
        'I connect security, networks, and development.',
        'I learn by building and documenting.',
        'I break systems safely to understand them.',
        'I turn technical curiosity into real projects.',
      ],
      aboutLabel: "about me",
      aboutText1: "I like following a question all the way through: reading, testing, getting things wrong, and documenting what I learned.",
      aboutText2: "Curiosity becomes useful when it ends in something that works",
      rasgos: [
        { label: 'Investigate', desc: "It's not enough for something to work. I need to know why it works, and what happens if I break it." },
        { label: 'Night Owl', desc: 'I function better at night. Silence helps me think without interruptions.' },
        { label: 'Break to Understand', desc: 'The best way to learn something is to take it completely apart. That way I understand it from the inside out.' },
        { label: 'Rabbit holes', desc: 'I start looking for one thing and end up three hours later understanding something completely different. And that is fine.' },
        { label: 'Introvert', desc: "I'm quiet until I find the right topic. Then I don't stop." },
        { label: 'Always Learning', desc: "He who stops learning ceases to be relevant. I don't allow myself to stagnate." }
      ],
      mindsetLabel: "mindset",
      mindsetQuote1: "I do not design for the perfect scenario,",
      mindsetQuote2: "I forge for adversity.",
      mindsetSub: "Anticipating failure is not pessimism, it is preparation. Understanding how systems break has taught me that true strength comes from recognizing our own vulnerabilities.",
      notesLabel: "notes",
      viewAllNotes: "View all notes"
    },
    about: {
      profile: "01 — Profile",
      studentOf: "Student of",
      cyber: "Cybersecurity",
      andDev: "and development.",
      roleCyber: "Cybersecurity",
      roleDev: "Web Development",
      bio1: "Cybersecurity Student. I am passionate about understanding systems and how they work — from their architecture to their limits. I work with the conviction that whoever understands the system, masters it.",
      bio2: "If something catches my attention at 2am, I won't let it go until I completely understand it.",
      yearsLabel: "Years",
      certsLabel: "Certs",
      curiosityLabel: "Curiosity",
      interests: "Interests",
      education: "Education",
      inProgress: "In progress",
      completed: "Completed",
      intList: ['Cybersecurity', 'Web Dev', 'Networking', 'CTF', 'Open Source', 'Linux']
    },
    projects: {
      label: "03. Portfolio",
      title1: "Featured",
      title2: "Works",
      subtitle: "Built projects and documented labs that show how I think, implement, and verify security and development solutions.",
      list: [
        {
          title: 'File Integrity Monitor (FIM)',
          focus: 'Defensive security',
          desc: 'I built a monitor that detects unauthorized changes and presents them in a web dashboard so events can be reviewed without losing context.',
          proof: 'Change detection and real-time visualization'
        },
        {
          title: 'Task Manager',
          focus: 'Full-stack application',
          desc: 'I developed an application to create, organize, and track tasks while caring for both the user flow and the technical structure.',
          proof: 'Complete CRUD flow with a responsive interface'
        },
        {
          title: 'Web-Vul',
          focus: 'Web security',
          desc: 'A web lab created to practice vulnerability analysis, understand impact, and strengthen secure development habits.',
          proof: 'Controlled analysis and mitigation scenarios'
        },
        {
          title: 'Wazuh SIEM/XDR',
          focus: 'SOC laboratory',
          desc: 'A defensive Wazuh lab running in Docker on Arch Linux to centralize events and practice integrity monitoring and configuration auditing.',
          proof: 'FIM, active inventory, and SCA auditing'
        }
      ],
      lab: "Laboratory",
      repository: "View repository",
      reference: "View technical base",
      stackLabel: "Technologies used",
      liveDemo: "Live Demo",
      code: "Code"
    },
    skills: {
      label: "02. Tech Stack",
      title1: "Technical",
      title2: "Skills",
      security: "Cybersecurity",
      networking: "Networking & Infra",
      development: "Development",
      cloud: "Cloud & Unix"
    },
    certs: {
      label: "04. Education",
      title1: "Collection of",
      title2: "Certifications",
      subtitle: "Official accreditations organized by issuing platform.",
      documents: "Documents",
      explore: "Explore Certificates",
      items: {
        coursera: {
          name: 'Coursera',
          desc: 'Technical cybersecurity and engineering certifications backed by Microsoft, Google, and universities.'
        },
        fortinet: {
          name: 'Fortinet',
          desc: 'Official accreditations in fundamentals and associate level of cybersecurity and networking.'
        },
        aws: {
          name: 'AWS',
          desc: 'Cloud architecture and operations certifications from Amazon Web Services.'
        },
        hackthebox: {
          name: 'Hack The Box',
          desc: 'Advanced certifications in pentesting, forensics, and red teaming operations.'
        },
        cwl: {
          name: 'CWL',
          desc: 'Specialized and technical CWL certifications.'
        },
        cisco: {
          name: 'Cisco',
          desc: 'Networking and cybersecurity certifications backed by Cisco Networking Academy.'
        },
        otros: {
          name: 'Other Certificates',
          desc: 'Miscellaneous accreditations, university diplomas, and certificates of participation.'
        }
      }
    },
    contact: {
      label: "05. Let's Talk",
      title1: "Get in",
      title2: "Touch",
      subtitle: "Let's discuss your next project or collaboration.",
      nameLabel: "Name",
      namePh: "Your full name",
      emailLabel: "Email",
      emailPh: "you@email.com",
      msgLabel: "Message",
      msgPh: "How can I help you?",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! I'll get back to you as soon as possible.",
      errorDef: "Unexpected error. Please try again.",
      errorConn: "Could not connect to the server.",
      errorSend: "Error sending.",
      directStart: "Prefer to email me directly?",
      directMid: "Email me directly at"
    },
    stats: {
      title: "Laboratory Statistics",
      pwned: "Pwned Systems",
      flags: "Flags Captured",
      vulns: "Vulnerabilities",
      audits: "Clean Audits"
    },
    services: {
      label: "What I do",
      title1: "Areas of",
      title2: "Specialization",
      subtitle: "I combine the offensive mindset of a hacker with the constructive capability of a developer to build unbreakable solutions.",
      list: [
        {
          title: 'Web Auditing & Pentesting',
          desc: 'Vulnerability analysis, penetration testing, and security flaw reporting in web applications using OWASP Top 10 and specialized tools.'
        },
        {
          title: 'SecDevOps Development',
          desc: 'Building robust full-stack applications integrating security practices from the source code, preventing SQL injections, XSS, and CSRF by default.'
        },
        {
          title: 'Secure Architecture',
          desc: 'Design and implementation of cloud infrastructures (AWS) and local networks with firewall configurations, segmentation, and strict access control.'
        }
      ]
    },
    nav: {
      home: "Home",
      profile: "Profile",
      skills: "Skills",
      certs: "Certifications",
      projects: "Projects",
      notes: "Notes",
      terminal: "Terminal",
      contact: "Contact"
    },
    header: {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline"
    },
    footer: {
      bio: "Security Engineer & Full Stack Developer passionate about cybersecurity, web development, and continuous learning.",
      navigation: "Navigation",
      contact: "Contact",
      downloadCv: "Download CV",
      socials: "Socials",
      rights: "All rights reserved.",
      backToTop: "Back to top"
    }
  }
}

export function t(path: string): any {
  const keys = path.split('.')
  let current = dict[i18nState.lang]
  for (const k of keys) {
    if (current[k] === undefined) return path
    current = current[k]
  }
  return current
}
