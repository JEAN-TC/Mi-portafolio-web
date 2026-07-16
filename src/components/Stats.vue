<script setup lang="ts">
import { computed } from 'vue'
import { Crosshair, ShieldCheck, Flag, Skull } from '@lucide/vue'
import { t } from '../utils/i18n'

const stats = computed(() => [
  { label: t('stats.pwned'), value: '15+', icon: Skull, color: 'text-red-500' },
  { label: t('stats.flags'), value: '50+', icon: Flag, color: 'text-yellow-500' },
  { label: t('stats.vulns'), value: '10', icon: Crosshair, color: 'text-[#ff0000]' },
  { label: t('stats.audits'), value: '6', icon: ShieldCheck, color: 'text-green-500' }
])
</script>

<template>
  <section class="py-16 bg-[#000000] relative overflow-hidden">
    <!-- Decoración Cyberpunk -->
    <div class="absolute right-0 top-0 w-64 h-full bg-[#ff0000]/5 blur-[100px] pointer-events-none"></div>
    <div class="absolute left-0 bottom-0 w-64 h-full bg-[#ff3333]/5 blur-[100px] pointer-events-none"></div>
    
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-12">
        
        <!-- Info lado izquierdo -->
        <div class="w-full md:w-1/3">
          <h2 class="text-3xl font-bold text-white mb-0">{{ t('stats.title') }}</h2>
        </div>

        <!-- Grid de Stats lado derecho -->
        <div class="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="(stat, idx) in stats" 
            :key="idx"
            class="bg-[#121215] border border-[#27272a] rounded-lg p-6 flex flex-col items-center justify-center text-center relative group hover:border-[#ff0000]/50 transition-colors"
          >
            <!-- Línea superior decorativa -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <component :is="stat.icon" class="w-8 h-8 mb-4" :class="stat.color" />
            <span class="text-3xl font-black text-white mb-1 font-mono">{{ stat.value }}</span>
            <span class="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">{{ stat.label }}</span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
