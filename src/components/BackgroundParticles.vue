<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

let particles: Particle[] = []
let animationFrameId: number

const initParticles = (width: number, height: number) => {
  particles = []
  const count = Math.floor((width * height) / 15000) // Densidad de partículas
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5
    })
  }
}

const draw = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  
  ctx.clearRect(0, 0, width, height)
  
  // Update & Draw particles
  ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  })
  
  // Draw connections
  ctx.lineWidth = 0.5
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 100) {
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.15 - dist / 100 * 0.15})`
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
  
  animationFrameId = requestAnimationFrame(draw)
}

const resizeCanvas = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    initParticles(canvas.value.width, canvas.value.height)
  }
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <canvas 
    ref="canvas" 
    class="fixed inset-0 w-full h-full pointer-events-none z-0"
  ></canvas>
</template>
