<script setup lang="ts">
import Terminal from '../components/Terminal.vue'
import { Terminal as TerminalIcon } from '@lucide/vue'
</script>

<template>
  <main class="w-full min-h-screen relative z-10 flex flex-col items-center justify-center px-6 py-24">
    <div class="w-full max-w-3xl">
      <!-- Header de la página -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center gap-2 text-xs font-mono text-[#1db954] uppercase tracking-widest mb-4">
          <TerminalIcon class="w-3.5 h-3.5" />
          <span>jean@jean_xp:~$</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Terminal</h1>
        <p class="text-sm text-zinc-500">Escribe <code class="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">help</code> para ver los comandos disponibles.</p>
      </div>

      <Terminal />
    </div>
  </main>
</template>
