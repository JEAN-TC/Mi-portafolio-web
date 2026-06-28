<script setup lang="ts">
const education = [
  {
    degree: 'Ingeniería de Sistemas',
    institution: 'Tu Universidad',
    period: '2021 – Presente',
    desc: 'Seguridad de software, arquitecturas robustas y análisis de vulnerabilidades.',
    tag: 'En curso',
    accent: '#ff0000',
  },
  {
    degree: 'CCNA: Introduction to Networks',
    institution: 'Cisco Networking Academy',
    period: '2023',
    desc: 'Fundamentos de redes, TCP/IP, switches y routers.',
    tag: 'Completado',
    accent: '#ff5500',
  },
  {
    degree: 'CyberOps Associate',
    institution: 'Cisco Networking Academy',
    period: '2023',
    desc: 'Monitoreo de seguridad, análisis de amenazas, SIEM.',
    tag: 'Completado',
    accent: '#ff0000',
  },
  {
    degree: 'Ethical Hacker',
    institution: 'Cisco Networking Academy',
    period: '2024',
    desc: 'Pentesting, reconocimiento, explotación y post-explotación.',
    tag: 'Completado',
    accent: '#ff5500',
  },
]
</script>

<template>
  <section id="sobre-mi" class="sm-section">
    <div class="sm-inner">

      <!-- Label -->
      <div class="sm-label">01. Perfil Profesional</div>

      <!-- TOP: Profile hero -->
      <div class="sm-hero">
        <div class="sm-hero-left">
          <div class="sm-photo-wrap">
            <img src="/src/assets/profile.png" alt="Jean Piero" class="sm-photo" />
            <div class="sm-photo-ring"></div>
          </div>
          <div class="sm-hero-text">
            <h1 class="sm-name">Jean Piero<br /><span>Toscano Cárdenas</span></h1>
            <p class="sm-role">Developer & Security Enthusiast</p>
            <div class="sm-available">
              <span class="sm-dot"></span> Disponible para proyectos
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="sm-stats">
          <div class="sm-stat">
            <span class="sm-stat-num">4+</span>
            <span class="sm-stat-label">Años estudiando</span>
          </div>
          <div class="sm-stat-div"></div>
          <div class="sm-stat">
            <span class="sm-stat-num">15+</span>
            <span class="sm-stat-label">Certificaciones</span>
          </div>
          <div class="sm-stat-div"></div>
          <div class="sm-stat">
            <span class="sm-stat-num">∞</span>
            <span class="sm-stat-label">Curiosidad</span>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div class="sm-bio-row">
        <div class="sm-bio-card">
          <div class="sm-bio-tag">Bio</div>
          <p class="sm-bio-text">
            Estudiante de sistemas con mentalidad de seguridad. Me apasiona entender
            cómo funcionan los sistemas por dentro — y cómo romperlos de forma responsable.
            Construyo pensando en que todo puede ser vulnerado, así que todo debe estar
            diseñado para resistir.
          </p>
        </div>
        <div class="sm-tags-card">
          <div class="sm-bio-tag">Intereses</div>
          <div class="sm-tag-grid">
            <span class="sm-tag">Ciberseguridad</span>
            <span class="sm-tag">Pentesting</span>
            <span class="sm-tag">Desarrollo web</span>
            <span class="sm-tag">Redes</span>
            <span class="sm-tag">CTF</span>
            <span class="sm-tag">Open Source</span>
            <span class="sm-tag">Linux</span>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div class="sm-edu-header">
        <div class="sm-edu-line"></div>
        <span>Formación Académica</span>
        <div class="sm-edu-line"></div>
      </div>

      <div class="sm-edu-grid">
        <div v-for="item in education" :key="item.degree" class="sm-edu-card">
          <div class="sm-edu-top">
            <span class="sm-edu-tag" :style="{ color: item.accent, borderColor: item.accent + '33' }">
              {{ item.tag }}
            </span>
            <span class="sm-edu-period">{{ item.period }}</span>
          </div>
          <h3 class="sm-edu-degree">{{ item.degree }}</h3>
          <p class="sm-edu-inst">{{ item.institution }}</p>
          <p class="sm-edu-desc">{{ item.desc }}</p>
          <div class="sm-edu-accent" :style="{ background: item.accent }"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.sm-section {
  padding: 7rem 0;
  background: #000;
  position: relative;
}
.sm-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,0,0,0.25), transparent);
}

