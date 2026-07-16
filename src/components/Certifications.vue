<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { t } from '../utils/i18n'
import courseraLogo from '../assets/coursera-svgrepo-com.svg'
import fortinetLogo from '../assets/fortinet-svgrepo-com.svg'
import htbLogo from '../assets/hackthebox-svgrepo-com.svg'
import cwlLogo from '../assets/CWL.png'
import awsLogo from '../assets/aws-svgrepo-com (1).svg'
import ciscoLogo from '../assets/cisco-svgrepo-com (1).svg'

const categories = computed(() => {
  const items = t('certs.items') as Record<string, {name: string, desc: string}>
  return [
    {
      id: 'coursera',
      name: items.coursera.name,
      count: 27,
      desc: items.coursera.desc,
      iconSrc: courseraLogo
    },
    {
      id: 'fortinet',
      name: items.fortinet.name,
      count: 2,
      desc: items.fortinet.desc,
      iconSrc: fortinetLogo
    },
    {
      id: 'aws',
      name: items.aws.name,
      count: 1,
      desc: items.aws.desc,
      iconSrc: awsLogo
    },
    {
      id: 'hackthebox',
      name: items.hackthebox.name,
      count: 1,
      desc: items.hackthebox.desc,
      iconSrc: htbLogo
    },
    {
      id: 'cwl',
      name: items.cwl.name,
      count: 2,
      desc: items.cwl.desc,
      iconSrc: cwlLogo
    },
    {
      id: 'cisco',
      name: items.cisco.name,
      count: 6,
      desc: items.cisco.desc,
      iconSrc: ciscoLogo
    },
    {
      id: 'otros',
      name: items.otros.name,
      count: 2,
      desc: items.otros.desc,
      svg: '<svg viewBox="0 0 24 24" class="w-10 h-10 fill-current text-white"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>'
    }
  ]
})
</script>

<template>
  <section id="certificaciones" class="py-24 bg-[#09090b]">
    <div class="max-w-6xl mx-auto px-6">

      <div class="mb-16 relative">
        <span class="section-label">{{ t('certs.label') }}</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ t('certs.title1') }} <span class="text-gradient">{{ t('certs.title2') }}</span></h2>
        <p class="text-[#a1a1aa] max-w-2xl">{{ t('certs.subtitle') }}</p>
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
          <p class="text-xs font-semibold text-[#71717a] mb-4 uppercase tracking-widest">{{ cat.count }} {{ t('certs.documents') }}</p>
          
          <p class="text-sm text-[#a1a1aa] leading-relaxed flex-1 mb-8">
            {{ cat.desc }}
          </p>
          
          <div class="mt-auto flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#ff0000] transition-colors w-full border-t border-[#27272a] pt-4">
            {{ t('certs.explore') }}
            <ChevronRight class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </router-link>
      </div>

    </div>
  </section>
</template>
