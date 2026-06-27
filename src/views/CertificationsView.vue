<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ExternalLink, FileText, ArrowLeft } from '@lucide/vue'
import VuePdfEmbed from 'vue-pdf-embed'
import courseraLogo from '../assets/coursera-svgrepo-com.svg'
import fortinetLogo from '../assets/fortinet-svgrepo-com.svg'
import htbLogo from '../assets/hackthebox-svgrepo-com.svg'
import cwlLogo from '../assets/CWL.png'
import awsLogo from '../assets/aws-svgrepo-com (1).svg'
import ciscoLogo from '../assets/cisco-svgrepo-com (1).svg'

// Essential: configure the worker so pdfjs works
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const route = useRoute()
const categoryParam = route.params.category as string

// Decode the parameter (e.g. 'Coursera')
const currentCategory = computed(() => {
  if (categoryParam === 'coursera') return 'Coursera'
  if (categoryParam === 'fortinet') return 'Fortinet'
  if (categoryParam === 'aws') return 'AWS'
  if (categoryParam === 'hackthebox') return 'Hack The Box'
  if (categoryParam === 'cwl') return 'CWL'
  if (categoryParam === 'cisco') return 'Cisco'
  return 'Certificación'
})

const currentCategoryInfo = computed(() => {
  const categories = {
    'coursera': { isImg: true, src: courseraLogo },
    'fortinet': { isImg: true, src: fortinetLogo },
    'aws': { isImg: true, src: awsLogo },
    'hackthebox': { isImg: true, src: htbLogo },
    'cwl': { isImg: true, src: cwlLogo },
    'cisco': { isImg: true, src: ciscoLogo },
    'otros': { isImg: false, svg: '<svg viewBox="0 0 24 24" class="w-12 h-12 fill-current text-white"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>' }
  }
  return categories[categoryParam as keyof typeof categories] || categories['otros']
})

