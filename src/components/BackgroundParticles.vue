<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

let particles: Particle[] = []
let animationFrameId: number | null = null
let lastFrameAt = 0
let isRunning = false
let motionQuery: MediaQueryList | null = null

const initParticles = (width: number, height: number) => {
  const density = window.innerWidth < 768 ? 42000 : 32000
  const count = Math.floor((width * height) / density)

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    size: Math.random() + 0.55
  }))
}

const resizeCanvas = () => {
  const element = canvas.value
  if (!element) return

  const width = window.innerWidth
  const height = window.innerHeight
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  const context = element.getContext('2d')

  element.width = Math.floor(width * pixelRatio)
  element.height = Math.floor(height * pixelRatio)
  element.style.width = width + 'px'
  element.style.height = height + 'px'
  context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  initParticles(width, height)
}

const draw = (timestamp: number) => {
  if (!isRunning || !canvas.value) return

  if (timestamp - lastFrameAt < 34) {
    animationFrameId = requestAnimationFrame(draw)
    return
  }

  lastFrameAt = timestamp
  const context = canvas.value.getContext('2d')
  if (!context) return

  const width = window.innerWidth
  const height = window.innerHeight

  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255, 48, 48, 0.28)'

  particles.forEach((particle) => {
    particle.x += particle.vx
    particle.y += particle.vy

    if (particle.x < 0 || particle.x > width) particle.vx *= -1
    if (particle.y < 0 || particle.y > height) particle.vy *= -1

    context.beginPath()
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    context.fill()
  })

  context.lineWidth = 0.5
  for (let index = 0; index < particles.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const dx = particles[index].x - particles[nextIndex].x
      const dy = particles[index].y - particles[nextIndex].y
      const distance = Math.hypot(dx, dy)

      if (distance < 90) {
        context.strokeStyle = 'rgba(255, 48, 48, ' + (0.08 - distance / 90 * 0.08) + ')'
        context.beginPath()
        context.moveTo(particles[index].x, particles[index].y)
        context.lineTo(particles[nextIndex].x, particles[nextIndex].y)
        context.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(draw)
}

const stopAnimation = () => {
  isRunning = false

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const startAnimation = () => {
  if (
    isRunning ||
    document.hidden ||
    motionQuery?.matches ||
    !canvas.value
  ) return

  isRunning = true
  lastFrameAt = 0
  animationFrameId = requestAnimationFrame(draw)
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    stopAnimation()
    return
  }

  startAnimation()
}

const handleMotionChange = () => {
  if (motionQuery?.matches) {
    stopAnimation()
    return
  }

  resizeCanvas()
  startAnimation()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  resizeCanvas()

  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  motionQuery.addEventListener('change', handleMotionChange)

  startAnimation()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  motionQuery?.removeEventListener('change', handleMotionChange)
  stopAnimation()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 z-0 h-full w-full pointer-events-none"
    aria-hidden="true"
  ></canvas>
</template>
