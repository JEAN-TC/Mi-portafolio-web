<script setup lang="ts">
import { ArrowUp, MapPin, Phone, Mail, FileDown, ExternalLink } from '@lucide/vue'
import { computed } from 'vue'
import { t } from '../utils/i18n'

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const currentYear = new Date().getFullYear()

const navLinks = computed(() => [
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
  <footer class="ft-footer">
    <!-- Gradient divider -->
    <div class="ft-divider"></div>

    <!-- Main 4-column grid -->
    <div class="ft-container">

      <!-- ── Col 1: Brand & Bio ── -->
      <div class="ft-col ft-col--brand">
        <div class="ft-logo">
          <span class="ft-logo-text">Jean_xp.</span>
          <span class="ft-logo-dot">•</span>
          <span class="ft-logo-tag">TC</span>
        </div>
        <p class="ft-bio">
          {{ t('footer.bio') }}
        </p>
      </div>

      <!-- ── Col 2: Quick Nav ── -->
      <div class="ft-col">
        <h4 class="ft-col-title">{{ t('footer.navigation') }}</h4>
        <nav class="ft-nav">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.href"
            class="ft-nav-link"
            active-class=""
            exact-active-class=""
          >
            {{ link.name }}
          </router-link>
        </nav>
      </div>

      <!-- ── Col 3: Contact Info ── -->
      <div class="ft-col">
        <h4 class="ft-col-title">{{ t('footer.contact') }}</h4>
        <ul class="ft-info-list">
          <li class="ft-info-item">
            <MapPin class="ft-info-icon" />
            <span>Ventanilla</span>
          </li>
          <li class="ft-info-item">
            <Phone class="ft-info-icon" />
            <a href="tel:+51989697285" class="ft-info-link">+51 989697285</a>
          </li>
          <li class="ft-info-item">
            <Mail class="ft-info-icon" />
            <a href="mailto:jeantoscano5@gmail.com" class="ft-info-link">jeantoscano5@gmail.com</a>
          </li>
        </ul>
        <!-- CV Download -->
        <a href="/CV_Jean_Toscano.pdf" target="_blank" class="ft-cv-btn">
          <FileDown class="ft-cv-icon" />
          <span>{{ t('footer.downloadCv') }}</span>
        </a>
      </div>

      <!-- ── Col 4: Socials ── -->
      <div class="ft-col">
        <h4 class="ft-col-title">{{ t('footer.socials') }}</h4>
        <div class="ft-socials">
          <a
            href="https://github.com/jean-tc"
            target="_blank" rel="noopener noreferrer"
            class="ft-social-card" title="GitHub"
          >
            <svg class="ft-social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <div class="ft-social-info">
              <span class="ft-social-name">GitHub</span>
              <span class="ft-social-handle">@jean-tc</span>
            </div>
            <ExternalLink class="ft-social-ext" />
          </a>

          <a
            href="https://www.linkedin.com/in/jean-toscano-875894372/"
            target="_blank" rel="noopener noreferrer"
            class="ft-social-card" title="LinkedIn"
          >
            <svg class="ft-social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
            </svg>
            <div class="ft-social-info">
              <span class="ft-social-name">LinkedIn</span>
              <span class="ft-social-handle">Jean Toscano</span>
            </div>
            <ExternalLink class="ft-social-ext" />
          </a>

          <a
            href="https://profile.hackthebox.com/profile/019d3170-9d9c-72b2-bd70-f9403a567b37"
            target="_blank" rel="noopener noreferrer"
            class="ft-social-card" title="HackTheBox"
          >
            <svg class="ft-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #9fef00;">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <div class="ft-social-info">
              <span class="ft-social-name" style="color: #9fef00;">HackTheBox</span>
              <span class="ft-social-handle">@jean_xp</span>
            </div>
            <ExternalLink class="ft-social-ext" />
          </a>
        </div>
      </div>
    </div>

    <!-- ── Bottom Bar ── -->
    <div class="ft-bottom-wrap">
      <div class="ft-bottom">
        <p class="ft-copyright">
          © {{ currentYear }} Jean Piero Toscano Cárdenas. {{ t('footer.rights') }}
        </p>
        <button @click="scrollToTop" class="ft-top-btn" aria-label="Volver arriba">
          <ArrowUp class="w-4 h-4" />
          <span>{{ t('footer.backToTop') }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Footer Shell ─────────────────────────────────────── */
.ft-footer {
  background: #030305;
  position: relative;
}

.ft-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 0, 0, 0.2) 25%,
    rgba(255, 80, 80, 0.45) 50%,
    rgba(255, 0, 0, 0.2) 75%,
    transparent 100%
  );
}