.sm-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.sm-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff0000;
}

/* ── HERO ─────────────────────────────── */
.sm-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.sm-hero-left {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.sm-photo-wrap {
  position: relative;
  width: 96px; height: 96px;
  flex-shrink: 0;
}
.sm-photo {
  width: 100%; height: 100%;
  border-radius: 20px;
  object-fit: cover;
  position: relative; z-index: 1;
}
.sm-photo-ring {
  position: absolute;
  inset: -3px;
  border-radius: 23px;
  background: linear-gradient(135deg, #ff0000, #ff5500, transparent, transparent);
  z-index: 0;
}

.sm-name {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
}
.sm-name span {
  background: linear-gradient(90deg, #ff0000, #ff5500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sm-role {
  font-size: 0.82rem;
  color: #555;
  margin-top: 0.4rem;
}
.sm-available {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  font-size: 0.72rem;
  color: #4ade80;
  background: rgba(74,222,128,0.06);
  border: 1px solid rgba(74,222,128,0.15);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
}
.sm-dot {
  width: 6px; height: 6px;
  border-radius: 50%; background: #4ade80;
  animation: pulse-sm 2s ease-in-out infinite;
}
@keyframes pulse-sm { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

/* Stats */
.sm-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 1.25rem 2rem;
}
.sm-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.sm-stat-num {
  font-size: 1.75rem; font-weight: 800; color: #fff;
  font-family: 'JetBrains Mono', monospace;
}
.sm-stat-label { font-size: 0.68rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em; }
.sm-stat-div { width: 1px; height: 40px; background: #1a1a1a; }

/* ── BIO ROW ──────────────────────────── */
.sm-bio-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
}
@media (max-width: 700px) { .sm-bio-row { grid-template-columns: 1fr; } }

.sm-bio-card, .sm-tags-card {
  background: #09090b;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 1.5rem;
  transition: border-color 0.3s;
}
.sm-bio-card:hover, .sm-tags-card:hover { border-color: rgba(255,0,0,0.2); }

.sm-bio-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #ff0000;
  margin-bottom: 0.85rem;
}
.sm-bio-text {
  font-size: 0.875rem;
  color: #71717a;
  line-height: 1.8;
}

.sm-tag-grid { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.sm-tag {
  font-size: 0.72rem;
  color: #a1a1aa;
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 0.3rem 0.65rem;
  transition: border-color 0.2s, color 0.2s;
}
.sm-tag:hover { border-color: rgba(255,0,0,0.3); color: #fff; }

/* ── EDUCATION ────────────────────────── */
.sm-edu-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.72rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #333;
}
.sm-edu-line { flex: 1; height: 1px; background: #1a1a1a; }

.sm-edu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (max-width: 640px) { .sm-edu-grid { grid-template-columns: 1fr; } }

.sm-edu-card {
  background: #09090b;
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  padding: 1.25rem 1.25rem 1.25rem 1.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.2s;
}
.sm-edu-card:hover {
  border-color: rgba(255,0,0,0.2);
  transform: translateY(-2px);
}

.sm-edu-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  opacity: 0.6;
}

.sm-edu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.65rem;
}
.sm-edu-tag {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid;
  border-radius: 4px;
  padding: 2px 8px;
}
.sm-edu-period {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: #444;
}
.sm-edu-degree {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e5e5e5;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}
.sm-edu-inst {
  font-size: 0.73rem;
  color: #444;
  margin-bottom: 0.5rem;
}
.sm-edu-desc {
  font-size: 0.76rem;
  color: #3a3a3a;
  line-height: 1.6;
}
.sm-edu-card:hover .sm-edu-desc { color: #555; }
</style>
