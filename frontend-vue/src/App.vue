<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
    <Toaster />
    <Navbar />
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import Toaster from './components/ui/Toaster.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Check session on initial load to restore auth state if HTTP cookie is valid
  authStore.checkSession()
})
</script>
