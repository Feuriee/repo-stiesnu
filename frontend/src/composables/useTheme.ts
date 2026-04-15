import { ref, watchEffect } from 'vue'

const isDark = ref(false)

// Inisialisasi tema dari localStorage atau sistem operasi
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Cek preferensi OS jika belum ada settingan
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

// Side effect untuk mengubah class html dan menyimpan ke localStorage setiap kali state isDark berubah
watchEffect(() => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement
    if (isDark.value) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

export function useTheme() {
  return {
    isDark,
    toggleTheme,
    initializeTheme
  }
}
