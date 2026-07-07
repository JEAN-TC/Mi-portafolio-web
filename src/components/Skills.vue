<script setup lang="ts">
import { ShieldCheck, Network, Code2, Cloud } from '@lucide/vue'

const skillDomains = [
  {
    id: 'security',
    title: 'Ciberseguridad',
    icon: ShieldCheck,
    skills: ['Pentesting', 'OWASP Top 10', 'Red Teaming', 'Análisis Forense', 'OSINT', 'Malware Analysis', 'Auditoría']
  },
  {
    id: 'networking',
    title: 'Redes & Infraestructura',
    icon: Network,
    skills: ['CCNA R&S', 'Wireless Security', 'CyberOps', 'Industrial Cyber', 'Firewalls', 'SIEM']
  },
  {
    id: 'development',
    title: 'Desarrollo',
    icon: Code2,
    skills: ['Vue 3', 'TypeScript', 'React & Next', 'Node.js', 'Express', 'APIs', 'Python', 'Git']
  },
  {
    id: 'cloud',
    title: 'Cloud & Unix',
    icon: Cloud,
    skills: ['AWS Cloud', 'Linux Admin', 'Docker', 'PostgreSQL', 'SQL', 'CI/CD']
  }
]
</script>

<template>
  <section id="habilidades" class="py-16 bg-[#09090b] relative">
    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <div class="mb-10 relative">
        <span class="section-label">02. Stack Técnico</span>
        <h2 class="text-3xl font-bold text-white mb-2">Habilidades <span class="text-gradient">Técnicas</span></h2>
      </div>

      <!-- Skills Grid (Compact) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="domain in skillDomains"
          :key="domain.id"
          class="card-modern flex flex-col p-5 h-full group hover:border-[#ff3333]/30"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-[#121215] border border-[#27272a] rounded-lg flex items-center justify-center text-[#ff3333] group-hover:bg-[#ff3333]/10 transition-all duration-300">
              <component :is="domain.icon" class="w-4.5 h-4.5" />
            </div>
            <h3 class="text-sm font-bold text-white group-hover:text-[#ff3333] transition-colors">
              {{ domain.title }}
            </h3>
          </div>

          <!-- Skills list as chips -->
          <div class="flex flex-wrap gap-1.5">
            <span 
              v-for="skill in domain.skills"
              :key="skill"
              class="px-2 py-0.5 rounded bg-[#121215] border border-[#27272a]/60 text-[11px] text-[#a1a1aa] hover:text-white hover:border-[#ff3333]/40 hover:bg-[#ff3333]/5 transition-all duration-300 cursor-default select-none"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
