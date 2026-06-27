<script setup lang="ts">
import { ref } from 'vue'

const experience = [
  {
    role: 'Security Software Engineer',
    company: 'CipherTech Labs',
    period: '2024 – Presente',
    desc: 'Diseño de arquitecturas de software seguras end-to-end. Implementación de controles OWASP Top 10, análisis de vulnerabilidades estáticas y desarrollo de pipelines CI/CD con seguridad integrada.',
  },
  {
    role: 'Desarrollador Fullstack & Pentester',
    company: 'Quantum Tech Solutions',
    period: '2022 – 2024',
    desc: 'Desarrollo de APIs robustas en Node.js con autenticación JWT/OAuth2 y pruebas de penetración a aplicaciones web. Gestión de bases de datos PostgreSQL con cifrado en reposo.',
  },
  {
    role: 'Desarrollador Web & Analista de Seguridad',
    company: 'Nova Digital Agency',
    period: '2021 – 2022',
    desc: 'Desarrollo de interfaces seguras con validación de inputs y protección contra vulnerabilidades comunes. Implementación de headers de seguridad HTTP y monitoreo de tráfico.',
  },
]
</script>

<template>
  <section id="sobre-mi" class="py-24 bg-[#000000]">
    <div class="max-w-6xl mx-auto px-6">

      <div class="mb-16">
        <span class="section-label">01. Perfil Profesional</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Sobre <span class="text-gradient">Mí</span></h2>
        <p class="text-[#a1a1aa] max-w-2xl">Perfil profesional y experiencia destacada.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Biography -->
        <div class="lg:col-span-5 space-y-6 text-[#a1a1aa] leading-relaxed">
          <p>
            Soy Jean Piero Toscano Cárdenas, enfocado en construir plataformas digitales estructuralmente robustas y seguras.
          </p>
          <p>
            Con una mentalidad orientada a la seguridad, abordo el desarrollo integrando el rigor técnico de la ciberseguridad con las mejores prácticas de la ingeniería de software.
          </p>
        </div>

        <!-- Experience Timeline -->
        <div class="lg:col-span-7">
          <h3 class="text-xl font-bold text-white mb-8 border-b border-[#27272a] pb-4">Experiencia</h3>
          <div class="space-y-8">
            <div v-for="item in experience" :key="item.role" class="relative pl-8 border-l border-[#27272a] hover:border-[#ff0000]/50 transition-colors duration-300">
              <div class="absolute w-4 h-4 bg-[#09090b] border-2 border-[#ff0000] rounded-full -left-[8.5px] top-1 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
              <p class="text-xs font-semibold text-[#ff0000] mb-1 uppercase tracking-wider">{{ item.period }}</p>
              <h4 class="text-base font-bold text-white">{{ item.role }}</h4>
              <p class="text-sm text-[#a1a1aa] mb-2">{{ item.company }}</p>
              <p class="text-sm text-[#71717a] leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
