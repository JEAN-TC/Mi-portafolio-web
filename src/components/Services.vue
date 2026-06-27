<script setup lang="ts">
import { ShieldAlert, Code2, CloudCog } from '@lucide/vue'

const services = [
  {
    icon: ShieldAlert,
    title: 'Auditoría Web & Pentesting',
    description: 'Análisis de vulnerabilidades, pruebas de penetración y reporte de fallos de seguridad en aplicaciones web utilizando OWASP Top 10 y herramientas especializadas.',
  },
  {
    icon: Code2,
    title: 'Desarrollo SecDevOps',
    description: 'Construcción de aplicaciones full-stack robustas integrando prácticas de seguridad desde el código fuente, previniendo inyecciones SQL, XSS y CSRF por defecto.',
  },
  {
    icon: CloudCog,
    title: 'Arquitectura Segura',
    description: 'Diseño e implementación de infraestructuras en la nube (AWS) y redes locales con configuraciones de firewalls, segmentación y control de accesos estrictos.',
  }
]
</script>

<template>
  <section id="servicios" class="py-24 bg-[#09090b] relative border-t border-[#27272a]/50">
    <!-- Decoración de fondo -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.03),_transparent_70%)] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="mb-16 text-center">
        <span class="section-label mx-auto mb-4">Lo que hago</span>
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">Áreas de <span class="text-gradient">Especialización</span></h2>
        <p class="text-[#a1a1aa] max-w-2xl mx-auto text-lg">
          Combino la mentalidad ofensiva de un hacker con la capacidad constructiva de un desarrollador para crear soluciones inquebrantables.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="(service, index) in services" 
          :key="index"
          class="card-modern group p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
        >
          <div class="w-16 h-16 rounded-2xl bg-[#121215] border border-[#27272a] flex items-center justify-center mb-6 group-hover:border-[#ff0000]/50 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 relative overflow-hidden">
            <div class="absolute inset-0 bg-[#ff0000]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <component :is="service.icon" class="w-8 h-8 text-[#ff0000] relative z-10" />
          </div>
          
          <h3 class="text-xl font-bold text-white mb-4 group-hover:text-[#ff0000] transition-colors">{{ service.title }}</h3>
          <p class="text-[#a1a1aa] leading-relaxed text-sm">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
