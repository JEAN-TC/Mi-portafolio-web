<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from '@lucide/vue'
import { t } from '../utils/i18n'
import administradorTareasImg from '../assets/projects/administrador-tareas.jpg'
import webVulImg from '../assets/projects/web-vul.jpg'
import wazuhImg from '../assets/projects/wazuh.jpg'
import fimMonitorImg from '../assets/projects/fim-monitor.png'

const projects = computed(() => {
  const list = t('projects.list')
  return [
    {
      title: list[0].title,
      desc: list[0].desc,
      tech: ['React', 'TypeScript', 'Python', 'SQLite'],
      url: 'https://github.com/JEAN-TC/monitoreo-de-integridad-de-archivos',
      git: 'https://github.com/JEAN-TC/monitoreo-de-integridad-de-archivos',
      image: fimMonitorImg,
      gradient: 'from-[#00ffcc]/20 to-transparent',
      status: 'React',
      multiply: false
    },
    {
      title: list[1].title,
      desc: list[1].desc,
      tech: ['Vue 3', 'Node.js', 'JavaScript', 'CSS'],
      url: 'https://github.com/JEAN-TC/administrador-de-tareas',
      git: 'https://github.com/JEAN-TC/administrador-de-tareas',
      image: administradorTareasImg,
      gradient: 'from-[#ff0000]/20 to-transparent',
      status: 'Vue 3',
      multiply: false
    },
    {
      title: list[2].title,
      desc: list[2].desc,
      tech: ['JavaScript', 'Node.js', 'Express', 'HTML5'],
      url: 'https://github.com/JEAN-TC/web-vul',
      git: 'https://github.com/JEAN-TC/web-vul',
      image: webVulImg,
      gradient: 'from-[#ff5500]/20 to-transparent',
      status: 'JavaScript',
      multiply: false
    },
    {
      title: list[3].title,
      desc: list[3].desc,
      tech: ['Wazuh', 'Docker', 'Arch Linux', 'SIEM/XDR', 'OpenSearch'],
      url: 'https://github.com/wazuh/wazuh-docker',
      git: 'https://github.com/wazuh/wazuh-docker',
      image: wazuhImg,
      gradient: 'from-[#0055ff]/20 to-transparent',
      status: 'Docker',
      multiply: false
    },
  ]
})

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
  <section id="proyectos" class="py-24 relative bg-[#030305] overflow-hidden" style="isolation: isolate;">
    <!-- Background Glow -->
    <div class="bg-glow top-0 right-[-20%]"></div>
    <div class="bg-glow bottom-[-10%] left-[-10%] opacity-50"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <div class="mb-16">
        <span class="section-label">{{ t('projects.label') }}</span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ t('projects.title1') }} <span class="text-gradient">{{ t('projects.title2') }}</span>
        </h2>
        <p class="text-[#a1a1aa] max-w-2xl text-lg">
          {{ t('projects.subtitle') }}
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
          <div class="relative w-full h-56 bg-[#0a0a0d] overflow-hidden flex items-center justify-center z-10">
            <!-- Fondo oscuro extra detrás de la imagen para matar el blanco -->
            <div class="absolute inset-0 bg-[#0a0a0d] z-0"></div>

            <!-- Project Image -->
            <img 
              :src="project.image" 
              :alt="project.title"
              class="relative w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] z-[1]"
              :style="{
                mixBlendMode: project.multiply ? 'multiply' : 'normal',
                filter: 'brightness(1) contrast(1)'
              }"
            />
            
            <!-- Overlay oscuro suave que cubre los bordes blancos (solo si tiene fondo claro) -->
            <div 
              v-if="project.multiply" 
              class="absolute inset-0 bg-[#0a0a0d]/40 z-[2] pointer-events-none"
            ></div>

            <!-- Radial color gradient layer (cyber highlight) -->
            <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-[3]', project.gradient]"></div>

            <!-- Soft bottom blending gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/10 to-transparent pointer-events-none z-[4]"></div>

            <!-- Status Indicator badge -->
            <div class="absolute top-4 left-4 z-[5] flex items-center gap-2 px-3 py-1 bg-black/90 backdrop-blur-md border border-[#ff0000]/30 rounded-full text-[10px] font-mono text-[#ff4444] uppercase tracking-widest shadow-lg">
              <span class="w-1.5 h-1.5 rounded-full bg-[#ff0000] animate-pulse shadow-[0_0_6px_rgba(255,0,0,0.8)]"></span>
              {{ project.tech[0] }}
            </div>
          </div>

          <!-- Content Details -->
          <div class="p-8 flex flex-col flex-grow z-10" style="border-top: 1px solid rgba(255, 0, 0, 0.5);">
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
                class="px-2.5 py-1 bg-zinc-800/70 border border-zinc-700/60 rounded-md text-[11px] font-mono text-zinc-300 group-hover:border-[#ff0000]/35 group-hover:text-zinc-200 transition-colors duration-300"
              >
                {{ t }}
              </span>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-[#27272a]/60 mt-auto">
              <a :href="project.url" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#ff0000] transition-colors group/link">
                {{ t('projects.liveDemo') }}
                <ExternalLink class="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <a :href="project.git" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-[#71717a] hover:text-white transition-colors ml-auto group/link">
                {{ t('projects.code') }}
                <svg class="w-4 h-4 fill-current transform group-hover/link:scale-110 transition-transform duration-300" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

