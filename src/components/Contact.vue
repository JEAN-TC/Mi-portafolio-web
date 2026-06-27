<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const showSuccess = ref(false)

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.message) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSubmitting.value = false
  showSuccess.value = true
  Object.assign(form, { name: '', email: '', message: '' })
  setTimeout(() => showSuccess.value = false, 3000)
}
</script>

<template>
  <section id="contacto" class="py-24 bg-[#000000]">
    <div class="max-w-xl mx-auto px-6">

      <div class="text-center mb-12">
        <span class="section-label mx-auto justify-center">05. Hablemos</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Ponte en <span class="text-gradient">Contacto</span></h2>
        <p class="text-[#a1a1aa]">Conversemos sobre tu próximo proyecto.</p>
      </div>

      <div class="card-modern p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-white">Nombre</label>
            <input
              id="name" type="text" v-model="form.name" required
              class="w-full bg-[#18181b] border border-[#27272a] rounded-md px-4 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#a1a1aa] transition-colors"
              placeholder="Tu nombre"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-white">Email</label>
            <input
              id="email" type="email" v-model="form.email" required
              class="w-full bg-[#18181b] border border-[#27272a] rounded-md px-4 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#a1a1aa] transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div class="space-y-2">
            <label for="message" class="block text-sm font-medium text-white">Mensaje</label>
            <textarea
              id="message" v-model="form.message" rows="4" required
              class="w-full bg-[#18181b] border border-[#27272a] rounded-md px-4 py-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#a1a1aa] transition-colors resize-none"
              placeholder="¿En qué te puedo ayudar?"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary w-full"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
          </button>

          <p v-if="showSuccess" class="text-sm text-emerald-500 text-center mt-4">
            ¡Mensaje enviado con éxito!
          </p>
        </form>
      </div>

    </div>
  </section>
</template>
