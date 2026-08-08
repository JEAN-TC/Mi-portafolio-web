<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isActive = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

const toggleMatrix = (e: Event) => {
  const detail = (e as CustomEvent).detail
  if (detail === 'start') {
    isActive.value = true
    setTimeout(startMatrix, 50)
  } else if (detail === 'stop') {
    stopMatrix()
    isActive.value = false
  } else {
    isActive.value = !isActive.value
    if (isActive.value) {
      setTimeout(startMatrix, 50)
    } else {
      stopMatrix()
    }
  }
}

const startMatrix = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.scale(dpr, dpr)
  }
  resize()
  window.addEventListener('resize', resize)

  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789'
  const alphabet = katakana.split('')

  const fontSize = window.innerWidth < 768 ? 14 : 16
  let columns = window.innerWidth / fontSize
  let rainDrops: number[] = Array.from({ length: columns }).map(() => 1)

  const draw = () => {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#ff0000'
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    ctx.fillStyle = accentColor
    ctx.font = fontSize + 'px monospace'

    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet[Math.floor(Math.random() * alphabet.length)]
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize)

      if (rainDrops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
        rainDrops[i] = 0
      }
      rainDrops[i]++
    }
    setTimeout(() => {
      if (animationId) animationId = requestAnimationFrame(draw)
    }, 33) // ~30fps para rendimiento
  }

  animationId = requestAnimationFrame(draw)

  draw()
}

const stopMatrix = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

onMounted(() => {
  window.addEventListener('terminal-matrix', toggleMatrix)
})

onUnmounted(() => {
  window.removeEventListener('terminal-matrix', toggleMatrix)
  stopMatrix()
})
</script>

<template>
  <transition name="fade">
    <canvas
      v-if="isActive"
      ref="canvasRef"
      class="fixed inset-0 w-full h-full z-40 bg-black/85"
    ></canvas>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
