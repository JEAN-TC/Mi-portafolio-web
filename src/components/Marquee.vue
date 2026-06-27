<script setup lang="ts">
const marqueeItems = [
  'Burp Suite', 'Nmap', 'Metasploit', 'Wireshark', 'Kali Linux', 
  'AWS', 'Docker', 'Git', 'Python', 'Bash', 'Postman', 'Figma'
]
</script>

<template>
  <div class="w-full overflow-hidden bg-[#ff0000]/5 py-4 border-y border-[#ff0000]/10 flex relative z-10">
    <div class="flex animate-marquee whitespace-nowrap">
      <div v-for="(item, idx) in marqueeItems" :key="idx" class="mx-4 flex items-center justify-center px-6 py-2 border border-[#27272a] bg-[#121215] rounded-xl text-[#a1a1aa] font-mono text-sm tracking-widest uppercase hover:text-[#ff0000] hover:border-[#ff0000]/50 transition-colors shadow-inner">
        {{ item }}
      </div>
    </div>
    <div class="flex animate-marquee whitespace-nowrap" aria-hidden="true">
      <div v-for="(item, idx) in marqueeItems" :key="idx + 'dup'" class="mx-4 flex items-center justify-center px-6 py-2 border border-[#27272a] bg-[#121215] rounded-xl text-[#a1a1aa] font-mono text-sm tracking-widest uppercase hover:text-[#ff0000] hover:border-[#ff0000]/50 transition-colors shadow-inner">
        {{ item }}
      </div>
    </div>
  </div>
</template>
