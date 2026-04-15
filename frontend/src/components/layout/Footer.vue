<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/60 py-8 md:py-12 mt-auto transition-colors duration-300">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex flex-col gap-2">
        <h3 class="font-bold text-lg text-emerald-700 dark:text-emerald-500">STIESNU Bengkulu</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 w-full md:max-w-xs text-balance">
          Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama Bengkulu.
          Mengabdi untuk ilmu dan agama.
        </p>
      </div>
      <div class="flex flex-col md:items-end gap-2 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} STIESNU Bengkulu Repository. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:underline hover:text-emerald-600 dark:hover:text-emerald-400">Tentang Kami</a>
          <a href="#" class="hover:underline hover:text-emerald-600 dark:hover:text-emerald-400">Kontak</a>
          <a href="#" class="hover:underline hover:text-emerald-600 dark:hover:text-emerald-400">Bantuan</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
