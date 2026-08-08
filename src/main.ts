import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)
let aosReady = false

const refreshAos = () => {
  window.requestAnimationFrame(() => {
    if (aosReady) AOS.refreshHard()
  })
}

router.afterEach(refreshAos)

app.use(router)
app.mount('#app')

router.isReady().then(async () => {
  await nextTick()

  try {
    AOS.init({
      once: true,
      mirror: false,
      duration: 650,
      easing: 'ease-out-cubic',
      offset: 40,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })

    aosReady = true
    document.body.classList.add('aos-ready')
    refreshAos()
  } catch {
    document.body.classList.remove('aos-ready')
  }
})