/* ── Main Grid ────────────────────────────────────────── */
.ft-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 2.5rem;
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.3fr 1.2fr;
  gap: 3rem;
}
@media (max-width: 1024px) {
  .ft-container { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
}
@media (max-width: 640px) {
  .ft-container { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem 1.5rem 2rem; }
}

/* ── Column Base ──────────────────────────────────────── */
.ft-col {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.ft-col-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff5555;
  margin-bottom: 0.2rem;
}

/* ── Brand ────────────────────────────────────────────── */
.ft-logo {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.ft-logo-text {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}
.ft-logo-dot { color: #ff3333; font-weight: 800; font-size: 1.1rem; }
.ft-logo-tag { font-size: 0.72rem; font-weight: 600; color: #52525b; letter-spacing: 0.06em; }

.ft-bio {
  font-size: 0.78rem;
  color: #52525b;
  line-height: 1.7;
  max-width: 22ch;
}


/* ── Navigation ───────────────────────────────────────── */
.ft-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ft-nav-link {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 0.82rem;
  color: #52525b;
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
}
.ft-nav-link::before {
  content: '';
  width: 0;
  height: 1.5px;
  background: #ff4444;
  border-radius: 2px;
  transition: width 0.2s ease, margin-right 0.2s ease;
  flex-shrink: 0;
  margin-right: 0;
}
.ft-nav-link:hover {
  color: #e4e4e7;
}
.ft-nav-link:hover::before {
  width: 10px;
  margin-right: 6px;
}

/* ── Contact ──────────────────────────────────────────── */
.ft-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.ft-info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.78rem;
  color: #52525b;
  line-height: 1.4;
}
.ft-info-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #ff4444;
  margin-top: 1px;
}
.ft-info-link {
  color: #71717a;
  text-decoration: none;
  transition: color 0.2s;
}
.ft-info-link:hover { color: #e4e4e7; }

/* CV Button */
.ft-cv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  border-radius: 9px;
  border: 1px solid rgba(255, 0, 0, 0.38);
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.14), rgba(255, 50, 50, 0.07));
  box-shadow: 0 0 12px -4px rgba(255, 0, 0, 0.22);
  text-decoration: none;
  transition: all 0.25s ease;
  width: fit-content;
}
.ft-cv-btn:hover {
  border-color: rgba(255, 0, 0, 0.6);
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.26), rgba(255, 50, 50, 0.16));
  box-shadow: 0 0 20px -4px rgba(255, 0, 0, 0.4);
  transform: translateY(-1px);
}
.ft-cv-icon { width: 14px; height: 14px; flex-shrink: 0; }

/* ── Social Cards ─────────────────────────────────────── */
.ft-socials {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.ft-social-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.ft-social-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
}
.ft-social-icon { width: 17px; height: 17px; flex-shrink: 0; color: #a1a1aa; }
.ft-social-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.ft-social-name { font-size: 0.78rem; font-weight: 600; color: #d4d4d8; }
.ft-social-handle { font-size: 0.67rem; color: #52525b; }
.ft-social-ext { width: 11px; height: 11px; color: #3f3f46; flex-shrink: 0; }

/* ── Bottom Bar ───────────────────────────────────────── */
.ft-bottom-wrap {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.ft-bottom {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
@media (max-width: 640px) {
  .ft-bottom { flex-direction: column; text-align: center; padding: 1.25rem 1.5rem; }
}
.ft-copyright { font-size: 0.7rem; color: #3f3f46; }

.ft-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #71717a;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.ft-top-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}
</style>
