<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import BackgroundParticles from './components/BackgroundParticles.vue'
import SidePanel from './components/SidePanel.vue'
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<template>
  <div class="min-h-screen bg-[#000000] text-white flex flex-col font-sans relative overflow-x-hidden">
    <BackgroundParticles />
    <SidePanel />
    <MusicPlayer />
    
    <div class="relative z-10 w-full flex-grow">
      <Header />
      
      <main class="w-full">
        <RouterView />
      </main>
      
      <Footer />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  transition: margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

body.panel-open {
  margin-right: 300px;
}
</style>
