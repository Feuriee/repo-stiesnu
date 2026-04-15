<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm transition-all duration-300">
    <div class="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <router-link to="/" class="flex items-center space-x-2 sm:space-x-3 group min-w-0">
          <div class="bg-emerald-600/10 p-1.5 sm:p-2 rounded-lg group-hover:bg-emerald-600/20 transition-colors shrink-0">
            <img src="/logo.png" alt="Logo STIESNU" class="h-6 sm:h-7 w-auto object-contain shrink-0" />
          </div>
          <span class="font-bold text-emerald-700 text-sm sm:text-xl tracking-tight truncate">
            <span class="sm:hidden">Repositori</span>
            <span class="hidden sm:inline">Repositori STIESNU</span>
            <span class="hidden lg:inline"> Bengkulu</span>
          </span>
        </router-link>
        <nav class="hidden md:flex items-center gap-6 ml-6 text-sm font-medium shrink-0">
          <router-link to="/" class="transition-colors hover:text-gray-900/80 text-gray-600">Beranda</router-link>
          <router-link to="/repository" class="transition-colors hover:text-gray-900/80 text-gray-600">Koleksi</router-link>
        </nav>
      </div>

      <div class="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
        <ThemeToggle />
        
        <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            class="px-2 sm:px-3"
            @click="router.push('/dashboard')"
          >
            <PhLayout :size="16" class="sm:mr-2" />
            <span class="hidden sm:inline">Dashboard</span>
          </Button>
          
          <div class="hidden md:flex flex-col items-end text-xs">
            <span class="font-medium">{{ authStore.user.name }}</span>
            <span class="text-gray-500">{{ authStore.user.role }}</span>
          </div>
          
          <Button variant="ghost" size="icon" @click="logoutAlertOpen = true">
            <PhSignOut :size="16" class="text-red-500" />
          </Button>
        </div>
        
        <div v-else class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="router.push('/login')" class="dark:text-gray-300 dark:hover:bg-gray-800">
            Masuk
          </Button>
          <Button variant="default" size="sm" @click="router.push('/register')" class="hidden sm:inline-flex dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-700">
            Daftar
          </Button>
        </div>
      </div>
    </div>

  </header>

  <!-- Modal Konfirmasi Logout -->
  <div v-if="logoutAlertOpen" class="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm overflow-hidden animate-fade-in-up">
      <div class="p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Konfirmasi Keluar</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Apakah Anda yakin ingin keluar dari akun Anda?
        </p>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
        <Button variant="outline" @click="logoutAlertOpen = false" class="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Batal</Button>
        <Button class="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700" @click="handleLogoutConfirm">Ya, Keluar</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Button from '../ui/Button.vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { PhLayout, PhSignOut } from '@phosphor-icons/vue'

const router = useRouter()
const authStore = useAuthStore()

const logoutAlertOpen = ref(false)

const handleLogoutConfirm = async () => {
  logoutAlertOpen.value = false
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
