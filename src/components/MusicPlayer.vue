<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const activeTab = ref<'local' | 'spotify'>('spotify')

// Notificaciones
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 5000)
}

// Formatear Segundos
const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ==========================================
// INTEGRACIÓN CON SPOTIFY (Backend)
// ==========================================
const spotifyPlaying = ref<any>(null)
const isPlayingSpotifyTrack = ref(false)
const progressMs = ref(0)
const durationMs = ref(0)
const isError = ref(false)

const progressPercent = computed(() =>
  durationMs.value > 0 ? (progressMs.value / durationMs.value) * 100 : 0
)
const progressTime = computed(() => formatTime(progressMs.value / 1000))
const durationTime = computed(() => formatTime(durationMs.value / 1000))

let spotifyPollingInterval: any = null
let progressTickerInterval: any = null

const pollSpotifyStatus = async () => {
  try {
    const res = await fetch('/api/spotify')
    if (!res.ok) throw new Error('Error backend')
    const data = await res.json()
    
    if (data.is_playing && data.item) {
      spotifyPlaying.value = data.item
      isPlayingSpotifyTrack.value = true
      progressMs.value = data.progress_ms ?? 0
      durationMs.value = data.item.duration_ms ?? 0
      isError.value = false

      if (progressTickerInterval) clearInterval(progressTickerInterval)
      progressTickerInterval = setInterval(() => {
        if (progressMs.value < durationMs.value) progressMs.value += 1000
      }, 1000)
    } else {
      spotifyPlaying.value = null
      isPlayingSpotifyTrack.value = false
      if (progressTickerInterval) clearInterval(progressTickerInterval)
    }
  } catch (err) {
    isError.value = true
    if (progressTickerInterval) clearInterval(progressTickerInterval)
  }
}

// ACCIONES (Control remoto)
const doAction = async (action: string, uri?: string) => {
  try {
    // Si pausamos o reproducimos, predecimos la respuesta para mayor fluidez
    if (action === 'play' && !uri) isPlayingSpotifyTrack.value = true
    if (action === 'pause') isPlayingSpotifyTrack.value = false

    const res = await fetch('/api/spotify/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, uri })
    })
    if (!res.ok) throw new Error('Action failed')
    
    // Forzamos actualización 1s después para asegurar
    setTimeout(pollSpotifyStatus, 1000)
  } catch (error) {
    showToast('Error al controlar Spotify. Asegúrate de tener Spotify activo.', 'error')
  }
}

const prevTrack = () => doAction('previous')
const nextTrack = () => doAction('next')
const togglePlay = () => doAction(isPlayingSpotifyTrack.value ? 'pause' : 'play')

// BÚSQUEDA
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)

