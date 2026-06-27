<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Terminal as TerminalIcon } from '@lucide/vue'

const inputCommand = ref('')
const terminalOutput = ref<{ text: string; isCommand: boolean; isError?: boolean }[]>([
  { text: 'Iniciando conexión segura...', isCommand: false },
  { text: 'Estableciendo túnel encriptado [OK]', isCommand: false },
  { text: 'Autenticación exitosa. Bienvenido, Pwnd_User.', isCommand: false },
  { text: 'Escribe "help" para ver los comandos disponibles.', isCommand: false }
])

const terminalBody = ref<HTMLElement | null>(null)

const processCommand = () => {
  const cmd = inputCommand.value.trim().toLowerCase()
  if (!cmd) return

  // Add user command to output
  terminalOutput.value.push({ text: `root@jean_xp:~# ${inputCommand.value}`, isCommand: true })

  // Process specific commands
  switch (cmd) {
    case 'help':
      terminalOutput.value.push(
        { text: 'Comandos disponibles:', isCommand: false },
        { text: '  whoami  - Muestra información del sistema', isCommand: false },
        { text: '  skills  - Lista los vectores de ataque conocidos', isCommand: false },
        { text: '  clear   - Limpia la terminal', isCommand: false },
        { text: '  sudo    - Intenta escalar privilegios', isCommand: false }
      )
      break
    case 'whoami':
      terminalOutput.value.push({ text: 'Jean_xp - Auditor Web & Desarrollador Full-Stack SecDevOps', isCommand: false })
      break
    case 'skills':
      terminalOutput.value.push({ text: '[*] Cargando módulos...', isCommand: false })
      terminalOutput.value.push({ text: '-> Pentesting Web (Burp Suite, Nmap, Metasploit)', isCommand: false })
      terminalOutput.value.push({ text: '-> Desarrollo Seguro (Vue 3, Node.js, SQL)', isCommand: false })
      break
    case 'clear':
      terminalOutput.value = []
      break
    case 'sudo':
      terminalOutput.value.push({ text: 'Permiso denegado. Este incidente será reportado.', isError: true })
      break
    default:
      terminalOutput.value.push({ text: `bash: ${cmd}: orden no encontrada`, isError: true })
  }

  inputCommand.value = ''
  
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto mt-12 bg-[#09090b] rounded-lg border border-[#27272a] shadow-[0_0_20px_rgba(255,0,0,0.15)] overflow-hidden font-mono text-sm relative z-10 group transition-all duration-500 hover:border-[#ff0000]/50 hover:shadow-[0_0_30px_rgba(255,0,0,0.25)]">
    <!-- Terminal Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-[#27272a]">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#ff5500]"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div class="flex items-center gap-2 text-[#a1a1aa] text-xs">
        <TerminalIcon class="w-3 h-3" />
        <span>root@jean_xp: ~</span>
      </div>
      <div></div> <!-- Placeholder for flex balance -->
    </div>

    <!-- Terminal Body -->
    <div 
      ref="terminalBody"
      class="p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#27272a] scrollbar-track-transparent text-left"
    >
      <div v-for="(line, idx) in terminalOutput" :key="idx" class="mb-1">
        <span v-if="line.isCommand" class="text-white">{{ line.text }}</span>
        <span v-else-if="line.isError" class="text-[#ff0000]">{{ line.text }}</span>
        <span v-else class="text-[#a1a1aa]">{{ line.text }}</span>
      </div>

      <div class="flex items-center mt-2">
        <span class="text-[#ff0000] mr-2">root@jean_xp:~#</span>
        <form @submit.prevent="processCommand" class="flex-1">
          <input 
            type="text" 
            v-model="inputCommand" 
            class="w-full bg-transparent border-none outline-none text-white focus:ring-0 p-0"
            autocomplete="off"
            spellcheck="false"
            autofocus
          />
        </form>
      </div>
    </div>
  </div>
</template>
