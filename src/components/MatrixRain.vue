<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isActive = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationId: number | null = null
let resizeHandler: (() => void) | null = null
let lastFrameAt = 0

const stopMatrix = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
}

const startMatrix = () => {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')

  if (!canvas || !context || animationId !== null || document.hidden) return

  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789'
  const alphabet = katakana.split('')
  let fontSize = 16
  let rainDrops: number[] = []

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    fontSize = width < 768 ? 14 : 16
    rainDrops = Array.from({ length: Math.ceil(width / fontSize) }, () => 1)
  }

  const draw = (timestamp: number) => {
    if (!isActive.value || animationId === null) return

    if (timestamp - lastFrameAt >= 34) {
      lastFrameAt = timestamp
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-color')
        .trim() || '#ff0000'

      context.fillStyle = 'rgba(0, 0, 0, 0.07)'
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)
      context.fillStyle = accentColor
      context.font = fontSize + 'px monospace'

      rainDrops.forEach((drop, index) => {
        const character = alphabet[Math.floor(Math.random() * alphabet.length)]
        context.fillText(character, index * fontSize, drop * fontSize)

        if (drop * fontSize > window.innerHeight && Math.random() > 0.975) {
          rainDrops[index] = 0
        }

        rainDrops[index] += 1
      })
    }

    animationId = requestAnimationFrame(draw)
  }

  resizeHandler = resize
  resize()
  lastFrameAt = 0
  animationId = requestAnimationFrame(draw)
  window.addEventListener('resize', resizeHandler)
}

const toggleMatrix = (event: Event) => {
  const detail = (event as CustomEvent).detail

  if (detail === 'start') {
    isActive.value = true
  } else if (detail === 'stop') {
    isActive.value = false
    stopMatrix()
    return
  } else {
    isActive.value = !isActive.value
  }

  if (isActive.value) {
    window.setTimeout(startMatrix, 50)
  } else {
    stopMatrix()
  }
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    stopMatrix()
  } else if (isActive.value) {
    startMatrix()
  }
}

onMounted(() => {
  window.addEventListener('terminal-matrix', toggleMatrix)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('terminal-matrix', toggleMatrix)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  stopMatrix()
})
</script>

<template>
  <transition name="fade">
    <canvas
      v-if="isActive"
      ref="canvasRef"
      class="fixed inset-0 z-40 h-full w-full bg-black/85"
      aria-hidden="true"
    ></canvas>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 260ms var(--ease-emphasized, ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
