<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronRight, Globe, ExternalLink } from '@lucide/vue'

// ─── PANEL ───────────────────────────────────────────
const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }

watch(isOpen, (val) => {
  document.body.classList.toggle('panel-open', val)
})

// ─── LANGUAGE ────────────────────────────────────────
const lang = ref<'es' | 'en'>(
  (localStorage.getItem('site_lang') as 'es' | 'en') || 'es'
)
function toggleLang() {
  lang.value = lang.value === 'es' ? 'en' : 'es'
  localStorage.setItem('site_lang', lang.value)
  window.dispatchEvent(new CustomEvent('lang-change', { detail: lang.value }))
}
</script>

<template>
  <!-- TAB TOGGLE -->
  <div class="side-tab" :class="{ open: isOpen }" @click="toggle" aria-label="Abrir panel lateral">
    <ChevronRight class="tab-icon" :class="{ rotated: isOpen }" />
  </div>

  <!-- DRAWER -->
  <transition name="drawer">
    <aside v-if="isOpen" class="side-drawer">

      <!-- Header -->
      <div class="drawer-header">
        <span class="drawer-title">Panel</span>
        <button class="drawer-close" @click="toggle">✕</button>
      </div>


      <!-- ── IDIOMA ─────────────────────────────── -->
      <section class="panel-section">
        <div class="section-label">
          <Globe class="section-icon" /> Idioma
        </div>
        <div class="lang-toggle">
          <button
            class="lang-btn"
            :class="{ active: lang === 'es' }"
            @click="lang !== 'es' && toggleLang()"
          >ES</button>
          <button
            class="lang-btn"
            :class="{ active: lang === 'en' }"
            @click="lang !== 'en' && toggleLang()"
          >EN</button>
        </div>
        <p class="lang-note">
          {{ lang === 'es'
            ? 'Cambiar a inglés próximamente.'
            : 'Full English support coming soon.' }}
        </p>
      </section>

      <!-- ── ENCUÉNTRAME ────────────────────────── -->
      <section class="panel-section">
        <div class="section-label">
          <ExternalLink class="section-icon" /> Encuéntrame
        </div>
        <div class="links-list">
          <a href="https://github.com/" target="_blank" class="social-link">
            <ExternalLink class="social-icon" />
            <span class="social-label">gh/</span> GitHub
          </a>
          <a href="https://linkedin.com/" target="_blank" class="social-link">
            <ExternalLink class="social-icon" />
            <span class="social-label">in/</span> LinkedIn
          </a>
          <a href="https://twitter.com/" target="_blank" class="social-link">
            <ExternalLink class="social-icon" />
            <span class="social-label">@</span> Twitter / X
          </a>
        </div>
      </section>

      <!-- ── FRASE ──────────────────────────────── -->
      <section class="panel-section fun-fact">
        <p class="fact-text">
          "El que deja de aprender<br/>deja de ser peligroso."
        </p>
        <span class="fact-attr">— Jean Piero</span>
      </section>

    </aside>
  </transition>
</template>

<style scoped>
/* ─── TAB ─────────────────────────────────────────────── */
.side-tab {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  width: 28px;
  height: 72px;
  background: #0e0e11;
  border: 1px solid #252528;
  border-right: none;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s, width 0.3s;
}
.side-tab:hover, .side-tab.open {
  background: #141418;
  border-color: rgba(255,51,51,0.35);
  width: 32px;
}
.tab-icon {
  width: 14px; height: 14px;
  color: #ff3333;
  flex-shrink: 0;
  transform: rotate(180deg);
  transition: transform 0.35s ease;
}
.tab-icon.rotated { transform: rotate(0deg); }

/* ─── DRAWER ──────────────────────────────────────────── */
.side-drawer {
  position: fixed;
  right: 0; top: 0;
  height: 100vh;
  width: 300px;
  background: #09090c;
  border-left: 1px solid #1e1e24;
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -4px 0 40px rgba(0,0,0,0.6);
  font-family: 'Inter', sans-serif;
}
.side-drawer::-webkit-scrollbar { width: 4px; }
.side-drawer::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

/* ─── HEADER ──────────────────────────────────────────── */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #1a1a20;
  position: sticky;
  top: 0;
  background: #09090c;
  z-index: 10;
}
.drawer-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #ff3333;
}
.drawer-close {
  background: none; border: none; color: #444;
  font-size: 1rem; cursor: pointer; line-height: 1;
  transition: color 0.2s;
}
.drawer-close:hover { color: #fff; }

/* ─── SECTIONS ────────────────────────────────────────── */
.panel-section {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #13131a;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #555;
}
.section-icon { width: 13px; height: 13px; }
.section-desc { font-size: 0.78rem; color: #444; line-height: 1.65; }

/* ─── MÚSICA BTN ──────────────────────────────────────── */
.music-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  background: #1db954;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  width: 100%;
}
.music-btn:hover { background: #1ed760; transform: translateY(-1px); }
.sp-logo { width: 16px; height: 16px; flex-shrink: 0; }

/* ─── LANG ────────────────────────────────────────────── */
.lang-toggle { display: flex; gap: 0.5rem; }
.lang-btn {
  flex: 1;
  padding: 0.45rem;
  background: #111116;
  border: 1px solid #222228;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.lang-btn.active {
  background: rgba(255,51,51,0.1);
  border-color: rgba(255,51,51,0.35);
  color: #ff3333;
}
.lang-btn:not(.active):hover { border-color: #333; color: #999; }
.lang-note { font-size: 0.7rem; color: #444; line-height: 1.6; }

/* ─── SOCIAL LINKS ────────────────────────────────────── */
.links-list { display: flex; flex-direction: column; gap: 0.4rem; }
.social-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #1a1a20;
  color: #666;
  text-decoration: none;
  font-size: 0.82rem;
  transition: all 0.2s;
  background: #0e0e12;
}
.social-link:hover { border-color: rgba(255,51,51,0.25); color: #ccc; background: #131318; }
.social-icon { width: 14px; height: 14px; flex-shrink: 0; }
.social-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: #ff3333;
  opacity: 0.7;
}

/* ─── FUN FACT ────────────────────────────────────────── */
.fun-fact { border-bottom: none; }
.fact-text {
  font-size: 0.88rem;
  color: #555;
  line-height: 1.75;
  font-style: italic;
  border-left: 2px solid rgba(255,51,51,0.3);
  padding-left: 0.85rem;
}
.fact-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #333;
  letter-spacing: 0.08em;
}

/* ─── TRANSITIONS ─────────────────────────────────────── */
.drawer-enter-active, .drawer-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
