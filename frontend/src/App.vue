<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased flex flex-col transition-colors duration-300">
    <Toaster />
    <Navbar />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTheme } from './composables/useTheme'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Toaster from './components/ui/Toaster.vue'

const authStore = useAuthStore()
const { initializeTheme } = useTheme()

onMounted(() => {
  initializeTheme()
  // Check session on initial load to restore auth state if HTTP cookie is valid
  authStore.checkSession()
})
</script>
