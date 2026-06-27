<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Music, Search, LogOut, RefreshCw, Repeat, Shuffle,
  ChevronDown, Headset
} from '@lucide/vue'
import { redirectToSpotifyAuth, getSpotifyToken, refreshSpotifyToken, SpotifyAPI } from '../utils/spotify'

// ==========================================
// 1. ESTADO GLOBAL & TABS
// ==========================================
const isOpen = ref(false)
const activeTab = ref<'local' | 'spotify'>('local') // 'local' o 'spotify'
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || ''
const clientID = ref(localStorage.getItem('spotify_client_id') || SPOTIFY_CLIENT_ID)

// Notificaciones / Alertas flotantes
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 5000)
}

// ==========================================
// 2. MODULO PLAYER LOCAL (HTML5 AUDIO)
// ==========================================
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(Number(localStorage.getItem('player_volume')) || 0.5)
const isMuted = ref(false)
const currentTrackIndex = ref(0)
const isLoop = ref(false)
const isShuffle = ref(false)

// Playlist de prueba local (Synthwave / Lo-Fi relajante)
const localPlaylist = [
  {
    title: "Dreamy Night",
    artist: "Lofi Dreamer",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
  },
  {
    title: "Cyberpunk Sunrise",
    artist: "Retro Kid",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80"
  },
  {
    title: "Vaporwave Horizon",
    artist: "Tokyo Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"
  }
]

const currentTrack = computed(() => localPlaylist[currentTrackIndex.value])

// Inicializar audio
const initAudio = () => {
  if (audio.value) {
    audio.value.pause()
  }
  audio.value = new Audio(currentTrack.value.url)
  audio.value.volume = isMuted.value ? 0 : volume.value

  audio.value.addEventListener('timeupdate', () => {
    if (audio.value) currentTime.value = audio.value.currentTime
  })

  audio.value.addEventListener('loadedmetadata', () => {
    if (audio.value) duration.value = audio.value.duration
  })

  audio.value.addEventListener('ended', () => {
    if (isLoop.value) {
      playLocal()
    } else {
      nextTrack()
    }
  })
}

// Controles Local
const playLocal = () => {
  if (!audio.value) initAudio()
  audio.value?.play()
    .then(() => {
      isPlaying.value = true
    })
    .catch((err) => {
      console.error("Error playing audio", err)
      showToast("Error al reproducir el archivo de audio local.", "error")
    })
}

const pauseLocal = () => {
  audio.value?.pause()
  isPlaying.value = false
}

const togglePlayLocal = () => {
  if (isPlaying.value) {
    pauseLocal()
  } else {
    playLocal()
  }
}

const nextTrack = () => {
  if (isShuffle.value) {
    currentTrackIndex.value = Math.floor(Math.random() * localPlaylist.length)
  } else {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % localPlaylist.length
  }
  initAudio()
  if (isPlaying.value) {
    playLocal()
  }
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + localPlaylist.length) % localPlaylist.length
  initAudio()
  if (isPlaying.value) {
    playLocal()
  }
}

const seek = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  if (audio.value) {
    audio.value.currentTime = value
    currentTime.value = value
  }
}

const changeVolume = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  volume.value = value
  localStorage.setItem('player_volume', value.toString())
  if (audio.value) {
    audio.value.volume = isMuted.value ? 0 : value
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audio.value) {
    audio.value.volume = isMuted.value ? 0 : volume.value
  }
}

const toggleLoop = () => {
  isLoop.value = !isLoop.value
}

const toggleShuffle = () => {
  isShuffle.value = !isShuffle.value
}

// Formatear Segundos
const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ==========================================
// 3. INTEGRACIÓN CON SPOTIFY API (PKCE)
// ==========================================
const spotifyUser = ref<any>(null)
const spotifyPlaying = ref<any>(null)
const isSpotifyConnected = ref(false)
const searchChecking = ref(false)
const searchResults = ref<any[]>([])
const searchQuery = ref('')
const isPlayingSpotifyTrack = ref(false)
const activeSpotifyDevice = ref(false)

let spotifyPollingInterval: any = null
let spotifyClientInstance: SpotifyAPI | null = null

// Obtener la URI de redirección actual
const getRedirectUri = () => {
  return `${window.location.origin}${window.location.pathname}`
}

