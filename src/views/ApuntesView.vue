<script setup lang="ts">
import { BookOpen, Calendar, ArrowRight } from '@lucide/vue'

// Por ahora, simulamos un índice de apuntes. En el futuro podrías autogenerarlo leyendo la carpeta.
const apuntes = [
  {
    id: 'P.O.O',
    title: 'Professional Offensive Operations',
    desc: 'Writeup y apuntes del laboratorio P.O.O. (Hack The Box). Incluye técnicas de reconocimiento, IIS, MSSQL y escalada de privilegios en Active Directory.',
    date: 'Abril 2026',
    tags: ['Active Directory', 'MSSQL', 'Nmap', 'Red Team']
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#000000] py-24">
    <div class="max-w-6xl mx-auto px-6">
      
      <!-- Header -->
      <div class="mb-16 border-b border-[#27272a] pb-6 flex items-center gap-6">
        <div class="w-20 h-20 bg-[#121215] border border-[#27272a] rounded-xl flex items-center justify-center shadow-inner">
          <BookOpen class="w-10 h-10 text-[#ff0000]" />
        </div>
        
        <div>
          <span class="section-label mb-2 block">Segundo Cerebro</span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
            Mis <span class="text-gradient">Apuntes</span>
          </h1>
          <p class="text-[#a1a1aa] text-lg">
            Notas técnicas exportadas directamente desde mi bóveda de Obsidian.
          </p>
        </div>
      </div>

      <!-- Grid de Apuntes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="apunte in apuntes"
          :key="apunte.id"
          :to="`/apuntes/${apunte.id}`"
          class="card-modern group flex flex-col h-full cursor-pointer hover:border-[#ff0000]/50"
        >
          <div class="p-6 flex flex-col flex-1">
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in apunte.tags" 
                :key="tag"
                class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff0000] bg-[#ff0000]/10 border border-[#ff0000]/20 rounded-md"
              >
                {{ tag }}
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-[#ff0000] transition-colors leading-snug">
              {{ apunte.title }}
            </h3>
            
            <p class="text-[#a1a1aa] text-sm leading-relaxed mb-6 flex-1">
              {{ apunte.desc }}
            </p>
            
            <div class="mt-auto pt-4 border-t border-[#27272a] flex justify-between items-center text-sm">
              <span class="flex items-center gap-1.5 text-[#71717a] font-medium">
                <Calendar class="w-4 h-4" />
                {{ apunte.date }}
              </span>
              
              <span class="inline-flex items-center gap-1 font-bold text-white group-hover:text-[#ff0000] transition-colors">
                Leer Apunte
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </router-link>
      </div>

    </div>
  </div>
</template>
