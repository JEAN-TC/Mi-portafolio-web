<script setup lang="ts">
import { ExternalLink, FolderGit2 } from '@lucide/vue'

const projects = [
  {
    title: 'CryptoSphere Dashboard',
    desc: 'Panel financiero en tiempo real. APIs WebSocket y gráficos interactivos animados con alertas personalizadas.',
    tech: ['Vue 3', 'TypeScript', 'Tailwind CSS'],
    url: 'https://github.com',
    git: 'https://github.com',
    gradient: 'from-[#ff0000]/20 to-transparent'
  },
  {
    title: 'NovaTask Kanban',
    desc: 'Gestor de tareas premium con soporte drag & drop, etiquetas, subtareas y persistencia total local.',
    tech: ['Vue 3', 'HTML5', 'CSS Modules'],
    url: 'https://github.com',
    git: 'https://github.com',
    gradient: 'from-[#ff5500]/20 to-transparent'
  },
  {
    title: 'ScribeAI Platform',
    desc: 'SaaS generativo para redacción de correos y copys de ventas. Integración de suscripciones con Stripe.',
    tech: ['Node.js', 'PostgreSQL', 'OpenAI API'],
    url: 'https://github.com',
    git: 'https://github.com',
    gradient: 'from-[#38bdf8]/20 to-transparent'
  },
  {
    title: 'Zenith Wallet App',
    desc: 'Concepto e interfaz para una billetera digital enfocada en transacciones seguras e interfaz accesible.',
    tech: ['Figma', 'UI/UX Design', 'Design Systems'],
    url: 'https://github.com',
    git: 'https://github.com',
    gradient: 'from-[#0ea5e9]/20 to-transparent'
  },
]
</script>

<template>
  <section id="proyectos" class="py-24 relative bg-[#030305] overflow-hidden">
    <!-- Background Glow -->
    <div class="bg-glow top-0 right-[-20%]"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <div class="mb-16">
        <span class="section-label">03. Portafolio</span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Trabajos <span class="text-gradient">Destacados</span>
        </h2>
        <p class="text-[#a1a1aa] max-w-2xl text-lg">
          Selección de mis proyectos recientes más importantes.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="project in projects"
          :key="project.title"
          class="card-modern group flex flex-col p-0"
        >
          <!-- Premium Image/Graphic Placeholder -->
          <div class="relative w-full h-48 bg-[#09090b] border-b border-[#27272a] overflow-hidden flex items-center justify-center">
            <div :class="['absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-500', project.gradient]"></div>
            
            <div class="relative z-10 w-16 h-16 rounded-2xl bg-[#121215] border border-[#27272a] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <FolderGit2 class="w-8 h-8 text-[#ff0000]" />
            </div>

            <!-- Subtle pattern overlay -->
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          </div>

          <!-- Content -->
          <div class="p-8 flex flex-col flex-1">
            <div class="mb-4 flex justify-between items-start">
              <h3 class="text-2xl font-bold text-white group-hover:text-[#ff0000] transition-colors duration-300">
                {{ project.title }}
              </h3>
            </div>
            
            <p class="text-[#a1a1aa] leading-relaxed flex-1 mb-8">
              {{ project.desc }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="t in project.tech"
                :key="t"
                class="px-2.5 py-1 bg-[#121215] border border-[#27272a] rounded-md text-xs font-medium text-[#a1a1aa]"
              >
                {{ t }}
              </span>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-[#27272a] mt-auto">
              <a :href="project.url" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#ff0000] transition-colors">
                Demo en Vivo
                <ExternalLink class="w-4 h-4" />
              </a>
              <a :href="project.git" target="_blank" class="flex items-center gap-2 text-sm font-semibold text-[#71717a] hover:text-white transition-colors ml-auto">
                Código
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
