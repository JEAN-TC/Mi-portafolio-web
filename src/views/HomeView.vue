<script setup lang="ts">
import Hero from '../components/Hero.vue'
import Terminal from '../components/Terminal.vue'
import About from '../components/About.vue'
import Skills from '../components/Skills.vue'
import Stats from '../components/Stats.vue'
import Certifications from '../components/Certifications.vue'
import Projects from '../components/Projects.vue'
import Services from '../components/Services.vue'
import Marquee from '../components/Marquee.vue'
import Contact from '../components/Contact.vue'
</script>

<template>
  <main class="w-full relative z-10">
    <Hero />
    <div class="max-w-6xl mx-auto px-6 -mt-10 mb-20 relative z-20">
      <Terminal />
    </div>
    <About />
    <Skills />
    <Certifications />
    <Projects />
    <Services />
    <Stats />
    <Marquee />
    <Contact />
  </main>
</template>
