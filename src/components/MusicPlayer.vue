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
  padding: 0.72rem 0.9rem;
  border-bottom: 1px solid #1d1d22;
  color: #73737c;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mp-status-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #5d5d66;
}

.mp-status-dot.active {
  background: #1ed760;
  box-shadow: 0 0 0 4px rgba(30, 215, 96, 0.1);
}

.mp-status-dot.warning {
  background: #ff3b3b;
  box-shadow: 0 0 0 4px rgba(255, 59, 59, 0.1);
}

.mp-hero {
  position: relative;
  min-height: 7.4rem;
  overflow: hidden;
}

.mp-hero-bg {
  position: absolute;
  inset: 0;
}

.mp-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(24px) saturate(0.9) brightness(0.28);
  transform: scale(1.2);
}

.mp-hero-shade {
  position: absolute;
  inset: 0;
  background: rgba(9, 9, 12, 0.72);
}

.mp-hero-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem;
}

.mp-cover {
  position: relative;
  display: grid;
  width: 4.4rem;
  height: 4.4rem;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 1px solid #24242b;
  border-radius: 11px;
  background: #111116;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.mp-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mp-cover > svg {
  width: 1.75rem;
  height: 1.75rem;
  color: #1ed760;
  opacity: 0.45;
}

.mp-bars {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.48);
}

.mp-bars span {
  width: 3px;
  height: 1.1rem;
  border-radius: 2px;
  background: #fff;
  animation: mp-bar 900ms ease-in-out infinite;
}

.mp-bars span:nth-child(2) { animation-delay: 120ms; }
.mp-bars span:nth-child(3) { animation-delay: 240ms; }
.mp-bars span:nth-child(4) { animation-delay: 360ms; }

.mp-copy {
  min-width: 0;
}

.mp-copy h3,
.mp-copy p,
.mp-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mp-copy h3 {
  margin: 0;
  color: #f4f4f5;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.35;
}

.mp-copy p {
  margin: 0.28rem 0 0;
  color: #9a9aa3;
  font-size: 0.72rem;
  line-height: 1.4;
}

.mp-copy span {
  display: block;
  margin-top: 0.28rem;
  color: #1db954;
  font-size: 0.65rem;
}

.mp-progress {
  padding: 0 1rem 0.85rem;
}

.mp-progress-track {
  height: 3px;
  overflow: hidden;
  border-radius: 999px;
  background: #232329;
}

.mp-progress-track div {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #1ed760;
  transform-origin: left center;
  transition: transform 900ms linear;
}

.mp-times {
  display: flex;
  justify-content: space-between;
  margin-top: 0.35rem;
  color: #55555f;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
}

.mp-actions {
  display: flex;
  padding: 0.75rem 0.9rem 0.9rem;
  border-top: 1px solid #1d1d22;
}

.mp-actions a,
.mp-actions button {
  display: inline-flex;
  min-height: 2.4rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #2a2a31;
  border-radius: 9px;
  background: #111116;
  color: #cfcfd5;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    background 180ms ease;
}

.mp-actions a:hover,
.mp-actions button:hover:not(:disabled) {
  border-color: rgba(255, 59, 59, 0.55);
  background: #151519;
  color: #fff;
}

.mp-actions a:focus-visible,
.mp-actions button:focus-visible {
  outline: 2px solid #ff3b3b;
  outline-offset: 3px;
}

.mp-actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.mp-actions svg {
  width: 0.9rem;
  height: 0.9rem;
}

.spinning {
  animation: mp-spin 800ms linear infinite;
}

@keyframes mp-bar {
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
}

@keyframes mp-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .mp-bars span,
  .spinning {
    animation: none;
  }

  .mp-progress-track div {
    transition: none;
  }
}
</style>