// Iniciar sesión con Spotify (OAuth PKCE)
const connectToSpotify = async () => {
  if (!clientID.value.trim()) {
    showToast("Por favor, introduce un Client ID de Spotify válido.", "error")
    return
  }
  // Guardamos el Client ID en localStorage
  localStorage.setItem('spotify_client_id', clientID.value.trim())
  
  try {
    showToast("Redirigiendo a Spotify para iniciar sesión...", "info")
    await redirectToSpotifyAuth(clientID.value.trim(), getRedirectUri())
  } catch (error) {
    console.error(error)
    showToast("Error al iniciar autorización con Spotify.", "error")
  }
}

// Desconectar Spotify
const disconnectSpotify = () => {
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_refresh_token')
  localStorage.removeItem('spotify_token_expires')
  localStorage.removeItem('spotify_code_verifier')
  spotifyUser.value = null
  spotifyPlaying.value = null
  isSpotifyConnected.value = false
  spotifyClientInstance = null
  searchResults.value = []
  if (spotifyPollingInterval) clearInterval(spotifyPollingInterval)
  showToast("Desconectado de Spotify.", "success")
}

// Inicializar y verificar tokens al cargar
const initSpotify = async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const savedClientID = localStorage.getItem('spotify_client_id') || ''

  if (code && savedClientID) {
    // Intercambiar código por token
    const verifier = localStorage.getItem('spotify_code_verifier') || ''
    try {
      // Limpiar query params de la URL inmediatamente para evitar loops
      const url = new URL(window.location.href)
      url.searchParams.delete('code')
      url.searchParams.delete('state')
      window.history.replaceState({}, document.title, url.toString())

      showToast("Intercambiando token de Spotify...", "info")
      const tokens = await getSpotifyToken(savedClientID, code, getRedirectUri(), verifier)
      
      const now = new Date()
      const expiresAt = now.getTime() + tokens.expires_in * 1000

      localStorage.setItem('spotify_access_token', tokens.access_token)
      localStorage.setItem('spotify_refresh_token', tokens.refresh_token)
      localStorage.setItem('spotify_token_expires', expiresAt.toString())
      
      clientID.value = savedClientID
      isSpotifyConnected.value = true
      activeTab.value = 'spotify'
      isOpen.value = true
      
      showToast("Conectado con éxito a Spotify!", "success")
      await setupSpotifyClient(tokens.access_token)
    } catch (error: any) {
      console.error(error)
      showToast("Error de autenticación con Spotify: " + error.message, "error")
    }
    return
  }

  // Si ya tenemos token guardado
  const accessToken = localStorage.getItem('spotify_access_token')
  const refreshToken = localStorage.getItem('spotify_refresh_token')
  const expiresAt = Number(localStorage.getItem('spotify_token_expires') || '0')

  if (accessToken && refreshToken && savedClientID) {
    const now = new Date().getTime()
    if (now > expiresAt - 60000) { // Si expira en menos de 1 min, refrescar
      try {
        const tokens = await refreshSpotifyToken(savedClientID, refreshToken)
        const newExpiresAt = new Date().getTime() + tokens.expires_in * 1000

        localStorage.setItem('spotify_access_token', tokens.access_token)
        if (tokens.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token)
        }
        localStorage.setItem('spotify_token_expires', newExpiresAt.toString())
        
        isSpotifyConnected.value = true
        await setupSpotifyClient(tokens.access_token)
      } catch (err) {
        console.error("Error al refrescar token", err)
        disconnectSpotify()
      }
    } else {
      isSpotifyConnected.value = true
      await setupSpotifyClient(accessToken)
    }
  }
}

// Configurar el Cliente de API
const setupSpotifyClient = async (token: string) => {
  spotifyClientInstance = new SpotifyAPI(token)
  try {
    spotifyUser.value = await spotifyClientInstance.getUserProfile()
    await pollSpotifyStatus()
    
    // Iniciar polling continuo cada 5 segundos para actualizar el estado
    spotifyPollingInterval = setInterval(pollSpotifyStatus, 5000)
  } catch (error) {
    console.error("Error de cliente", error)
    disconnectSpotify()
  }
}

