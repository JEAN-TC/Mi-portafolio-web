<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from '@lucide/vue'

const isMenuOpen   = ref(false)
const isScrolled   = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navItems = [
  { name: 'Inicio',          href: '/#inicio'          },
  { name: 'Perfil',          href: '/#sobre-mi'        },
  { name: 'Habilidades',     href: '/#habilidades'     },
  { name: 'Certificaciones', href: '/#certificaciones' },
  { name: 'Proyectos',       href: '/#proyectos'       },
  { name: 'Apuntes',         href: '/apuntes'          },
]
</script>

<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
    isScrolled ? 'bg-[#000000]/80 backdrop-blur-md border-b border-[#27272a] py-4' : 'bg-transparent py-6'
  ]">
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between">

      <!-- Logo -->
      <router-link to="/#inicio" class="text-lg font-bold text-white tracking-tight hover:text-[#a1a1aa] transition-colors">
        Jean_xp. • TC
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          class="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Right Controls -->
      <div class="hidden md:flex items-center">
        <router-link to="/#contacto" class="text-sm font-semibold text-white bg-[#27272a] hover:bg-[#3f3f46] transition-colors px-4 py-2 rounded-md">
          Contacto
        </router-link>
      </div>

      <!-- Mobile Controls -->
      <div class="flex items-center md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-[#a1a1aa] hover:text-white">
          <X v-if="isMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-[#09090b] border-b border-[#27272a] py-6 px-6 flex flex-col space-y-4"
      >
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          @click="isMenuOpen = false"
          class="text-base font-medium text-[#a1a1aa] hover:text-white transition-colors"
        >
          {{ item.name }}
        </router-link>
        <router-link
          to="/#contacto"
          @click="isMenuOpen = false"
          class="w-full text-center text-sm font-semibold text-white bg-[#27272a] py-3 rounded-md mt-2"
        >
          Contacto
        </router-link>
      </div>
    </transition>
  </header>
</template>
