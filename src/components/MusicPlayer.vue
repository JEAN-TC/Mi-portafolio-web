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
  <section
    class="mp-panel"
    :class="{ 'is-playing': playerState === 'playing', 'is-unavailable': playerState === 'unavailable' }"
    aria-label="Actividad de Spotify"
  >
    <div class="mp-topline">
      <div class="mp-status">
        <span
          class="mp-status-dot"
          :class="{ active: playerState === 'playing', warning: playerState === 'unavailable' }"
          aria-hidden="true"
        ></span>
        <span>{{ playerState === 'playing' ? 'Escuchando ahora' : 'Actividad de Spotify' }}</span>
      </div>
      <span class="mp-brand">Spotify</span>
    </div>

    <div class="mp-stage" aria-live="polite">
      <div class="mp-cover">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          :alt="'Portada de ' + (spotifyPlaying?.name || 'la canción')"
        />
        <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.68.48-1.04.26-2.9-1.77-6.55-2.17-10.85-1.19-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.7-1.07 8.73-.62 12 1.38.36.22.48.68.26 1.02zm1.46-3.26c-.28.45-.87.6-1.32.32-3.32-2.04-8.38-2.63-12.3-1.44-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.47-1.36 10.05-.7 13.85 1.63.45.28.6.87.32 1.32z"/>
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
        class="mp-open-link"
        :href="spotifyPlaying.external_url"
        target="_blank"
        rel="noopener noreferrer"
      >
        Escuchar en Spotify
        <ExternalLink aria-hidden="true" />
      </a>

      <button
        v-else
        type="button"
        :disabled="isRefreshing"
        @click="pollSpotifyStatus"
      >
        <RefreshCw :class="{ spinning: isRefreshing }" aria-hidden="true" />
        {{ isRefreshing ? 'Actualizando…' : 'Actualizar' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.mp-panel {
  --mp-surface: #0c0c10;
  --mp-line: rgba(255, 255, 255, 0.1);
  width: 100%;
  margin-top: 1rem;
  overflow: hidden;
  border: 1px solid var(--mp-line);
  border-radius: 16px;
  background: var(--mp-surface);
  color: #f8f8fa;
  font-family: var(--font-body);
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.mp-panel.is-playing {
  border-color: rgba(30, 215, 96, 0.28);
  box-shadow: 0 18px 36px -30px rgba(30, 215, 96, 0.65);
}

.mp-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.82rem 0.95rem 0.7rem;
  color: #b7b7c1;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mp-status {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.48rem;
}

.mp-status-dot {
  width: 0.45rem;
  height: 0.45rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #696974;
}

.mp-status-dot.active {
  background: #1ed760;
  box-shadow: 0 0 0 4px rgba(30, 215, 96, 0.12);
  animation: mp-pulse 2.4s ease-in-out infinite;
}

.mp-status-dot.warning {
  background: #ff4d4d;
}

.mp-brand {
  color: #7f7f8a;
  font-size: 0.61rem;
  letter-spacing: 0.02em;
  text-transform: none;
}

.mp-stage {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.35rem 0.95rem 0.95rem;
}

.mp-stage::before {
  position: absolute;
  top: -3rem;
  right: -2rem;
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.075);
  content: '';
  filter: blur(20px);
  pointer-events: none;
}

.mp-cover {
  position: relative;
  display: grid;
  width: 4.25rem;
  height: 4.25rem;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
  background: #15151b;
  box-shadow: 0 12px 24px -14px rgba(0, 0, 0, 0.9);
}

.mp-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mp-cover > svg {
  width: 1.65rem;
  height: 1.65rem;
  color: #1ed760;
  opacity: 0.75;
}

.mp-bars {
  position: absolute;
  right: 0.42rem;
  bottom: 0.38rem;
  display: flex;
  align-items: end;
  gap: 2px;
  height: 0.9rem;
}

.mp-bars span {
  width: 2px;
  height: 0.48rem;
  border-radius: 999px;
  background: #fff;
  animation: mp-bar 840ms ease-in-out infinite;
}

.mp-bars span:nth-child(2) { height: 0.9rem; animation-delay: 100ms; }
.mp-bars span:nth-child(3) { height: 0.62rem; animation-delay: 200ms; }
.mp-bars span:nth-child(4) { height: 0.78rem; animation-delay: 300ms; }

.mp-copy {
  position: relative;
  min-width: 0;
  flex: 1;
}

.mp-copy h3 {
  overflow: hidden;
  margin: 0;
  color: #fff;
  font-size: 0.98rem;
  font-weight: 750;
  letter-spacing: -0.01em;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mp-copy p {
  display: -webkit-box;
  margin: 0.28rem 0 0;
  overflow: hidden;
  color: #c7c7d0;
  font-size: 0.73rem;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.mp-copy span {
  display: block;
  overflow: hidden;
  margin-top: 0.3rem;
  color: #1ed760;
  font-size: 0.65rem;
  font-weight: 650;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mp-progress {
  padding: 0 0.95rem 0.78rem;
}

.mp-progress-track {
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: #27272f;
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
  margin-top: 0.38rem;
  color: #9b9ba5;
  font-size: 0.61rem;
  font-variant-numeric: tabular-nums;
}

.mp-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.7rem 0.95rem 0.9rem;
  border-top: 1px solid var(--mp-line);
}

.mp-actions a,
.mp-actions button {
  display: inline-flex;
  min-height: 2.45rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 0.73rem;
  font-weight: 750;
  text-decoration: none;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, color 180ms ease;
}

.mp-open-link {
  background: #1ed760;
  color: #061109;
}

.mp-open-link:hover {
  background: #28e56a;
  transform: translateY(-1px);
}

.mp-actions button {
  border-color: #303039;
  background: transparent;
  color: #d7d7df;
  cursor: pointer;
}

.mp-actions button:hover:not(:disabled) {
  border-color: rgba(255, 61, 61, 0.65);
  background: rgba(255, 61, 61, 0.08);
  color: #fff;
}

.mp-actions a:focus-visible,
.mp-actions button:focus-visible {
  outline: 2px solid #ff4d4d;
  outline-offset: 3px;
}

.mp-actions button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.mp-actions svg {
  width: 0.9rem;
  height: 0.9rem;
}

.spinning {
  animation: mp-spin 800ms linear infinite;
}

@keyframes mp-pulse {
  50% { box-shadow: 0 0 0 6px rgba(30, 215, 96, 0); }
}

@keyframes mp-bar {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

@keyframes mp-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .mp-status-dot.active,
  .mp-bars span,
  .spinning {
    animation: none;
  }

  .mp-progress-track div,
  .mp-actions a,
  .mp-actions button,
  .mp-panel {
    transition: none;
  }
}
</style>
