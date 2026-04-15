<template>
  <button 
    @click="toggleTheme" 
    class="flex relative items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
    aria-label="Toggle Dark Mode"
  >
    <PhSun v-if="isDark" :size="20" weight="bold" class="text-amber-400 animate-fade-in" />
    <PhMoon v-else :size="20" weight="bold" class="text-indigo-500 animate-fade-in" />
    <span class="sr-only">Toggle Dark Mode</span>
  </button>
</template>

<script setup lang="ts">
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9) rotate(-15deg); }
  to { opacity: 1; transform: scale(1) rotate(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