// Actualizar canción activa en Spotify
const pollSpotifyStatus = async () => {
  if (!spotifyClientInstance) return
  try {
    const current = await spotifyClientInstance.getCurrentlyPlaying()
    if (current) {
      spotifyPlaying.value = current.item
      isPlayingSpotifyTrack.value = current.is_playing
      activeSpotifyDevice.value = true
    } else {
      spotifyPlaying.value = null
      isPlayingSpotifyTrack.value = false
      activeSpotifyDevice.value = false
    }
  } catch (err) {
    console.error("Error al consultar reproducción en Spotify", err)
  }
}

// Buscar en Spotify
const handleSearch = async () => {
  if (!spotifyClientInstance || !searchQuery.value.trim()) return
  searchChecking.value = true
  try {
    searchResults.value = await spotifyClientInstance.searchTracks(searchQuery.value)
  } catch (err) {
    showToast("Error al buscar canciones.", "error")
  } finally {
    searchChecking.value = false
  }
}

// Intentar reproducir tema en Spotify o recurrir al preview local
const playSpotifyTrack = async (track: any) => {
  // Pausar reproductor local si está sonando
  pauseLocal()

  if (!spotifyClientInstance) return

  try {
    // Intentar reproducir en Spotify Connect
    showToast(`Intentando reproducir "${track.name}" en tu dispositivo Spotify...`, "info")
    await spotifyClientInstance.playTrack(track.uri)
    showToast(`Reproduciendo "${track.name}" en Spotify`, "success")
    isPlayingSpotifyTrack.value = true
    setTimeout(pollSpotifyStatus, 1000)
  } catch (err: any) {
    console.warn("Spotify Connect Fallback", err)
    
    // Fallback: Si no hay dispositivo o no es Premium, usar el Preview URL en el reproductor local
    if (track.preview_url) {
      showToast(`No se detectó dispositivo activo. Reproduciendo avance de 30s localmente.`, "info")
      
      // Simular pista local con los detalles de Spotify
      localPlaylist.push({
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        url: track.preview_url,
        cover: track.album.images[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300'
      })
      
      currentTrackIndex.value = localPlaylist.length - 1
      activeTab.value = 'local'
      initAudio()
      playLocal()
    } else {
      showToast("No se pudo reproducir. " + err.message, "error")
    }
  }
}

// Controladores rápidos de Spotify
const togglePlaySpotify = async () => {
  if (!spotifyClientInstance) return
  try {
    if (isPlayingSpotifyTrack.value) {
      await spotifyClientInstance.pause()
      isPlayingSpotifyTrack.value = false
    } else {
      await spotifyClientInstance.resume()
      isPlayingSpotifyTrack.value = true
    }
    setTimeout(pollSpotifyStatus, 500)
  } catch (err: any) {
    showToast("Error de control: " + err.message, "error")
  }
}

const nextSpotify = async () => {
  if (!spotifyClientInstance) return
  try {
    await spotifyClientInstance.next()
    showToast("Siguiente tema en Spotify", "success")
    setTimeout(pollSpotifyStatus, 800)
  } catch (err: any) {
    showToast("Error: " + err.message, "error")
  }
}

const prevSpotify = async () => {
  if (!spotifyClientInstance) return
  try {
    await spotifyClientInstance.previous()
    showToast("Tema anterior en Spotify", "success")
    setTimeout(pollSpotifyStatus, 800)
  } catch (err: any) {
    showToast("Error: " + err.message, "error")
  }
}

// Detener reproductor local al cambiar a Spotify
watch(activeTab, (newTab) => {
  if (newTab === 'spotify' && isPlaying.value) {
    pauseLocal()
  }
})

// ==========================================
// LÍCLO DE VIDA Y MONTAJE
// ==========================================
onMounted(() => {
  initAudio()
  initSpotify()
  window.addEventListener('open-music-player', () => { isOpen.value = true })
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
  }
  if (spotifyPollingInterval) {
    clearInterval(spotifyPollingInterval)
  }
  window.removeEventListener('open-music-player', () => { isOpen.value = true })
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

    <!-- FLOATING BUTTON -->
    <button class="mp-fab" :class="{ playing: isPlayingSpotifyTrack }" @click="isOpen = !isOpen" aria-label="Música">
      <div class="mp-fab-cover" v-if="spotifyPlaying?.album?.images?.[0]?.url">
        <img :src="spotifyPlaying.album.images[0].url" alt="cover" />
      </div>
      <div class="mp-fab-icon">
        <Headset v-if="!isPlayingSpotifyTrack" class="mp-fab-svg" />
        <div v-else class="mp-fab-bars">
          <span v-for="i in 4" :key="i"></span>
        </div>
      </div>
    </button>

    <!-- PANEL -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="mp-panel">

        <!-- Header -->
        <div class="mp-header">
          <span class="mp-header-label">
            <svg class="mp-sp-logo" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.68.48-1.04.26-2.9-1.77-6.55-2.17-10.85-1.19-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.7-1.07 8.73-.62 12 1.38.36.22.48.68.26 1.02zm1.46-3.26c-.28.45-.87.6-1.32.32-3.32-2.04-8.38-2.63-12.3-1.44-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.47-1.36 10.05-.7 13.85 1.63.45.28.6.87.32 1.32zm.12-3.37C15.2 8.35 8.79 8.14 5.07 9.27c-.58.18-1.2-.16-1.38-.74-.18-.58.16-1.2.74-1.38 4.27-1.3 11.35-1.06 15.82 1.6.52.3 1.7.9.36 1.42-.3.52-.9 1.7-1.42 1.38z"/>
            </svg>
            Spotify
          </span>
          <button class="mp-close" @click="isOpen = false">✕</button>
        </div>

        <!-- NO CONECTADO -->
        <div v-if="!isSpotifyConnected" class="mp-connect-state">
          <div class="mp-connect-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.3c-.22.36-.68.48-1.04.26-2.9-1.77-6.55-2.17-10.85-1.19-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.7-1.07 8.73-.62 12 1.38.36.22.48.68.26 1.02zm1.46-3.26c-.28.45-.87.6-1.32.32-3.32-2.04-8.38-2.63-12.3-1.44-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 4.47-1.36 10.05-.7 13.85 1.63.45.28.6.87.32 1.32zm.12-3.37C15.2 8.35 8.79 8.14 5.07 9.27c-.58.18-1.2-.16-1.38-.74-.18-.58.16-1.2.74-1.38 4.27-1.3 11.35-1.06 15.82 1.6.52.3 1.7.9.36 1.42-.3.52-.9 1.7-1.42 1.38z"/>
            </svg>
          </div>
          <p class="mp-connect-title">Conectar Spotify</p>
          <p class="mp-connect-desc">Vincula tu cuenta para ver qué estás escuchando en tiempo real.</p>
          <input v-model="clientID" class="mp-input" type="text" placeholder="Client ID..." />
          <button class="mp-connect-btn" @click="connectToSpotify">Conectar</button>
        </div>

        <!-- CONECTADO -->
        <div v-else class="mp-connected">

          <!-- Now Playing con portada grande -->
          <div class="mp-now-playing" :class="{ active: !!spotifyPlaying }">
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
              <!-- Playing indicator overlay -->
              <div v-if="isPlayingSpotifyTrack" class="mp-playing-overlay">
                <div class="mp-wave-bars">
                  <span v-for="i in 4" :key="i"></span>
                </div>
              </div>
            </div>

            <div class="mp-track-info">
              <p v-if="spotifyPlaying" class="mp-track-name">{{ spotifyPlaying.name }}</p>
              <p v-else class="mp-track-name mp-idle">Nada sonando...</p>
              <p class="mp-track-artist">
                {{ spotifyPlaying ? spotifyPlaying.artists?.map((a: any) => a.name).join(', ') : 'Abre Spotify y reproduce algo' }}
              </p>
            </div>

            <!-- Controls -->
            <div class="mp-controls">
              <button class="mp-ctrl" @click="prevSpotify" title="Anterior">
                <SkipBack />
              </button>
              <button class="mp-ctrl mp-ctrl-play" @click="togglePlaySpotify">
                <Pause v-if="isPlayingSpotifyTrack" />
                <Play v-else />
              </button>
              <button class="mp-ctrl" @click="nextSpotify" title="Siguiente">
                <SkipForward />
              </button>
              <button class="mp-ctrl mp-ctrl-refresh" @click="pollSpotifyStatus" title="Sincronizar">
                <RefreshCw />
              </button>
            </div>
          </div>

          <!-- User + logout -->
          <div class="mp-user-row">
            <div class="mp-user-info">
              <img
                v-if="spotifyUser?.images?.[0]?.url"
                :src="spotifyUser.images[0].url"
                class="mp-avatar"
                alt="avatar"
              />
              <div v-else class="mp-avatar-placeholder">{{ spotifyUser?.display_name?.[0] }}</div>
              <span class="mp-username">{{ spotifyUser?.display_name }}</span>
            </div>
            <button class="mp-logout" @click="disconnectSpotify" title="Desconectar">
              <LogOut />
            </button>
          </div>

          <!-- Búsqueda -->
          <div class="mp-search-wrap">
            <div class="mp-search-row">
              <Search class="mp-search-icon" />
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                class="mp-search-input"
                type="text"
                placeholder="Buscar canción..."
              />
            </div>
            <div v-if="searchChecking" class="mp-spinner"></div>
            <div v-else-if="searchResults.length > 0" class="mp-results">
              <div
                v-for="track in searchResults"
                :key="track.id"
                class="mp-result-item"
                @click="playSpotifyTrack(track)"
              >
                <img :src="track.album?.images?.[2]?.url || track.album?.images?.[0]?.url" class="mp-result-cover" alt="cover" />
                <div class="mp-result-info">
                  <p class="mp-result-name">{{ track.name }}</p>
                  <p class="mp-result-artist">{{ track.artists.map((a: any) => a.name).join(', ') }}</p>
                </div>
                <div class="mp-result-play"><Play /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ─── TOAST ───────────────────────────────────────────── */
.mp-toast {
  position: fixed;
  bottom: 7rem;
  left: 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid #222;
  background: #0e0e12;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: #aaa;
  backdrop-filter: blur(12px);
  max-width: 280px;
}
.mp-toast-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #ff3333;
  flex-shrink: 0;
}
.mp-toast.success .mp-toast-dot { background: #1db954; }
.mp-toast.error .mp-toast-dot { background: #ff3333; }

/* ─── FAB BUTTON ──────────────────────────────────────── */
.mp-fab {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 999;
  width: 52px; height: 52px;
  border-radius: 14px;
  border: 1px solid #222;
  background: #0e0e12;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
}
.mp-fab:hover { transform: scale(1.06); border-color: #333; }
.mp-fab.playing {
  border-color: rgba(29,185,84,0.4);
  box-shadow: 0 0 18px rgba(29,185,84,0.15);
}
.mp-fab-cover {
  position: absolute; inset: 0;
}
.mp-fab-cover img {
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0.3; filter: saturate(0.5);
}
.mp-fab-icon {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  z-index: 1;
}
.mp-fab-svg { width: 20px; height: 20px; color: #888; }
.mp-fab.playing .mp-fab-svg { color: #1db954; }

.mp-fab-bars {
  display: flex; align-items: flex-end; gap: 2px; height: 16px;
}
.mp-fab-bars span {
  display: block; width: 3px; border-radius: 2px;
  background: #1db954;
  animation: bar-bounce 0.8s ease-in-out infinite;
}
.mp-fab-bars span:nth-child(1) { height: 60%; animation-delay: 0s; }
.mp-fab-bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.mp-fab-bars span:nth-child(3) { height: 70%; animation-delay: 0.3s; }
.mp-fab-bars span:nth-child(4) { height: 45%; animation-delay: 0.45s; }

@keyframes bar-bounce {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* ─── PANEL ───────────────────────────────────────────── */
.mp-panel {
  position: fixed;
  bottom: 6rem;
  left: 1.5rem;
  z-index: 990;
  width: 300px;
  background: #09090c;
  border: 1px solid #1e1e24;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* ─── HEADER ──────────────────────────────────────────── */
.mp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #13131a;
}
.mp-header-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1db954;
}
.mp-sp-logo { width: 13px; height: 13px; }
.mp-close {
  background: none; border: none; color: #444;
  font-size: 0.85rem; cursor: pointer;
  transition: color 0.2s; line-height: 1;
}
.mp-close:hover { color: #ccc; }

/* ─── CONNECT STATE ───────────────────────────────────── */
.mp-connect-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
}
.mp-connect-icon {
  width: 48px; height: 48px;
  background: rgba(29,185,84,0.08);
  border: 1px solid rgba(29,185,84,0.15);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.mp-connect-icon svg { width: 24px; height: 24px; color: #1db954; }
.mp-connect-title {
  font-size: 0.95rem; font-weight: 700; color: #eee;
}
.mp-connect-desc {
  font-size: 0.75rem; color: #555; text-align: center; line-height: 1.6;
}
.mp-input {
  width: 100%;
  background: #111116;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #ccc;
  outline: none;
  transition: border-color 0.2s;
}
.mp-input:focus { border-color: rgba(29,185,84,0.35); }
.mp-input::placeholder { color: #3a3a3a; }
.mp-connect-btn {
  width: 100%;
  background: #1db954;
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 0.6rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.mp-connect-btn:hover { background: #1ed760; transform: translateY(-1px); }

/* ─── CONNECTED STATE ─────────────────────────────────── */
.mp-connected {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Cover + info */
.mp-now-playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.25rem;
}
.mp-cover-wrap {
  position: relative;
  width: 130px; height: 130px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #111116;
}
.mp-cover-img {
  width: 100%; height: 100%; object-fit: cover;
}
.mp-cover-empty {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #111116;
}
.mp-cover-logo { width: 40px; height: 40px; color: #1db954; opacity: 0.3; }

.mp-playing-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
}
.mp-wave-bars {
  display: flex; align-items: flex-end; gap: 3px; height: 24px;
}
.mp-wave-bars span {
  display: block; width: 4px; border-radius: 2px;
  background: #fff;
  animation: bar-bounce 0.8s ease-in-out infinite;
}
.mp-wave-bars span:nth-child(1) { height: 50%; animation-delay: 0s; }
.mp-wave-bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.mp-wave-bars span:nth-child(3) { height: 65%; animation-delay: 0.3s; }
.mp-wave-bars span:nth-child(4) { height: 35%; animation-delay: 0.45s; }

.mp-track-info { text-align: center; width: 100%; }
.mp-track-name {
  font-size: 0.9rem; font-weight: 700; color: #eee;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp-track-name.mp-idle { color: #444; font-weight: 400; }
.mp-track-artist {
  font-size: 0.75rem; color: #666; margin-top: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.mp-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.mp-ctrl {
  background: none; border: none; cursor: pointer;
  color: #555; transition: color 0.2s, transform 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.mp-ctrl:hover { color: #ccc; transform: scale(1.1); }
.mp-ctrl svg { width: 18px; height: 18px; }
.mp-ctrl-play {
  width: 40px; height: 40px;
  background: #1db954;
  border-radius: 50%;
  color: #000 !important;
  transition: background 0.2s, transform 0.15s !important;
}
.mp-ctrl-play:hover { background: #1ed760; transform: scale(1.08) !important; }
.mp-ctrl-play svg { width: 16px; height: 16px; }
.mp-ctrl-refresh svg { width: 13px; height: 13px; }

/* User row */
.mp-user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  border-top: 1px solid #13131a;
}
.mp-user-info { display: flex; align-items: center; gap: 0.5rem; }
.mp-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; }
.mp-avatar-placeholder {
  width: 22px; height: 22px; border-radius: 50%;
  background: #1db954;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: #000;
}
.mp-username { font-size: 0.75rem; color: #666; }
.mp-logout {
  background: none; border: none; cursor: pointer;
  color: #444; transition: color 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.mp-logout:hover { color: #ff4444; }
.mp-logout svg { width: 14px; height: 14px; }

/* Search */
.mp-search-wrap {
  padding: 0 1.25rem 1.25rem;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.mp-search-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #111116;
  border: 1px solid #1e1e24;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
}
.mp-search-icon { width: 13px; height: 13px; color: #444; flex-shrink: 0; }
.mp-search-input {
  background: none; border: none; outline: none;
  font-size: 0.78rem; color: #ccc; width: 100%;
  font-family: 'Inter', sans-serif;
}
.mp-search-input::placeholder { color: #333; }

.mp-spinner {
  width: 18px; height: 18px;
  border: 2px solid #222;
  border-top-color: #1db954;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0.5rem auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mp-results {
  display: flex; flex-direction: column; gap: 2px;
  max-height: 150px; overflow-y: auto;
}
.mp-results::-webkit-scrollbar { width: 3px; }
.mp-results::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

.mp-result-item {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.mp-result-item:hover { background: #111116; }
.mp-result-cover { width: 32px; height: 32px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
.mp-result-info { flex: 1; min-width: 0; }
.mp-result-name { font-size: 0.75rem; font-weight: 600; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-result-artist { font-size: 0.65rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-result-play {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
  color: #555;
}
.mp-result-item:hover .mp-result-play { background: #1db954; color: #000; }
.mp-result-play svg { width: 10px; height: 10px; }

/* ─── TRANSITIONS ─────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}
</style>