// Full list (copied from the main component, but normally this would be in a store or separate file)
const allCertifications = [
  { id: 1, title: '4092d3f6-dcf4-4bf7-8764-a9a5dde3acd4', issuer: 'AWS', date: '2023', credentialUrl: '/certifications/4092d3f6-dcf4-4bf7-8764-a9a5dde3acd4.pdf', fileName: '/certifications/4092d3f6-dcf4-4bf7-8764-a9a5dde3acd4.pdf' },
  { id: 2, title: '696aad726d896ee8347076de', issuer: 'CWL', date: '2023', credentialUrl: '/certifications/696aad726d896ee8347076de.pdf', fileName: '/certifications/696aad726d896ee8347076de.pdf' },
  { id: 3, title: '6990413c398414f740f4ff23', issuer: 'CWL', date: '2023', credentialUrl: '/certifications/6990413c398414f740f4ff23.pdf', fileName: '/certifications/6990413c398414f740f4ff23.pdf' },
  { id: 4, title: 'Certificado-JEAN-PIERO-TOSCANO-CARDENAS', issuer: 'Certificación', date: '2023', credentialUrl: '/certifications/Certificado-JEAN-PIERO-TOSCANO-CARDENAS-ozfh7nzr.pdf', fileName: '/certifications/Certificado-JEAN-PIERO-TOSCANO-CARDENAS-ozfh7nzr.pdf' },
  { id: 5, title: 'Coursera 14W5SAQIX9CN', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/14W5SAQIX9CN', fileName: '/certifications/Coursera%2014W5SAQIX9CN.pdf' },
  { id: 6, title: 'Coursera 1Z6A9CVLUSY8', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/1Z6A9CVLUSY8', fileName: '/certifications/Coursera%201Z6A9CVLUSY8.pdf' },
  { id: 7, title: 'Coursera 3YPK3547XPAB', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/3YPK3547XPAB', fileName: '/certifications/Coursera%203YPK3547XPAB.pdf' },
  { id: 8, title: 'Coursera 48ZDOHWQ4ULT', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/48ZDOHWQ4ULT', fileName: '/certifications/Coursera%2048ZDOHWQ4ULT.pdf' },
  { id: 9, title: 'Coursera CF3CBB6Y7ENT', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/CF3CBB6Y7ENT', fileName: '/certifications/Coursera%20CF3CBB6Y7ENT.pdf' },
  { id: 10, title: 'Coursera CVDXL1U46QN2', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/CVDXL1U46QN2', fileName: '/certifications/Coursera%20CVDXL1U46QN2.pdf' },
  { id: 11, title: 'Coursera DKV263QRJBPP', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/DKV263QRJBPP', fileName: '/certifications/Coursera%20DKV263QRJBPP.pdf' },
  { id: 12, title: 'Coursera G2SR2ZS0HX9T', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/G2SR2ZS0HX9T', fileName: '/certifications/Coursera%20G2SR2ZS0HX9T.pdf' },
  { id: 13, title: 'Coursera GIPDWIIG3FA5', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/GIPDWIIG3FA5', fileName: '/certifications/Coursera%20GIPDWIIG3FA5.pdf' },
  { id: 14, title: 'Coursera HSI5HBMEY6OJ', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/HSI5HBMEY6OJ', fileName: '/certifications/Coursera%20HSI5HBMEY6OJ.pdf' },
  { id: 15, title: 'Coursera IDQDESDOVCAG', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/IDQDESDOVCAG', fileName: '/certifications/Coursera%20IDQDESDOVCAG.pdf' },
  { id: 16, title: 'Coursera L8ITVQC6G8ET', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/L8ITVQC6G8ET', fileName: '/certifications/Coursera%20L8ITVQC6G8ET.pdf' },
  { id: 17, title: 'Coursera LJMT9ROM79ES', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/LJMT9ROM79ES', fileName: '/certifications/Coursera%20LJMT9ROM79ES.pdf' },
  { id: 18, title: 'Coursera LMKVOCSWGS9L', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/LMKVOCSWGS9L', fileName: '/certifications/Coursera%20LMKVOCSWGS9L.pdf' },
  { id: 19, title: 'Coursera MPRCF182PYSG', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/MPRCF182PYSG', fileName: '/certifications/Coursera%20MPRCF182PYSG.pdf' },
  { id: 20, title: 'Coursera N1XZM5Y7OKBW', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/N1XZM5Y7OKBW', fileName: '/certifications/Coursera%20N1XZM5Y7OKBW.pdf' },
  { id: 21, title: 'Coursera NALNCJOTO6JR', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/NALNCJOTO6JR', fileName: '/certifications/Coursera%20NALNCJOTO6JR.pdf' },
  { id: 22, title: 'Coursera NV4H20O25TMS', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/NV4H20O25TMS', fileName: '/certifications/Coursera%20NV4H20O25TMS.pdf' },
  { id: 23, title: 'Coursera OEGFFPZC6IOD', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/OEGFFPZC6IOD', fileName: '/certifications/Coursera%20OEGFFPZC6IOD.pdf' },
  { id: 24, title: 'Coursera OP5A1RRY82PM', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/OP5A1RRY82PM', fileName: '/certifications/Coursera%20OP5A1RRY82PM.pdf' },
  { id: 25, title: 'Coursera QWE2Z435A6CE', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/QWE2Z435A6CE', fileName: '/certifications/Coursera%20QWE2Z435A6CE.pdf' },
  { id: 26, title: 'Coursera R4HYAU194R23', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/R4HYAU194R23', fileName: '/certifications/Coursera%20R4HYAU194R23.pdf' },
  { id: 27, title: 'Coursera RUHJ878KPQ6V', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/RUHJ878KPQ6V', fileName: '/certifications/Coursera%20RUHJ878KPQ6V.pdf' },
  { id: 28, title: 'Coursera TB5L0REDPOCF', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/TB5L0REDPOCF', fileName: '/certifications/Coursera%20TB5L0REDPOCF.pdf' },
  { id: 29, title: 'Coursera UNQ3S7CDLQ6P', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/UNQ3S7CDLQ6P', fileName: '/certifications/Coursera%20UNQ3S7CDLQ6P.pdf' },
  { id: 30, title: 'Coursera VAS9NL7QS5TJ', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/VAS9NL7QS5TJ', fileName: '/certifications/Coursera%20VAS9NL7QS5TJ.pdf' },
  { id: 31, title: 'Coursera VGXA8FRI18O9', issuer: 'Coursera', date: '2023', credentialUrl: 'https://coursera.org/verify/VGXA8FRI18O9', fileName: '/certifications/Coursera%20VGXA8FRI18O9.pdf' },
  { id: 32, title: 'Fortinet Certified Associate in Cybersecurity', issuer: 'Fortinet', date: '2023', credentialUrl: '/certifications/Fortinet%20Certified%20Associate%20in%20Cybersecurity.pdf', fileName: '/certifications/Fortinet%20Certified%20Associate%20in%20Cybersecurity.pdf' },
  { id: 33, title: 'Fortinet Certified Fundamentals in Cybersecurity', issuer: 'Fortinet', date: '2023', credentialUrl: '/certifications/Fortinet%20Certified%20Fundamentals%20in%20Cybersecurity.pdf', fileName: '/certifications/Fortinet%20Certified%20Fundamentals%20in%20Cybersecurity.pdf' },
  { id: 34, title: 'Certificación P.O.O', issuer: 'Hack The Box', date: '2023', credentialUrl: '/certifications/P.O.O.pdf', fileName: '/certifications/P.O.O.pdf' },
  { id: 35, title: 'CCNA: Introduction to Networks', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/CCNA-_Introduction_to_Networks_certificate_.pdf', fileName: '/certifications/CCNA-_Introduction_to_Networks_certificate_.pdf' },
  { id: 36, title: 'CCNA: Switching, Routing, and Wireless Essentials', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate.pdf', fileName: '/certifications/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate.pdf' },
  { id: 37, title: 'CyberOps Associate', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/CyberOps_Associate_certificate.pdf', fileName: '/certifications/CyberOps_Associate_certificate.pdf' },
  { id: 38, title: 'Ethical Hacker', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/Ethical_Hacker_certificate.pdf', fileName: '/certifications/Ethical_Hacker_certificate.pdf' },
  { id: 39, title: 'Industrial Cybersecurity Essentials', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/Industrial_Cybersecurity_Essentials_certificate.pdf', fileName: '/certifications/Industrial_Cybersecurity_Essentials_certificate.pdf' },
  { id: 40, title: 'Cisco Networking Certificate', issuer: 'Cisco', date: '2023', credentialUrl: '/certifications/_certificate_.pdf', fileName: '/certifications/_certificate_.pdf' }
]

const filteredCerts = computed(() => {
  return allCertifications.filter(cert => cert.issuer === currentCategory.value)
})

const selectedCert = ref<any | null>(null)
</script>

<template>
  <main class="min-h-screen py-24 bg-[#030305] relative overflow-hidden">
    <!-- Glow -->
    <div class="bg-glow top-0 left-[-20%]"></div>
    
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      
      <!-- Back button -->
      <div class="mb-12">
        <router-link to="/#certificaciones" class="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors">
          <ArrowLeft class="w-4 h-4" />
          Volver al portafolio
        </router-link>
      </div>

      <!-- Header -->
      <div class="mb-12 border-b border-[#27272a] pb-6 flex items-center gap-6">
        <div 
          v-if="currentCategoryInfo" 
          class="w-20 h-20 bg-[#121215] border border-[#27272a] rounded-xl flex items-center justify-center shadow-inner p-2"
        >
          <img v-if="currentCategoryInfo.isImg" :src="currentCategoryInfo.src" class="w-full h-full object-contain opacity-90" />
          <div v-else v-html="currentCategoryInfo.svg" class="w-full h-full flex items-center justify-center opacity-90"></div>
        </div>
        
        <div>
          <span class="section-label mb-2 block">Certificados</span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
            Colección de <span class="text-gradient">{{ currentCategory }}</span>
          </h1>
          <p class="text-[#a1a1aa] text-lg">
            {{ filteredCerts.length }} credenciales obtenidas.
          </p>
        </div>
      </div>

      <!-- Grid of Certificates -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="cert in filteredCerts"
          :key="cert.id"
          class="card-modern flex flex-col group h-full overflow-hidden p-0"
        >
          <!-- PDF Thumbnail using Canvas -->
          <div v-if="cert.fileName" class="h-56 w-full relative bg-[#ffffff] border-b border-[#27272a] overflow-hidden flex items-center justify-center">
            <button @click="selectedCert = cert" class="absolute inset-0 z-10 w-full h-full cursor-pointer hover:bg-black/10 transition-colors focus:outline-none" title="Vista Previa"></button>
            <VuePdfEmbed
              :source="cert.fileName"
              :page="1"
              class="w-full h-full object-cover transform origin-top scale-100 opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
          
          <div class="px-5 py-4 flex justify-between items-center bg-[#121215]">
            <a
              v-if="cert.credentialUrl && cert.issuer === 'Coursera'"
              :href="cert.credentialUrl"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-[#a1a1aa] hover:text-[#ff0000] transition-colors"
              title="Verificar en línea"
            >
              Verificar ID
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
            
            <button
              v-if="cert.fileName"
              @click="selectedCert = cert"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-[#ff0000] hover:text-white transition-colors ml-auto focus:outline-none"
              title="Vista Previa"
            >
              Vista Previa
              <FileText class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal para Vista Previa del PDF -->
    <div 
      v-if="selectedCert" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm transition-all"
      @click.self="selectedCert = null"
    >
      <div class="relative w-full max-w-5xl h-[85vh] sm:h-[90vh] bg-[#121215] border border-[#27272a] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header del Modal -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-[#27272a] bg-[#09090b]">
          <h3 class="text-white font-bold text-sm sm:text-base flex items-center gap-2 truncate pr-4">
            <FileText class="w-5 h-5 text-[#ff0000] shrink-0" />
            <span class="truncate">{{ selectedCert.title }}</span>
          </h3>
          <button 
            @click="selectedCert = null" 
            class="text-[#a1a1aa] hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none shrink-0"
          >
            ✕ Cerrar
          </button>
        </div>
        
        <!-- Contenido del PDF -->
        <div class="flex-1 w-full h-full bg-[#1e1e1e] overflow-auto flex items-center justify-center p-4 sm:p-8">
          <VuePdfEmbed 
            :source="selectedCert.fileName" 
            :page="1"
            class="w-full max-w-4xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  </main>
</template>
