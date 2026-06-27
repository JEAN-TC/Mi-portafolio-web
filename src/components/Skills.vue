<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref<'all' | 'frontend' | 'backend' | 'security'>('all')

const categories = [
  { id: 'all',      name: 'Todas' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend',  name: 'Backend' },
  { id: 'security', name: 'Seguridad' },
]

const skills = [
  { name: 'Vue 3 & TypeScript', level: 95, category: 'frontend' },
  { name: 'Tailwind CSS',       level: 95, category: 'frontend' },
  { name: 'React & Next.js',    level: 78, category: 'frontend' },
  { name: 'Node.js & Express',  level: 85, category: 'backend' },
  { name: 'PostgreSQL & SQL',   level: 82, category: 'backend' },
  { name: 'REST APIs & GraphQL',level: 88, category: 'backend' },
  { name: 'Penetration Testing',level: 80, category: 'security' },
  { name: 'OWASP Top 10',       level: 88, category: 'security' },
  { name: 'Network Security',   level: 75, category: 'security' },
]


const getFilteredSkills = () => {
  if (activeCategory.value === 'all') return skills
  return skills.filter(s => s.category === activeCategory.value)
}
</script>

<template>
  <section id="habilidades" class="py-24 bg-[#09090b] relative">
    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <div class="mb-12 relative">
        <span class="section-label">02. Stack Técnico</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Habilidades <span class="text-gradient">Técnicas</span></h2>
        <p class="text-[#a1a1aa] max-w-2xl">Tecnologías y herramientas clave.</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-10">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id as any"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-semibold transition-colors',
            activeCategory === cat.id 
              ? 'bg-white text-black' 
              : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:bg-[#27272a] hover:text-white'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Skills Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <transition-group
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="skill in getFilteredSkills()"
            :key="skill.name"
            class="card-modern flex flex-col justify-center py-5 px-6"
          >
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm font-semibold text-white">{{ skill.name }}</span>
              <span class="text-xs text-[#71717a]">{{ skill.level }}%</span>
            </div>
            <div class="w-full h-1.5 bg-[#121215] rounded-full overflow-hidden border border-[#27272a] shadow-inner">
              <div 
                class="h-full bg-gradient-accent rounded-full transition-all duration-700 relative"
                :style="{ width: `${skill.level}%` }"
              >
                <div class="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

    </div>
  </section>
</template>
