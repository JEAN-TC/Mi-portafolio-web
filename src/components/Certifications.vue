<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import courseraLogo from '../assets/coursera-svgrepo-com.svg'
import fortinetLogo from '../assets/fortinet-svgrepo-com.svg'
import htbLogo from '../assets/hackthebox-svgrepo-com.svg'
import cwlLogo from '../assets/CWL.png'
import awsLogo from '../assets/aws-svgrepo-com (1).svg'
import ciscoLogo from '../assets/cisco-svgrepo-com (1).svg'

const categories = [
  {
    id: 'coursera',
    name: 'Coursera',
    count: 27,
    desc: 'Certificaciones técnicas de ciberseguridad e ingeniería avaladas por Microsoft, Google y universidades.',
    iconSrc: courseraLogo
  },
  {
    id: 'fortinet',
    name: 'Fortinet',
    count: 2,
    desc: 'Acreditaciones oficiales en fundamentos y nivel asociado de ciberseguridad y redes.',
    iconSrc: fortinetLogo
  },
  {
    id: 'aws',
    name: 'AWS',
    count: 1,
    desc: 'Certificaciones de arquitectura y operaciones en la nube de Amazon Web Services.',
    iconSrc: awsLogo
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    count: 1,
    desc: 'Certificaciones avanzadas en pentesting, análisis forense y operaciones de red teaming.',
    iconSrc: htbLogo
  },
  {
    id: 'cwl',
    name: 'CWL',
    count: 2,
    desc: 'Certificaciones especializadas y técnicas de CWL.',
    iconSrc: cwlLogo
  },
  {
    id: 'cisco',
    name: 'Cisco',
    count: 6,
    desc: 'Certificaciones de redes y ciberseguridad avaladas por Cisco Networking Academy.',
    iconSrc: ciscoLogo
  },
  {
    id: 'otros',
    name: 'Otros Certificados',
    count: 1,
    desc: 'Acreditaciones misceláneas, diplomas universitarios y constancias de participación.',
    svg: '<svg viewBox="0 0 24 24" class="w-10 h-10 fill-current text-white"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>'
  }
]
</script>

<template>
  <section id="certificaciones" class="py-24 bg-[#09090b]">
    <div class="max-w-6xl mx-auto px-6">

      <div class="mb-16 relative">
        <span class="section-label">04. Educación</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Colección de <span class="text-gradient">Certificaciones</span></h2>
        <p class="text-[#a1a1aa] max-w-2xl">Acreditaciones oficiales organizadas por plataforma emisora.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/certificados/${cat.id}`"
          class="card-modern group flex flex-col items-start cursor-pointer hover:border-[#ff0000]/50"
        >
          <div class="w-16 h-16 bg-[#121215] border border-[#27272a] rounded-xl mb-6 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-all duration-300 p-2">
            <template v-if="cat.iconSrc">
              <img :src="cat.iconSrc" :alt="cat.name" class="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
            </template>
            <template v-else>
              <div v-html="cat.svg" class="opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center w-full h-full"></div>
            </template>
          </div>
          
          <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-[#ff0000] transition-colors">
            {{ cat.name }}
          </h3>
          <p class="text-xs font-semibold text-[#71717a] mb-4 uppercase tracking-widest">{{ cat.count }} Documentos</p>
          
          <p class="text-sm text-[#a1a1aa] leading-relaxed flex-1 mb-8">
            {{ cat.desc }}
          </p>
          
          <div class="mt-auto flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#ff0000] transition-colors w-full border-t border-[#27272a] pt-4">
            Explorar Certificados
            <ChevronRight class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </router-link>
      </div>

    </div>
  </section>
</template>
