import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

// Initialize AOS globally for scroll animations
AOS.init({
  once: true,
  mirror: false,
  duration: 650,
  easing: 'ease-out-cubic',
  offset: 40,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})
