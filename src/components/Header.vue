<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import { t } from '../utils/i18n'

const route = useRoute()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

// ── Sección activa (por IntersectionObserver) ─────────────
const activeSection = ref('inicio')

const sectionIds = ['inicio', 'sobre-mi', 'habilidades', 'certificaciones', 'proyectos']
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-20% 0px -40% 0px', threshold: 0.05 }
  )
  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer!.observe(el)
  })
}

watch(() => route.hash, (newHash) => {
  if (newHash) {
    const id = newHash.substring(1)
    if (sectionIds.includes(id)) {
      activeSection.value = id
    }
  }
})

// Devuelve true si este nav item está activo
function isActive(href: string): boolean {
  // Links de rutas reales (sin #)
  if (!href.includes('#')) {
    return route.path === href
  }
  // Links de hash: comparar la sección visible
  const hash = href.split('#')[1]
  return activeSection.value === hash
}

// ── Discord Presence ──────────────────────────────────────
const DISCORD_ID = '1222709051172065301'
const discordAvatar  = ref('')
const discordName    = ref('NEK')
const discordStatus  = ref<'online'|'idle'|'dnd'|'offline'>('offline')
const discordActivity = ref('')
const discordLoaded  = ref(false)

const statusColor = computed(() => ({
  online:  '#3ba55d',
  idle:    '#faa61a',
  dnd:     '#ed4245',
  offline: '#747f8d',
})[discordStatus.value])

const statusLabel = computed(() => ({
  online:  t('header.online'),
  idle:    t('header.idle'),
  dnd:     t('header.dnd'),
  offline: t('header.offline'),
})[discordStatus.value])

function buildAvatarUrl(userId: string, hash: string, size = 64) {
  const ext = hash.startsWith('a_') ? 'gif' : 'webp'
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=${size}`
}

let presenceInterval: ReturnType<typeof setInterval> | null = null

async function fetchPresence() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success) {
        const d    = data.data
        const user = d.discord_user

        discordName.value   = user.display_name || user.global_name || user.username || 'NEK'
        discordStatus.value = d.discord_status ?? 'offline'

        if (user.avatar)
          discordAvatar.value = buildAvatarUrl(DISCORD_ID, user.avatar)

        if (d.listening_to_spotify && d.spotify?.song) {
          discordActivity.value = `🎵 ${d.spotify.song}`
        } else if (d.activities?.length) {
          const act = d.activities.find((a: any) => a.type === 0 || a.type === 1)
          discordActivity.value = act?.name ?? ''
        } else {
          discordActivity.value = ''
        }

        discordLoaded.value = true
        return
      }
    }
  } catch { /* siguiente */ }

  try {
    const res  = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${DISCORD_ID}`)
    const data = await res.json()
    if (data?.avatar?.link)  discordAvatar.value = data.avatar.link
    else if (data?.avatar?.id) discordAvatar.value = buildAvatarUrl(DISCORD_ID, data.avatar.id)
    if (data?.global_name || data?.username)
      discordName.value = data.global_name || data.username || 'NEK'
  } catch { /* silencioso */ }

  discordLoaded.value = true
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchPresence()
  presenceInterval = setInterval(fetchPresence, 30_000)
  setTimeout(() => {
    setupObserver()
  }, 300)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (presenceInterval) clearInterval(presenceInterval)
  if (observer) observer.disconnect()
})

const navItems = computed(() => [
  { name: t('nav.home'),          href: '/#inicio'          },
  { name: t('nav.profile'),       href: '/#sobre-mi'        },
  { name: t('nav.skills'),        href: '/#habilidades'     },
  { name: t('nav.certs'),         href: '/#certificaciones' },
  { name: t('nav.projects'),      href: '/#proyectos'       },
  { name: t('nav.notes'),         href: '/apuntes'          },
  { name: t('nav.terminal'),      href: '/terminal'         },
])
</script>

