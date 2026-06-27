<script setup lang="ts">
import cwlLogo from '../assets/CWL.png'
import { ref, onMounted } from 'vue'

const typed = ref('')
const phrases = [
  'practicante de ciberseguridad.',
  'lector empedernido.',
  'rompedor de cosas para entenderlas.',
  'introvertido con ideas que explotan.',
]
let phraseIndex = 0
let charIndex = 0
let deleting = false
let paused = false

function typeLoop() {
  const current = phrases[phraseIndex]
  if (!deleting && !paused) {
    typed.value = current.slice(0, ++charIndex)
    if (charIndex === current.length) { paused = true; setTimeout(() => { paused = false; deleting = true }, 2200) }
  } else if (deleting && !paused) {
    typed.value = current.slice(0, --charIndex)
    if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length }
  }
  setTimeout(typeLoop, deleting ? 32 : 72)
}

const rasgos = [
  { label: 'Leer',                desc: 'Leo de todo — seguridad, filosofía, técnica. Si algo me atrapa a las 2am, no lo suelto hasta entenderlo.' },
  { label: 'Investigar',          desc: 'No me basta con que algo funcione. Necesito saber por qué funciona, y qué pasa si lo rompo.' },
  { label: 'Noche',               desc: 'Funciono mejor de noche. El silencio ayuda a pensar sin interrupciones.' },
  { label: 'Romper para entender', desc: 'La mejor forma de aprender algo es desmontarlo por completo. Así entiendo desde adentro.' },
  { label: 'Rabbit holes',        desc: 'Empiezo buscando una cosa y termino tres horas después entendiendo algo completamente diferente. Y está bien.' },
  { label: 'Introvertido',        desc: 'Soy callado hasta que encuentro el tema correcto. Ahí ya no paro.' },
  { label: 'Aprender siempre',    desc: 'El que deja de aprender deja de ser relevante. No me permito estancarme.' },
]

const activeRasgo = ref<number | null>(null)

function toggleRasgo(i: number) {
  activeRasgo.value = activeRasgo.value === i ? null : i
}

onMounted(() => typeLoop())
</script>

<template>
  <section id="inicio" class="hero-section">

    <!-- Ambient + texture -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="noise"></div>

    <div class="hero-wrap">

      <!-- ── HERO TOP ─── -->
      <div class="row-top">

        <!-- Nombre -->
        <div class="name-block" data-aos="fade-up" data-aos-duration="900">
          <div class="name-inner">
            <div class="name-accent-line"></div>
            <div>
              <p class="eyebrow">Hola, soy</p>
              <h1 class="name">
                Jean Piero<br/>
                <span class="accent">Toscano Cárdenas</span>
              </h1>
            </div>
          </div>

          <div class="typewriter-row" data-aos="fade-up" data-aos-duration="700" data-aos-delay="400">
            <span class="tw-bar"></span>
            <span class="tw-text">{{ typed }}<span class="blink">|</span></span>
          </div>
        </div>

        <!-- Logo -->
        <div class="logo-block" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
          <div class="logo-glow"></div>
          <img :src="cwlLogo" alt="CWL" class="logo-img" />
          <div class="logo-ring ring-outer"></div>
          <div class="logo-ring ring-inner"></div>
        </div>

      </div>

      <!-- Divider -->
      <div class="divider" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
        <span class="divider-dot"></span>
      </div>

      <!-- ── SOBRE MÍ ─── -->
      <div class="card card-about" data-aos="fade-up" data-aos-duration="900" data-aos-delay="100">
        <div class="card-deco"></div>
        <span class="label">sobre mí</span>
        <p class="about-text">
          Soy de los que leen hasta las 2am porque encontré algo interesante.
          Callado en los cuartos, ruidoso en las ideas. Aprendo todos los días
          porque <em>el que deja de aprender deja de ser peligroso.</em>
        </p>
        <div class="pills">
          <button
            v-for="(r, i) in rasgos"
            :key="i"
            class="pill"
            :class="{ active: activeRasgo === i }"
            @click="toggleRasgo(i)"
          >
            {{ r.label }}
          </button>
        </div>
        <transition name="rasgo-fade">
          <p v-if="activeRasgo !== null" class="rasgo-desc">
            {{ rasgos[activeRasgo].desc }}
          </p>
        </transition>
      </div>

      <!-- ── ROW INFERIOR ─── -->
      <div class="row-bottom">

        <!-- Mentalidad -->
        <div class="card card-focus" data-aos="fade-right" data-aos-duration="900" data-aos-delay="150">
          <span class="label">mentalidad</span>
          <blockquote class="quote">
            La seguridad no es<br/>un producto,<br/>
            <span class="quote-accent">es una mentalidad.</span>
          </blockquote>
          <p class="focus-sub">
            Pienso como atacante, actúo como defensor.
            Zero Trust no es una configuración, es una forma de ver el mundo.
          </p>
        </div>

        <!-- Apuntes -->
        <div class="card card-stack" data-aos="fade-left" data-aos-duration="900" data-aos-delay="200">
          <span class="label">apuntes</span>

          <router-link to="/apuntes/P.O.O" class="apunte-item">
            <div class="apunte-header">
              <p class="apunte-title">Professional Offensive Operations</p>
              <span class="apunte-arrow">→</span>
            </div>
            <p class="apunte-desc">
              Writeup del laboratorio P.O.O. (Hack The Box). Reconocimiento, IIS, MSSQL y escalada en Active Directory.
            </p>
            <div class="apunte-tags">
              <span class="atag">Active Directory</span>
              <span class="atag">MSSQL</span>
              <span class="atag">Red Team</span>
              <span class="atag">Nmap</span>
            </div>
          </router-link>

          <div class="sep"></div>

          <router-link to="/apuntes" class="ver-todos">
            Ver todos los apuntes <span>→</span>
          </router-link>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* ─── FONTS ─────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─── SECTION ────────────────────────────────────────────── */
