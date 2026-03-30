<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Section with Glassmorphism & Gradient -->
    <section class="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-700/90 via-emerald-700 to-emerald-700/80">
      <!-- Abstract Background Shapes -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pattern-dots"></div>
      </div>

      <div class="container px-4 md:px-6 mx-auto relative z-10">
        <div class="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto animate-fade-in-up">
          <div class="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-md">
            <span class="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            Portal Resmi STIESNU Bengkulu
          </div>
          
          <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md">
            Jelajahi <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Karya Ilmiah</span> & Masa Depan
          </h1>
          
          <p class="max-w-[700px] text-white/90 md:text-xl font-light leading-relaxed">
            Akses ribuan manuskrip, jurnal, skripsi, dan riset akademik dari civitas akademika Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama Bengkulu.
          </p>
          
          <div class="w-full max-w-2xl mt-8">
            <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <div class="relative flex-1">
                <PhMagnifyingGlass class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  v-model="searchQuery"
                  class="w-full bg-white/10 border-none text-white placeholder:text-white/60 pl-12 h-14 rounded-xl focus:ring-1 focus:ring-white/30 text-lg outline-none"
                  placeholder="Cari judul penelitian, abstrak, atau penulis..."
                />
              </div>
              <Button type="submit" size="lg" class="h-14 px-8 rounded-xl bg-white text-emerald-700 hover:bg-white/90 font-bold shadow-lg transition-all hover:scale-105">
                Eksplorasi
              </Button>
            </form>
            
            <div class="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-white/80">
              <span class="font-medium">Populer:</span>
              <router-link 
                v-for="tag in ['Ekonomi Syariah', 'Perbankan', 'Zakat', 'Fintech']" 
                :key="tag"
                :to="`/repository?search=${tag.toLowerCase()}`"
                class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-sm"
              >
                {{ tag }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section with Hover Effects -->
    <section class="w-full py-16 bg-gray-50/30 relative z-20 -mt-8">
      <div class="container px-4 md:px-6 mx-auto">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(stat, i) in displayStats" :key="i" class="h-full transform transition-all hover:-translate-y-1">
            <Card class="border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-all h-full">
              <CardContent class="p-6 flex items-center gap-4">
                <div :class="`p-4 rounded-2xl ${stat.bg}`">
                  <component :is="stat.icon" :class="`h-8 w-8 ${stat.color}`" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
                  <h3 class="text-3xl font-bold tracking-tight mt-1">{{ stat.value }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ stat.desc }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Collections Section -->
    <section class="w-full py-20 bg-white relative">
      <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none"></div>
      
      <div class="container px-4 md:px-6 mx-auto relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
              <PhTrendUp weight="bold" class="mr-2 h-4 w-4 text-emerald-600" />
              Koleksi Pilihan
            </div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Temukan Berdasarkan Kategori</h2>
            <p class="text-gray-500 max-w-2xl text-lg">
              Eksplorasi literatur berdasarkan tipe publikasi. Temukan referensi terbaik untuk riset Anda berikutnya.
            </p>
          </div>
          <Button variant="outline" class="group rounded-xl" @click="router.push('/repository')">
            Lihat Semua Koleksi 
            <PhCaretRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <router-link 
            v-for="(cat, i) in categories" 
            :key="i"
            :to="cat.href" 
            class="block h-full group transform transition-all hover:scale-102 active:scale-95"
          >
            <Card class="h-full hover:shadow-lg transition-all border-gray-200/50 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative rounded-2xl">
              <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PhBookOpen class="h-24 w-24 -mr-8 -mt-8 rotate-12 text-gray-900" />
              </div>
              <CardHeader class="relative z-10">
                <CardTitle class="text-xl group-hover:text-emerald-600 transition-colors">{{ cat.title }}</CardTitle>
                <CardDescription class="text-base mt-2 flex items-center text-gray-600">
                  <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-medium mr-2">
                    {{ cat.count }}
                  </span>
                  dokumen tersedia
                </CardDescription>
              </CardHeader>
            </Card>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PhBookOpen, PhMagnifyingGlass, PhUsers, PhFileText, PhTrendUp, PhCaretRight } from '@phosphor-icons/vue'
import api from '../api/axios'

import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import CardTitle from '../components/ui/CardTitle.vue'
import CardDescription from '../components/ui/CardDescription.vue'
import CardContent from '../components/ui/CardContent.vue'

const router = useRouter()
const searchQuery = ref('')

const stats = ref({
  totalPublications: 0,
  totalAuthors: 0,
  publicationsByType: [] as { name: string; value: number }[]
})

onMounted(async () => {
  try {
    // Calling Express backend
    const response = await api.get('/stats')
    if (response.data && response.data.totalPublications !== undefined) {
      stats.value = response.data
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/repository?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const displayStats = computed(() => {
  const dynamicTypes = stats.value.publicationsByType.length > 0 
    ? stats.value.publicationsByType.slice(0, 2) 
    : [ { name: "Skripsi", value: 0 }, { name: "Jurnal", value: 0 } ]

  return [
    { title: "Total Dokumen", value: stats.value.totalPublications, desc: "Karya ilmiah tersimpan", icon: PhBookOpen, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Total Penulis", value: stats.value.totalAuthors, desc: "Civitas akademika", icon: PhUsers, color: "text-emerald-500", bg: "bg-emerald-100" },
    ...dynamicTypes.map(t => ({ title: t.name, value: t.value, desc: "Dokumen tersedia", icon: PhFileText, color: "text-purple-500", bg: "bg-purple-100" }))
  ]
})

const categories = computed(() => {
  return [
    { title: "Skripsi & Tesis", count: stats.value.publicationsByType.find(t => t.name.toLowerCase().includes('skripsi'))?.value || 0, href: "/repository?type=Skripsi" },
    { title: "Artikel Jurnal", count: stats.value.publicationsByType.find(t => t.name.toLowerCase().includes('jurnal'))?.value || 0, href: "/repository?type=Jurnal" },
    { title: "Prosiding", count: stats.value.publicationsByType.find(t => t.name.toLowerCase().includes('prosiding'))?.value || 0, href: "/repository?type=Prosiding" },
    { title: "Laporan Penelitian", count: stats.value.publicationsByType.find(t => t.name.toLowerCase().includes('laporan'))?.value || 0, href: "/repository?type=Laporan Penelitian" },
    { title: "Buku Ajar", count: stats.value.publicationsByType.find(t => t.name.toLowerCase().includes('buku'))?.value || 0, href: "/repository?type=Buku Ajar dosen" }
  ]
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
.pattern-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
