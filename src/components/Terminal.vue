<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Terminal as TerminalIcon } from '@lucide/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const inputCommand = ref('')
const terminalOutput = ref<{ text: string; isCommand: boolean; isError?: boolean; isWarning?: boolean; isSuccess?: boolean }[]>([
  { text: 'Iniciando conexión segura...', isCommand: false },
  { text: 'Estableciendo túnel encriptado [OK]', isCommand: false },
  { text: 'Autenticación exitosa. Bienvenido, jean.', isCommand: false },
  { text: 'Escribe "help" para ver los comandos disponibles.', isCommand: false }
])

const terminalBody = ref<HTMLElement | null>(null)

// Estados de la terminal interactiva
const isRoot = ref(false)
const isPromptingPassword = ref(false)
const virtualFiles = ref<Record<string, string>>({
  'password': 'adminJT',
  'notas.txt': 'Objetivo: Mejorar la seguridad de la infraestructura y automatizar tareas.',
  'ciberseguridad.md': '# PENTESTING CHECKLIST\n1. Reconocimiento pasivo\n2. Escaneo de puertos\n3. Explotación\n4. Post-explotación'
})

// Historial para auto-scroll
const scrollToBottom = () => {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

// Procesar comando del usuario
const processCommand = () => {
  const fullInput = inputCommand.value
  const trimmed = fullInput.trim()
  inputCommand.value = ''

  if (!trimmed) return

  // Si estamos esperando contraseña
  if (isPromptingPassword.value) {
    // Agregamos asteriscos al output para simular contraseña oculta
    terminalOutput.value.push({ text: '••••••••', isCommand: true })
    
    if (trimmed === 'adminJT') {
      isRoot.value = true
      terminalOutput.value.push({ text: 'Autenticación exitosa. Ahora tienes privilegios de root.', isCommand: false, isSuccess: true })
      terminalOutput.value.push({ text: 'Escribe "help" para ver los comandos de control disponibles.', isCommand: false, isSuccess: true })
    } else {
      terminalOutput.value.push({ text: 'su: Contraseña incorrecta. Intento fallido.', isCommand: false, isError: true })
    }
    isPromptingPassword.value = false
    scrollToBottom()
    return
  }

  // Agrega el comando al output
  const currentPrompt = isRoot.value ? 'root@jean_xp:#' : 'jean@jean_xp:~$'
  terminalOutput.value.push({ text: `${currentPrompt} ${fullInput}`, isCommand: true })

  // Parseo de argumentos básicos
  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const arg1 = parts[1] ? parts[1].toLowerCase() : ''


  // Manejo de comandos
  switch (cmd) {
    case 'help':
      if (isRoot.value) {
        terminalOutput.value.push(
          { text: 'Comandos de Superusuario (root) disponibles:', isCommand: false },
          { text: '  goto <destino> - Navega por la web (inicio, perfil, habilidades, certificaciones, proyectos, contacto, apuntes, terminal)', isCommand: false },
          { text: '  theme <color>  - Cambia los acentos (red, blue, green, purple, cyber)', isCommand: false },
          { text: '  matrix         - Inicia o detiene la lluvia de código Matrix', isCommand: false },
          { text: '  music <play/pause/skip> - Controla el reproductor de música', isCommand: false },
          { text: '  hack           - Ejecuta un simulacro de intrusión', isCommand: false },
          { text: '  ls             - Muestra archivos virtuales', isCommand: false },
          { text: '  cat <archivo>  - Muestra contenido de un archivo', isCommand: false },
          { text: '  exit           - Sale del modo root', isCommand: false },
          { text: '  clear          - Limpia la pantalla', isCommand: false }
        )
      } else {
        terminalOutput.value.push(
          { text: 'Comandos disponibles:', isCommand: false },
          { text: '  whoami  - Muestra información sobre el usuario actual', isCommand: false },
          { text: '  ls      - Muestra el contenido del directorio actual', isCommand: false },
          { text: '  cat     - Muestra el contenido de un archivo (Ej: cat password)', isCommand: false },
          { text: '  skills  - Lista los vectores de ataque conocidos', isCommand: false },
          { text: '  sudo su - Cambiar a superusuario (root) con contraseña', isCommand: false },
          { text: '  clear   - Limpia la pantalla', isCommand: false }
        )
      }
      break

    case 'whoami':
      if (isRoot.value) {
        terminalOutput.value.push({ text: 'root - Superusuario con control total sobre la web.', isCommand: false, isWarning: true })
      } else {
        terminalOutput.value.push({ text: 'jean - Auditor Web & Desarrollador Full-Stack SecDevOps', isCommand: false })
      }
      break

    case 'ls':
      const fileList = Object.keys(virtualFiles.value).join('   ')
      terminalOutput.value.push({ text: fileList, isCommand: false, isSuccess: true })
      break

    case 'cat':
      if (!arg1) {
        terminalOutput.value.push({ text: 'cat: Falta especificar el nombre del archivo.', isCommand: false, isError: true })
      } else if (virtualFiles.value[arg1] !== undefined) {
        terminalOutput.value.push({ text: virtualFiles.value[arg1], isCommand: false })
      } else {
        terminalOutput.value.push({ text: `cat: ${arg1}: No existe el archivo o directorio`, isCommand: false, isError: true })
      }
      break

    case 'skills':
      terminalOutput.value.push({ text: '[*] Cargando módulos de seguridad...', isCommand: false })
      terminalOutput.value.push({ text: '-> Pentesting Web (Burp Suite, Nmap, Metasploit)', isCommand: false })
      terminalOutput.value.push({ text: '-> Desarrollo Seguro (Vue 3, Node.js, SQL)', isCommand: false })
      break

    case 'clear':
      terminalOutput.value = []
      break

    case 'sudo':
    case 'su':
      if (trimmed === 'sudo su' || trimmed === 'su' || trimmed === 'su root') {
        isPromptingPassword.value = true
        terminalOutput.value.push({ text: 'Contraseña para jean: ', isCommand: false, isWarning: true })
      } else {
        terminalOutput.value.push({ text: 'Comando no reconocido. Para ser root escribe "sudo su".', isCommand: false, isError: true })
      }
      break

    case 'exit':
      if (isRoot.value) {
        isRoot.value = false
        terminalOutput.value.push({ text: 'Sesión root cerrada. Volviendo a jean.', isCommand: false, isWarning: true })
      } else {
        terminalOutput.value.push({ text: 'Ya estás en la sesión del usuario jean.', isCommand: false })
      }
      break

    // ── COMANDOS DE SUPERUSUARIO ──
    case 'theme':
      if (!isRoot.value) {
        terminalOutput.value.push({ text: 'su: Permiso denegado. Se requiere ser root para usar "theme".', isCommand: false, isError: true })
        break
      }
      const themeColors: Record<string, [string, string]> = {
        red:    ['#ff0000', '#ff3333'],
        blue:   ['#3b82f6', '#60a5fa'],
        green:  ['#10b981', '#34d399'],
        purple: ['#8b5cf6', '#a78bfa'],
        cyber:  ['#06b6d4', '#22d3ee']
      }
      if (themeColors[arg1]) {
        document.documentElement.style.setProperty('--accent-color', themeColors[arg1][0])
        document.documentElement.style.setProperty('--accent-alt', themeColors[arg1][1])
        terminalOutput.value.push({ text: `[+] Acentos de la página actualizados a [${arg1.toUpperCase()}]`, isCommand: false, isSuccess: true })
      } else {
        terminalOutput.value.push({ text: 'Error: Tema desconocido. Usa: red, blue, green, purple, cyber', isCommand: false, isError: true })
      }
      break

    case 'matrix':
      if (!isRoot.value) {
        terminalOutput.value.push({ text: 'su: Permiso denegado. Se requiere ser root para usar "matrix".', isCommand: false, isError: true })
        break
      }
      if (arg1 === 'start') {
        window.dispatchEvent(new CustomEvent('terminal-matrix', { detail: 'start' }))
        terminalOutput.value.push({ text: '[+] Iniciando lluvia de código Matrix...', isCommand: false, isSuccess: true })
      } else if (arg1 === 'stop') {
        window.dispatchEvent(new CustomEvent('terminal-matrix', { detail: 'stop' }))
        terminalOutput.value.push({ text: '[-] Deteniendo lluvia de código Matrix.', isCommand: false, isWarning: true })
      } else {
        window.dispatchEvent(new CustomEvent('terminal-matrix'))
        terminalOutput.value.push({ text: '[*] Conmutando protector de pantalla Matrix...', isCommand: false, isSuccess: true })
      }
      break

    case 'music':
      if (!isRoot.value) {
        terminalOutput.value.push({ text: 'su: Permiso denegado. Se requiere ser root para usar "music".', isCommand: false, isError: true })
        break
      }
      if (arg1 === 'play' || arg1 === 'pause' || arg1 === 'skip') {
        // Enviar evento al reproductor de música global
        window.dispatchEvent(new CustomEvent('terminal-music', { detail: arg1 }))
        terminalOutput.value.push({ text: `[+] Enviada señal: Music player [${arg1.toUpperCase()}]`, isCommand: false, isSuccess: true })
      } else {
        terminalOutput.value.push({ text: 'Uso correcto: music play | music pause | music skip', isCommand: false, isError: true })
      }
      break

    case 'hack':
      if (!isRoot.value) {
        terminalOutput.value.push({ text: 'su: Permiso denegado. Se requiere ser root para usar "hack".', isCommand: false, isError: true })
        break
      }
      terminalOutput.value.push(
        { text: '[i] Iniciando protocolo de intrusión simulado...', isCommand: false, isWarning: true },
        { text: '  - Buscando vulnerabilidades... [OK]', isCommand: false },
        { text: '  - Explotando buffer overflow en puerto local... [OK]', isCommand: false },
        { text: '  - Escalando privilegios locales... [COMPLETADO]', isCommand: false },
        { text: '  ==============================================', isCommand: false, isSuccess: true },
        { text: '  ||            ACCESO CONCEDIDO              ||', isCommand: false, isSuccess: true },
        { text: '  ==============================================', isCommand: false, isSuccess: true }
      )
      break

    case 'cd':
    case 'goto':
      if (!isRoot.value) {
        terminalOutput.value.push({ text: `su: Permiso denegado. Se requiere ser root para usar "${cmd}".`, isCommand: false, isError: true })
        break
      }
      const target = arg1
      if (!target) {
        terminalOutput.value.push({ text: `Error: Debes especificar un destino. Ej: ${cmd} perfil`, isCommand: false, isError: true })
        break
      }
      const routesMap: Record<string, string> = {
        'inicio': '/#inicio',
        'perfil': '/#sobre-mi',
        'sobre-mi': '/#sobre-mi',
        'habilidades': '/#habilidades',
        'certificaciones': '/#certificaciones',
        'proyectos': '/#proyectos',
        'contacto': '/#contacto',
        'apuntes': '/apuntes',
        'terminal': '/terminal'
      }
      if (routesMap[target]) {
        terminalOutput.value.push({ text: `[+] Redirigiendo a [${target}]...`, isCommand: false, isSuccess: true })
        router.push(routesMap[target])
      } else {
        terminalOutput.value.push({ text: `Error: Destino [${target}] no reconocido.`, isCommand: false, isError: true })
        terminalOutput.value.push({ text: 'Destinos válidos: inicio, perfil, habilidades, certificaciones, proyectos, contacto, apuntes, terminal', isCommand: false })
      }
      break

    default:
      terminalOutput.value.push({ text: `bash: ${cmd}: orden no encontrada`, isCommand: false, isError: true })
  }

  scrollToBottom()
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto mt-12 bg-[#09090b] rounded-lg border border-[#27272a] shadow-[0_0_20px_rgba(255,0,0,0.15)] overflow-hidden font-mono text-sm relative z-10 group transition-all duration-500 hover:border-[#ff0000]/50 hover:shadow-[0_0_30px_rgba(255,0,0,0.25)]">
    <!-- Terminal Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-[#27272a]">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#ff3b30] cursor-pointer" @click="terminalOutput = []"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div class="flex items-center gap-2 text-[#a1a1aa] text-xs">
        <TerminalIcon class="w-3 h-3" />
        <span class="text-xs">{{ isRoot ? 'root@jean_xp: ~' : 'jean@jean_xp: ~' }}</span>
      </div>
      <div></div>
    </div>

    <!-- Terminal Body -->
    <div 
      ref="terminalBody"
      class="p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#27272a] scrollbar-track-transparent text-left"
    >
      <div v-for="(line, idx) in terminalOutput" :key="idx" class="mb-1">
        <span v-if="line.isCommand" :class="isRoot ? 'text-[#ff3b30]' : 'text-white'">{{ line.text }}</span>
        <span v-else-if="line.isError" class="text-[#ff3b30] font-semibold">{{ line.text }}</span>
        <span v-else-if="line.isWarning" class="text-amber-500">{{ line.text }}</span>
        <span v-else-if="line.isSuccess" class="text-[#1db954]">{{ line.text }}</span>
        <span v-else class="text-[#a1a1aa]">{{ line.text }}</span>
      </div>

      <div class="flex items-center mt-2">
        <!-- Prompt dinámico basado en privilegios o contraseña -->
        <span v-if="isPromptingPassword" class="text-amber-500 mr-2">Contraseña:</span>
        <span v-else-if="isRoot" class="text-[#ff3b30] mr-2">root@jean_xp:#</span>
        <span v-else class="text-[#1db954] mr-2">jean@jean_xp:~$</span>
        
        <form @submit.prevent="processCommand" class="flex-1">
          <input 
            :type="isPromptingPassword ? 'password' : 'text'"
            v-model="inputCommand" 
            class="w-full bg-transparent border-none outline-none text-white focus:ring-0 p-0 font-mono"
            autocomplete="off"
            spellcheck="false"
            autofocus
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus {
  box-shadow: none !important;
}
</style>
