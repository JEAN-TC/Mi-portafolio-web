Exit code: 0
Wall time: 2.3 seconds
Output:
<script setup lang="ts">
import Hero from '../components/Hero.vue'
import About from '../components/About.vue'
import Skills from '../components/Skills.vue'
import Stats from '../components/Stats.vue'
import Certifications from '../components/Certifications.vue'
import Projects from '../components/Projects.vue'
import Services from '../components/Services.vue'
import Contact from '../components/Contact.vue'
</script>

<template>
  <main class="w-full relative z-10">
    <Hero />

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="1100" data-aos-offset="120">
      <About />
    </div>

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="1050" data-aos-offset="120">
      <Skills />
    </div>

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="1050" data-aos-offset="120">
      <Certifications />
    </div>

    <Projects />

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="110">
      <Services />
    </div>

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="950" data-aos-offset="100">
      <Contact />
    </div>

    <div class="scroll-reveal" data-aos="fade-up" data-aos-duration="900" data-aos-offset="90">
      <Stats />
    </div>
  </main>
</template>

<style scoped>
.scroll-reveal {
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    will-change: auto;
  }
}
</style>

