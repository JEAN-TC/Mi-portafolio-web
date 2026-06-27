<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ArrowLeft, BookOpen, Clock, ArrowRight } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const noteId = route.params.id as string

const markdownContent = ref('')
const isLoading = ref(true)
const error = ref(false)

// Simular metadatos basados en el ID. En producción esto vendría del frontmatter o un JSON.
const apunteInfo = computed(() => {
  if (noteId === 'P.O.O') {
    return {
      title: 'Laboratorio: Professional Offensive Operations (P.O.O.)',
      date: 'Abril 2026',
      readTime: '15 min read',
      certificateLink: '/certificados/hackthebox'
    }
  }
  return {
    title: noteId.replace(/-/g, ' ').toUpperCase(),
    date: 'Reciente',
    readTime: 'Lectura rápida'
  }
})

onMounted(async () => {
  try {
    // Descargar el archivo Markdown desde la carpeta public/apuntes/
    const response = await fetch(`/apuntes/${noteId}.md`)
    
    if (!response.ok) {
      throw new Error('Nota no encontrada')
    }
    
    const text = await response.text()
    
    // Pre-procesar texto para soportar el formato de imágenes de Obsidian: ![[imagen.png]] o ![[imagen.png|600]]
    const processedText = text.replace(/!\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, (match, filename) => {
      // Los archivos con espacios (como "Captura de pantalla") rompen el parser de Markdown si no se codifican
      const safeUrl = encodeURI(filename.trim())
      return `![imagen_obsidian](/apuntes/${safeUrl})`
    })
    
    // Convertir Markdown a HTML
    const rawHtml = await marked.parse(processedText)
    
    // Sanitizar HTML para evitar ataques XSS
    markdownContent.value = DOMPurify.sanitize(rawHtml)
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    isLoading.value = false
  }
})

const goBack = () => {
  router.push('/apuntes')
}
</script>

<template>
  <div class="min-h-screen bg-[#000000] py-12 md:py-24">
    <div class="max-w-4xl mx-auto px-6">
      
      <!-- Back Button -->
      <button 
        @click="goBack" 
        class="group inline-flex items-center gap-2 text-[#a1a1aa] hover:text-white mb-12 transition-colors font-medium text-sm focus:outline-none"
      >
        <div class="p-2 rounded-lg bg-[#121215] border border-[#27272a] group-hover:border-[#ff0000]/50 transition-colors">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </div>
        Volver a los Apuntes
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-[#27272a] border-t-[#ff0000] rounded-full animate-spin mb-4"></div>
        <p class="text-[#a1a1aa]">Cargando apunte desde Obsidian...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-[#121215] border border-red-500/20 rounded-xl p-8 text-center">
        <h2 class="text-xl font-bold text-white mb-2">Apunte no encontrado</h2>
        <p class="text-[#a1a1aa] mb-6">El archivo <code>{{ noteId }}.md</code> no existe en la carpeta public/apuntes/.</p>
        <button @click="goBack" class="btn-primary inline-flex items-center gap-2">
          Volver
        </button>
      </div>

      <!-- Content -->
      <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Header del Artículo -->
        <header class="mb-12 pb-8 border-b border-[#27272a]">
          <div class="flex items-center gap-4 text-xs font-bold text-[#ff0000] uppercase tracking-widest mb-4">
            <span class="flex items-center gap-1.5 px-3 py-1 bg-[#ff0000]/10 rounded-full border border-[#ff0000]/20">
              <BookOpen class="w-3.5 h-3.5" /> Obsidian Vault
            </span>
            <span class="flex items-center gap-1.5 text-[#a1a1aa]">
              <Clock class="w-3.5 h-3.5" /> {{ apunteInfo.readTime }}
            </span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {{ apunteInfo.title }}
          </h1>
          <p class="text-[#71717a] font-medium mb-6">{{ apunteInfo.date }}</p>
          
          <div v-if="apunteInfo.certificateLink" class="mt-4">
            <router-link 
              :to="apunteInfo.certificateLink"
              class="inline-flex items-center gap-2 px-4 py-2 bg-[#ff0000]/10 text-[#ff0000] border border-[#ff0000]/20 hover:bg-[#ff0000]/20 rounded-lg text-sm font-bold transition-colors"
            >
              🏆 Ver Certificado Obtenido
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </header>

        <!-- Markdown Renderizado (Prose) -->
        <div 
          class="prose prose-invert max-w-none prose-headings:text-white prose-a:text-[#ff0000] hover:prose-a:text-white prose-a:transition-colors prose-strong:text-white prose-code:text-[#9FEF00] prose-code:bg-[#121215] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#121215] prose-pre:border prose-pre:border-[#27272a] prose-blockquote:border-l-[#ff0000] prose-blockquote:bg-[#121215] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-[#a1a1aa]"
          v-html="markdownContent"
        ></div>
      </article>

    </div>
  </div>
</template>

<style>
/* Estilos adicionales globales para el Markdown renderizado si prose-invert no es suficiente */
.prose {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #a1a1aa;
}
.prose h1, .prose h2, .prose h3 {
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.prose h2 {
  font-size: 1.875rem;
  border-bottom: 1px solid #27272a;
  padding-bottom: 0.5rem;
}
.prose ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 1em;
  margin-bottom: 1em;
}
.prose li::marker {
  color: #ff0000;
}
</style>
