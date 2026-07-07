<script setup lang="ts">
import { ExternalLink } from '@lucide/vue'
import cryptosphereImg from '../assets/projects/cryptosphere.png'
import novataskImg from '../assets/projects/novatask.png'
import scribeaiImg from '../assets/projects/scribeai.png'
import zenithImg from '../assets/projects/zenith.png'

const projects = [
  {
    title: 'CryptoSphere Dashboard',
    desc: 'Panel financiero en tiempo real. Integra APIs WebSocket y gráficos interactivos animados con alertas de seguridad personalizadas.',
    tech: ['Vue 3', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    url: 'https://github.com',
    git: 'https://github.com',
    image: cryptosphereImg,
    gradient: 'from-[#ff0000]/20 to-transparent'
  },
  {
    title: 'NovaTask Kanban',
    desc: 'Gestor de tareas premium con soporte drag & drop, columnas neón, etiquetas de criticidad y persistencia total local.',
    tech: ['Vue 3', 'HTML5', 'CSS Modules', 'Drag & Drop'],
    url: 'https://github.com',
    git: 'https://github.com',
    image: novataskImg,
    gradient: 'from-[#ff5500]/20 to-transparent'
  },
  {
    title: 'ScribeAI Platform',
    desc: 'SaaS generativo para redacción de correos y copys de ventas. Incluye editor de texto enriquecido e integración con Stripe.',
    tech: ['Node.js', 'PostgreSQL', 'OpenAI API', 'Stripe'],
    url: 'https://github.com',
    git: 'https://github.com',
    image: scribeaiImg,
    gradient: 'from-[#38bdf8]/20 to-transparent'
  },
  {
    title: 'Zenith Wallet App',
    desc: 'Concepto e interfaz para una billetera digital enfocada en transacciones seguras de criptomonedas e interfaz accesible.',
    tech: ['Figma', 'UI/UX Design', 'Design Systems', 'Glassmorphism'],
    url: 'https://github.com',
    git: 'https://github.com',
    image: zenithImg,
    gradient: 'from-[#0ea5e9]/20 to-transparent'
  },
]

function handleMouseMove(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<template>
  <section id="proyectos" class="py-24 relative bg-[#030305] overflow-hidden">
    <!-- Background Glow -->
    <div class="bg-glow top-0 right-[-20%]"></div>
    <div class="bg-glow bottom-[-10%] left-[-10%] opacity-50"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <div class="mb-16">
        <span class="section-label">03. Portafolio</span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Trabajos <span class="text-gradient">Destacados</span>
        </h2>
        <p class="text-[#a1a1aa] max-w-2xl text-lg">
          Selección de mis proyectos recientes más importantes con interfaces avanzadas e interactivas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="project in projects"
          :key="project.title"
          class="card-glow group flex flex-col p-0 cursor-default"
          @mousemove="handleMouseMove"
        >
          <!-- Radial hover background highlight -->
          <div class="card-glow-bg"></div>

          <!-- Project Showcase Visual -->
          <div class="relative w-full h-56 bg-[#070709] border-b border-[#27272a]/60 overflow-hidden flex items-center justify-center z-10">
            <!-- Project Image -->
            <img 
              :src="project.image" 
              :alt="project.title"
              class="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            
            <!-- Radial color gradient layer (cyber highlight) -->
            <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none', project.gradient]"></div>

            <!-- Soft bottom blending gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent pointer-events-none"></div>

            <!-- Status Indicator badge -->
            <div class="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/85 backdrop-blur-md border border-[#27272a]/80 rounded-full text-[10px] font-mono text-[#ff0000] uppercase tracking-widest">
              <span class="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse"></span>
              {{ project.tech[0] }}
            </div>
          </div>

          <!-- Content Details -->
          <div class="p-8 flex flex-col flex-grow z-10">
            <h3 class="text-2xl font-bold text-white group-hover:text-[#ff0000] transition-colors duration-300 mb-3">
              {{ project.title }}
            </h3>
            
            <p class="text-[#a1a1aa] text-sm leading-relaxed mb-6 flex-grow">
              {{ project.desc }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="t in project.tech"
                :key="t"
                class="px-2.5 py-1 bg-zinc-900/60 border border-zinc-800/80 rounded-md text-[11px] font-mono text-zinc-400 group-hover:border-[#ff0000]/25 group-hover:text-zinc-300 transition-colors duration-300"
              >
                {{ t }}
              </span>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-[#27272a]/60 mt-auto">
              <a :href="project.url" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#ff0000] transition-colors group/link">
                Demo en Vivo
                <ExternalLink class="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <a :href="project.git" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-[#71717a] hover:text-white transition-colors ml-auto group/link">
                Código
                <svg class="w-4 h-4 fill-current transform group-hover/link:scale-110 transition-transform duration-300" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

