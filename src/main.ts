Exit code: 0
Wall time: 2.4 seconds
Output:
import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

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
      once: false, 
      mirror: true, 
      duration: 800, 
      easing: 'ease-out-cubic',
      offset: 50,
    })
    aosReady = true
    document.body.classList.add('aos-ready')
    refreshAos()
  } catch {
    document.body.classList.remove('aos-ready')
  }
})