.hero-section {
  position: relative;
  background: #060607;
  padding: 8rem 2rem 6rem;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* ─── NOISE TEXTURE ──────────────────────────────────────── */
.noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 1;
}

/* ─── BLOBS ──────────────────────────────────────────────── */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 550px; height: 550px;
  background: radial-gradient(circle, rgba(255,35,35,0.08), transparent 70%);
  top: -160px; left: -120px;
  animation: drift 16s ease-in-out infinite alternate;
}
.blob-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(200,50,0,0.05), transparent 70%);
  bottom: -80px; right: -60px;
  animation: drift 20s ease-in-out infinite alternate-reverse;
}
@keyframes drift { from{transform:translate(0,0)} to{transform:translate(55px,40px)} }

/* ─── WRAP ───────────────────────────────────────────────── */
.hero-wrap {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ─── ROW TOP ────────────────────────────────────────────── */
.row-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 4rem;
}

/* ─── NAME BLOCK ─────────────────────────────────────────── */
.name-block { display: flex; flex-direction: column; gap: 1.75rem; }

.name-inner {
  display: flex;
  align-items: stretch;
  gap: 1.5rem;
}
.name-accent-line {
  width: 3px;
  background: linear-gradient(to bottom, #ff3333, transparent);
  border-radius: 3px;
  flex-shrink: 0;
  min-height: 100%;
}
.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: #444;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.name {
  font-size: clamp(2.2rem, 4vw, 4.5rem);
  font-weight: 900;
  color: #f2f2f2;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.accent { color: #ff3333; }

.typewriter-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.tw-bar {
  width: 2px; height: 16px;
  background: #ff3333;
  border-radius: 2px;
  flex-shrink: 0;
  animation: barPulse 1.4s ease-in-out infinite;
}
@keyframes barPulse { 0%,100%{opacity:1;transform:scaleY(1)} 50%{opacity:0.35;transform:scaleY(0.7)} }
.tw-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.05rem;
  color: #555;
  letter-spacing: 0.01em;
}
.blink { animation: blink 0.85s step-end infinite; color: #ff3333; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ─── LOGO ───────────────────────────────────────────────── */
.logo-block {
  position: relative;
  width: 240px; height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-glow {
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,51,51,0.08), transparent 70%);
  animation: glowPulse 3s ease-in-out infinite alternate;
}
@keyframes glowPulse { from{opacity:0.5} to{opacity:1} }
.logo-img {
  width: 68%;
  object-fit: contain;
  opacity: 0.55;
  filter: grayscale(1);
  transition: opacity 0.5s, filter 0.5s;
  position: relative; z-index: 2;
}
.logo-block:hover .logo-img { opacity: 1; filter: grayscale(0); }
.logo-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,51,51,0.12);
}
.ring-outer { inset: 0; animation: spin 22s linear infinite; }
.ring-inner { inset: 20px; animation: spin 14s linear infinite reverse; border-style: dashed; border-color: rgba(255,51,51,0.07); }
@keyframes spin { to{transform:rotate(360deg)} }

/* ─── DIVIDER ────────────────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: -0.25rem 0;
}
.divider::before {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, #ff333322, #1e1e22);
}
.divider-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #ff3333;
  opacity: 0.6;
}

/* ─── SHARED CARD ────────────────────────────────────────── */
.card {
  background: linear-gradient(135deg, #0e0e11 0%, #0a0a0d 100%);
  border: 1px solid #1a1a1f;
  border-radius: 1.25rem;
  padding: 2.5rem;
  transition: border-color 0.4s, box-shadow 0.4s;
  position: relative;
  overflow: hidden;
}
.card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,51,51,0.15), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.card:hover { border-color: rgba(255,51,51,0.2); box-shadow: 0 8px 60px rgba(255,51,51,0.06); }
.card:hover::after { opacity: 1; }