const searchSpotify = async () => {
  if (!searchQuery.value) {
    searchResults.value = []
    return
  }
  isSearching.value = true
  try {
    const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery.value)}`)
    const data = await res.json()
    searchResults.value = data.tracks?.items || []
  } catch (error) {
    console.error(error)
  } finally {
    isSearching.value = false
  }
}

const playSearchedTrack = async (uri: string) => {
  await doAction('play', uri)
  searchQuery.value = ''
  searchResults.value = []
}

onMounted(() => {
  pollSpotifyStatus()
  spotifyPollingInterval = setInterval(pollSpotifyStatus, 10000)
})

onUnmounted(() => {
  if (spotifyPollingInterval) clearInterval(spotifyPollingInterval)
  if (progressTickerInterval) clearInterval(progressTickerInterval)
})

</script>

<template>
  <div>
    <!-- TOAST -->
    <Transition name="fade">
      <div v-if="toastMessage" class="mp-toast" :class="toastType">
        <span class="mp-toast-dot"></span>
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- PANEL PRINCIPAL -->
    <div class="mp-panel">
      
      <!-- ESTADO CONECTADO -->
      <div class="mp-connected">
        <!-- HERO -->
        <div class="mp-hero">
          <div class="mp-hero-bg" v-if="spotifyPlaying?.album?.images?.[0]?.url">
            <img :src="spotifyPlaying.album.images[0].url" alt="" />
          </div>
          <div class="mp-hero-overlay"></div>

          <div class="mp-hero-content">
            <div class="mp-cover-wrap">
              <img
                v-if="spotifyPlaying?.album?.images?.[0]?.url"
                :src="spotifyPlaying.album.images[0].url"
                class="mp-cover-img"
                alt="cover"
              />
              <div v-else class="mp-cover-empty">
                <svg viewBox="0 0 24 24" fill="currentColor" class="mp-cover-logo">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.68.48-1.04.26-2.9-1.77-6.55-2.17-10.85-1.19-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.7-1.07 8.73-.62 12 1.38.36.22.48.68.26 1.02zm1.46-3.26c-.28.45-.87.6-1.32.32-3.32-2.04-8.38-2.63-12.3-1.44-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.47-1.36 10.05-.7 13.85 1.63.45.28.6.87.32 1.32zm.12-3.37C15.2 8.35 8.79 8.14 5.07 9.27c-.58.18-1.2-.16-1.38-.74-.18-.58.16-1.2.74-1.38 4.27-1.3 11.35-1.06 15.82 1.6.52.3 1.7.9.36 1.42-.3.52-.9 1.7-1.42 1.38z"/>
                </svg>
              </div>
              <div v-if="isPlayingSpotifyTrack" class="mp-cover-playing">
                <div class="mp-wave-bars">
                  <span v-for="i in 4" :key="i"></span>
                </div>
              </div>
            </div>

            <div class="mp-track-info">
              <p v-if="spotifyPlaying" class="mp-track-name">{{ spotifyPlaying.name }}</p>
              <p v-else-if="isError" class="mp-track-name mp-idle">Error de conexión...</p>
              <p v-else class="mp-track-name mp-idle">Nada sonando...</p>
              
              <p class="mp-track-artist">
                {{ spotifyPlaying
                  ? spotifyPlaying.artists?.map((a: any) => a.name).join(', ')
                  : (isError ? 'Intenta más tarde' : 'Actualmente sin música') }}
              </p>
              <p v-if="spotifyPlaying?.album?.name" class="mp-track-album">
                {{ spotifyPlaying.album.name }}
              </p>
            </div>
          </div>
        </div>

        <div class="mp-progress-section">
          <div class="mp-progress-bar-wrap">
            <div class="mp-progress-bar" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="mp-progress-times">
            <span>{{ durationMs > 0 ? progressTime : '0:00' }}</span>
            <span>{{ durationMs > 0 ? durationTime : '0:00' }}</span>
          </div>
        </div>

        <!-- CONTROLES RESTAURADOS -->
        <div class="mp-controls">
          <button @click="prevTrack" class="mp-ctrl" title="Anterior">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          
          <button @click="togglePlay" class="mp-ctrl mp-ctrl-play" :title="isPlayingSpotifyTrack ? 'Pausar' : 'Reproducir'">
            <svg v-if="isPlayingSpotifyTrack" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          
          <button @click="nextTrack" class="mp-ctrl" title="Siguiente">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>

        <!-- BÚSQUEDA RESTAURADA -->
        <div class="mp-search-wrap">
          <div class="mp-search-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mp-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              v-model="searchQuery"
              @input="searchSpotify"
              type="text"
              class="mp-search-input"
              placeholder="Buscar canción y reproducir remotamente..."
            />
          </div>
          
          <div v-if="isSearching" class="mp-spinner"></div>
          
          <div v-if="searchResults.length > 0" class="mp-results">
            <div
              v-for="track in searchResults"
              :key="track.id"
              class="mp-result-item"
              @click="playSearchedTrack(track.uri)"
            >
              <img v-if="track.album?.images?.[0]?.url" :src="track.album.images[0].url" class="mp-result-cover" />
              <div class="mp-result-info">
                <p class="mp-result-name">{{ track.name }}</p>
                <p class="mp-result-artist">{{ track.artists?.map((a: any) => a.name).join(', ') }}</p>
              </div>
              <div class="mp-result-play">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── TOAST ───────────────────────────────────────────── */
.mp-toast {
  position: fixed; bottom: 7rem; left: 1.5rem; z-index: 9999;
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.65rem 1rem; border-radius: 10px;
  border: 1px solid #222; background: #0e0e12;
  font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #aaa;
  backdrop-filter: blur(12px); max-width: 280px;
}
.mp-toast-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff3333; flex-shrink: 0; }
.mp-toast.success .mp-toast-dot { background: #1db954; }
.mp-toast.error .mp-toast-dot { background: #ff3333; }

/* ─── PANEL ───────────────────────────────────────────── */
.mp-panel {
  width: 100%; background: rgba(0,0,0,0.2);
  border: 1px solid #1e1e24; border-radius: 12px;
  overflow: hidden; font-family: 'Inter', sans-serif;
  margin-top: 1rem;
}

/* ─── ESTADO CONECTADO ────────────────────────────────── */
.mp-connected { display: flex; flex-direction: column; }

/* HERO */
.mp-hero {
  position: relative; overflow: hidden; padding-bottom: 0;
}
.mp-hero-bg {
  position: absolute; inset: 0; z-index: 0;
}
.mp-hero-bg img {
  width: 100%; height: 100%; object-fit: cover;
  filter: blur(24px) saturate(1.2) brightness(0.45);
  transform: scale(1.15);
}
.mp-hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to bottom, rgba(9,9,12,0.35) 0%, rgba(9,9,12,0.85) 75%, #09090c 100%);
}

.mp-hero-header {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1rem 0;
}
.mp-user-mini { display: flex; align-items: center; gap: 0.45rem; }
.mp-username { font-size: 0.85rem; font-weight: 600; color: #fff; opacity: 0.9; }

.mp-hero-content {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 1rem;
  padding: 0.75rem 1.1rem 1.1rem;
}

.mp-cover-wrap {
  position: relative; width: 80px; height: 80px; border-radius: 10px;
  overflow: hidden; flex-shrink: 0; background: #111116;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.mp-cover-img { width: 100%; height: 100%; object-fit: cover; }
.mp-cover-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.mp-cover-logo { width: 32px; height: 32px; color: #1db954; opacity: 0.25; }
.mp-cover-playing {
  position: absolute; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
}

.mp-track-info { flex: 1; min-width: 0; }
.mp-track-name {
  font-size: 0.92rem; font-weight: 700; color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
}
.mp-track-name.mp-idle { color: #888; font-weight: 400; }
.mp-track-artist {
  font-size: 0.74rem; color: rgba(255,255,255,0.5); margin-top: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-track-album {
  font-size: 0.67rem; color: #1db954; margin-top: 4px; opacity: 0.8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.mp-wave-bars { display: flex; align-items: flex-end; gap: 2px; height: 20px; }
.mp-wave-bars span { display: block; width: 3px; border-radius: 2px; background: #fff; animation: bar-bounce 0.8s ease-in-out infinite; }
.mp-wave-bars span:nth-child(1) { height: 50%; animation-delay: 0s; }
.mp-wave-bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.mp-wave-bars span:nth-child(3) { height: 65%; animation-delay: 0.3s; }
.mp-wave-bars span:nth-child(4) { height: 35%; animation-delay: 0.45s; }

/* ─── PROGRESO ────────────────────────────────────────── */
.mp-progress-section { padding: 0 1.1rem 0.5rem; }
.mp-progress-bar-wrap {
  width: 100%; height: 3px; background: rgba(255,255,255,0.08);
  border-radius: 4px; overflow: hidden; cursor: pointer;
}
.mp-progress-bar {
  height: 100%; background: #1db954; border-radius: 4px;
  transition: width 0.9s linear;
}
.mp-progress-times {
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
  color: rgba(255,255,255,0.3); margin-top: 5px;
}

/* ─── CONTROLES ───────────────────────────────────────── */
.mp-controls {
  display: flex; align-items: center; justify-content: center;
  gap: 1rem; padding: 0.6rem 1rem 0.9rem;
  border-bottom: 1px solid #13131a;
}
.mp-ctrl {
  background: none; border: none; cursor: pointer; color: #666;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, transform 0.15s;
}
.mp-ctrl:hover { color: #ccc; transform: scale(1.1); }
.mp-ctrl svg { width: 18px; height: 18px; }
.mp-ctrl-play {
  width: 42px; height: 42px; border-radius: 50%;
  background: #1db954; color: #000 !important;
  transition: background 0.2s, transform 0.15s !important;
}
.mp-ctrl-play:hover { background: #1ed760 !important; transform: scale(1.08) !important; }
.mp-ctrl-play svg { width: 17px; height: 17px; }

/* ─── BÚSQUEDA ────────────────────────────────────────── */
.mp-search-wrap { padding: 0.75rem 1rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.mp-search-row {
  display: flex; align-items: center; gap: 0.5rem;
  background: #111116; border: 1px solid #1e1e24; border-radius: 10px; padding: 0.45rem 0.75rem;
}
.mp-search-icon { width: 13px; height: 13px; color: #3a3a3a; flex-shrink: 0; }
.mp-search-input { background: none; border: none; outline: none; font-size: 0.78rem; color: #ccc; width: 100%; font-family: 'Inter', sans-serif; }
.mp-search-input::placeholder { color: #333; }
.mp-spinner { width: 16px; height: 16px; border: 2px solid #1e1e24; border-top-color: #1db954; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0.4rem auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.mp-results { display: flex; flex-direction: column; gap: 1px; max-height: 145px; overflow-y: auto; }
.mp-results::-webkit-scrollbar { width: 3px; }
.mp-results::-webkit-scrollbar-thumb { background: #1e1e24; border-radius: 4px; }
.mp-result-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0.4rem; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
.mp-result-item:hover { background: #111116; }
.mp-result-cover { width: 30px; height: 30px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
.mp-result-info { flex: 1; min-width: 0; }
.mp-result-name { font-size: 0.74rem; font-weight: 600; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-result-artist { font-size: 0.63rem; color: #4a4a4a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-result-play {
  width: 20px; height: 20px; border-radius: 50%; background: #1a1a1a;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #555; transition: background 0.15s, color 0.15s;
}
.mp-result-item:hover .mp-result-play { background: #1db954; color: #000; }
.mp-result-play svg { width: 9px; height: 9px; }

/* ─── TRANSITIONS ─────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes bar-bounce { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
</style>