<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out hd-header',
    isScrolled ? 'hd-header--scrolled py-3' : 'hd-header--top py-5'
  ]">
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between">

      <!-- Logo -->
      <div class="hd-logo-row">
        <router-link to="/#inicio" class="text-lg font-bold text-white tracking-tight hover:text-[#a1a1aa] transition-colors">
          Jean_xp. • TC
        </router-link>

        <!-- Social Icons Next to Name/Discord -->
        <div class="hidden sm:flex items-center gap-3 ml-2 pr-3 border-r border-[#27272a]">
          <a href="https://github.com/JEAN-TC" target="_blank" rel="noopener noreferrer" class="text-[#a1a1aa] hover:text-white transition-colors" title="GitHub">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/jean-toscano-875894372/" target="_blank" rel="noopener noreferrer" class="text-[#a1a1aa] hover:text-[#0a66c2] transition-colors" title="LinkedIn">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>

        <!-- Discord Presence Card -->
        <a
          v-if="discordLoaded"
          href="https://discord.com/users/1222709051172065301"
          target="_blank"
          rel="noopener noreferrer"
          class="hd-presence-card"
          :title="statusLabel"
        >
          <!-- Avatar + status dot -->
          <div class="hd-avatar-wrap">
            <img v-if="discordAvatar" :src="discordAvatar" :alt="discordName" class="hd-avatar" />
            <svg v-else class="hd-avatar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span class="hd-status-dot" :style="{ background: statusColor }"></span>
          </div>

          <!-- Nombre + actividad -->
          <div class="hd-presence-info">
            <span class="hd-presence-name">{{ discordName }}</span>
            <span v-if="discordActivity" class="hd-presence-activity">{{ discordActivity }}</span>
            <span v-else class="hd-presence-activity">{{ statusLabel }}</span>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          :class="['hd-nav-link', isActive(item.href) && 'hd-nav-link--active']"
          active-class=""
          exact-active-class=""
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Right Controls -->
      <div class="hidden md:flex items-center gap-5">
        <router-link to="/#contacto" class="hd-btn-contact">
          {{ t('nav.contact') }}
        </router-link>
      </div>

      <!-- Mobile Controls -->
      <div class="flex items-center md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-[#a1a1aa] hover:text-white">
          <X v-if="isMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-[#09090b] border-b border-[#27272a] py-6 px-6 flex flex-col space-y-4"
      >
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          @click="isMenuOpen = false"
          :class="['text-base font-medium transition-colors', isActive(item.href) ? 'text-[#ff5555] font-semibold' : 'text-[#a1a1aa] hover:text-white']"
          active-class=""
          exact-active-class=""
        >
          {{ item.name }}
        </router-link>
        <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#27272a]">
          <a href="https://github.com/JEAN-TC" target="_blank" rel="noopener noreferrer" class="text-[#a1a1aa] hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/jean-toscano-875894372/" target="_blank" rel="noopener noreferrer" class="text-[#a1a1aa] hover:text-[#0a66c2] transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
        <router-link
          to="/#contacto"
          @click="isMenuOpen = false"
          class="w-full text-center text-sm font-semibold text-white bg-[#27272a] py-3 rounded-md mt-2"
        >
          {{ t('nav.contact') }}
        </router-link>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* ── Header Base ────────────────────────────────────── */
.hd-header {
  background: rgba(3, 3, 5, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 1px 0 0 rgba(255, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.6);
}
.hd-header--scrolled {
  background: rgba(3, 3, 5, 0.92);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 0 0 rgba(255, 0, 0, 0.15), 0 16px 48px -12px rgba(0, 0, 0, 0.8);
}
.hd-header--top {
  background: rgba(3, 3, 5, 0.55);
}

/* ── Logo Row ───────────────────────────────────────── */
.hd-logo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ── Nav Links ──────────────────────────────────────── */
.hd-nav-link {
  position: relative;
  padding: 0.45rem 0.85rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #71717a;
  text-decoration: none;
  border-radius: 8px;
  transition: color 0.25s ease, background 0.25s ease;
  letter-spacing: 0.02em;
}

/* Dot indicador — solo visible en activo */
.hd-nav-link::before {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff3333;
  box-shadow: 0 0 6px 2px rgba(255, 51, 51, 0.7);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  opacity: 0;
}

/* Línea inferior — solo visible en hover */
.hd-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 55%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  border-radius: 2px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hd-nav-link:hover {
  color: #e4e4e7;
  background: rgba(255, 255, 255, 0.04);
}
.hd-nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}

/* ACTIVO — solo uno a la vez con exact-active-class */
.hd-nav-link--active {
  color: #ff5555 !important;
  font-weight: 600;
}
.hd-nav-link--active::before {
  transform: translateX(-50%) scale(1);
  opacity: 1;
  animation: dot-pulse 2s ease-in-out infinite;
}
.hd-nav-link--active::after {
  transform: translateX(-50%) scaleX(0) !important;
}

@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 4px 1px rgba(255, 51, 51, 0.6); }
  50%       { box-shadow: 0 0 10px 4px rgba(255, 51, 51, 0.9); }
}

/* ── Contact Button ─────────────────────────────────── */
.hd-btn-contact {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  border-radius: 10px;
  border: 1px solid rgba(255, 0, 0, 0.45);
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.18) 0%, rgba(255, 50, 50, 0.1) 100%);
  box-shadow: 0 0 16px -4px rgba(255, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: all 0.25s ease;
  letter-spacing: 0.01em;
}
.hd-btn-contact:hover {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.32) 0%, rgba(255, 50, 50, 0.22) 100%);
  border-color: rgba(255, 0, 0, 0.7);
  box-shadow: 0 0 24px -4px rgba(255, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}
.hd-btn-contact:active {
  transform: scale(0.97);
}

/* ── Discord Presence Card ──────────────────────────── */
.hd-presence-card {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 4px 10px 4px 4px;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.hd-presence-card:hover {
  background: rgba(255,255,255,0.09);
  border-color: rgba(255,255,255,0.18);
  box-shadow: 0 0 12px rgba(88, 101, 242, 0.15);
}

/* Avatar wrap */
.hd-avatar-wrap {
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
}
.hd-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1.5px solid rgba(255,255,255,0.15);
}
.hd-avatar-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1e1f22;
  padding: 5px;
  color: #5865f2;
}

/* Status dot */
.hd-status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #000;
}

/* Text info */
.hd-presence-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.hd-presence-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}
.hd-presence-activity {
  font-size: 0.62rem;
  color: #a1a1aa;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