.card-deco {
  position: absolute;
  bottom: -40px; right: -40px;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,51,51,0.04), transparent 70%);
  pointer-events: none;
}

/* ─── LABEL ──────────────────────────────────────────────── */
.label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff3333;
  margin-bottom: 1.25rem;
}

/* ─── ABOUT CARD ─────────────────────────────────────────── */
.card-about { display: flex; flex-direction: column; gap: 1.5rem; }
.about-text {
  font-size: 1.2rem;
  color: #7a7a8a;
  line-height: 1.9;
  max-width: 72ch;
  font-weight: 400;
}
.about-text em {
  color: #c0c0cc;
  font-style: normal;
  font-weight: 500;
}
.pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pill {
  border: 1px solid #202025;
  border-radius: 100px;
  padding: 0.4rem 1.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #555;
  letter-spacing: 0.02em;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.25s, color 0.25s, background 0.25s;
}
.pill:hover { border-color: rgba(255,51,51,0.35); color: #ccc; background: rgba(255,51,51,0.04); }
.pill.active {
  border-color: #ff3333;
  color: #fff;
  background: rgba(255,51,51,0.08);
}

.rasgo-desc {
  font-size: 0.95rem;
  color: #8a8a9a;
  line-height: 1.75;
  border-left: 2px solid rgba(255,51,51,0.4);
  padding-left: 1rem;
  margin-top: 0.25rem;
}

/* Transición suave */
.rasgo-fade-enter-active,
.rasgo-fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.rasgo-fade-enter-from,
.rasgo-fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* ─── ROW BOTTOM ─────────────────────────────────────────── */
.row-bottom {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 2rem;
}

/* ─── FOCUS CARD ─────────────────────────────────────────── */
.card-focus { display: flex; flex-direction: column; gap: 1.5rem; }
.quote {
  font-size: 1.75rem;
  font-weight: 800;
  color: #c8c8d0;
  line-height: 1.4;
  letter-spacing: -0.02em;
  border-left: 3px solid #ff3333;
  padding-left: 1.5rem;
  margin: 0;
  font-style: normal;
}
.quote-accent { color: #ff3333; }
.focus-sub {
  font-size: 1rem;
  color: #555;
  line-height: 1.8;
  padding-left: 1.5rem;
  border-left: 3px solid transparent;
}

/* ─── STACK CARD ─────────────────────────────────────────── */
.card-stack { display: flex; flex-direction: column; }
.stack-grid { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0; }
.stag {
  background: transparent;
  border: 1px solid #1e1e24;
  border-radius: 6px;
  padding: 0.3rem 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: #565660;
  transition: all 0.3s;
  cursor: default;
}
.stag:hover { border-color: rgba(255,51,51,0.3); color: #bbb; background: rgba(255,51,51,0.03); }

.sep {
  height: 1px;
  background: #1a1a1f;
  margin: 1.5rem 0 1.25rem;
}

.cert-list { display: flex; flex-direction: column; gap: 0.7rem; }
.cert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #555;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}
.cert-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.cert.done { color: #8a8a9a; }
.cert.done .cert-dot { background: #ff3333; box-shadow: 0 0 6px rgba(255,51,51,0.4); }
.cert.pending { color: #555; }
.cert.pending .cert-dot {
  background: transparent;
  border: 1.5px solid #444;
  animation: pendingBlink 2s ease-in-out infinite;
}
@keyframes pendingBlink { 0%,100%{opacity:1;border-color:#555} 50%{opacity:0.3;border-color:#333} }

/* ─── APUNTES CARD ───────────────────────────────────────── */
.apunte-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.1rem;
  border: 1px solid #1e1e24;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: border-color 0.3s, background 0.3s;
  cursor: pointer;
}
.apunte-item:hover {
  border-color: rgba(255,51,51,0.3);
  background: rgba(255,51,51,0.03);
}
.apunte-item:hover .apunte-arrow {
  transform: translateX(4px);
  color: #ff3333;
}
.apunte-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}
.apunte-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #c0c0cc;
  line-height: 1.4;
}
.apunte-arrow {
  font-size: 0.9rem;
  color: #444;
  flex-shrink: 0;
  transition: transform 0.3s, color 0.3s;
}
.apunte-desc {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.65;
}
.apunte-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.atag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  color: #ff3333;
  background: rgba(255,51,51,0.07);
  border: 1px solid rgba(255,51,51,0.15);
  border-radius: 4px;
  padding: 0.25rem 0.65rem;
}
.ver-todos {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #555;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.ver-todos:hover { color: #ff3333; }
.ver-todos span { transition: transform 0.3s; display: inline-block; }
.ver-todos:hover span { transform: translateX(4px); }

/* ─── RESPONSIVE ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .row-top { grid-template-columns: 1fr; }
  .logo-block { width: 180px; height: 180px; margin: 0 auto; }
  .row-bottom { grid-template-columns: 1fr; }
  .quote { font-size: 1.25rem; }
}
</style>
