<template>
  <div class="space-y-6 max-w-5xl">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">
        Selamat datang, <span class="font-medium text-gray-900">{{ authStore.user?.name || "Pengguna" }}</span>. Berikut adalah ringkasan reposituri saat ini.
      </p>
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
    </div>
    
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium text-gray-700">Total Dokumen</CardTitle>
          <PhBookOpen class="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ stats?.totalPublications || 0 }}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium text-gray-700">Total Penulis</CardTitle>
          <PhUsers class="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ stats?.totalAuthors || 0 }}</div>
        </CardContent>
      </Card>

      <Card v-for="(type, index) in stats?.publicationsByType?.slice(0, 2)" :key="index">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium text-gray-700">{{ type.name }}</CardTitle>
          <PhFileText class="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-gray-900">{{ type.value }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Recommendations Section (CrossRef API) -->
    <div class="mt-12 pt-6 border-t border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PhGlobe class="text-emerald-600 h-6 w-6" /> Rekomendasi Jurnal Global
          </h2>
          <p class="text-sm text-gray-500 mt-1">Disesuaikan dengan minat akademik Anda (via CrossRef).</p>
        </div>
      </div>
      
      <div v-if="loadingRecs" class="space-y-4">
        <Skeleton class="h-[100px] w-full rounded-xl" v-for="i in 3" :key="i" />
      </div>

      <div v-else-if="recommendations.length > 0" class="space-y-4">
        <a 
          v-for="rec in recommendations" 
          :key="rec.url" 
          :href="rec.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="block group"
        >
          <Card class="transition-colors hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer">
            <CardContent class="p-6">
              <h3 class="text-lg font-semibold text-emerald-800 group-hover:underline line-clamp-2">
                {{ rec.title }}
              </h3>
              <div class="flex flex-wrap items-center text-sm text-gray-500 mt-2 gap-4">
                <span class="flex items-center gap-1"><PhUser class="h-4 w-4" /> {{ rec.author }}</span>
                <span v-if="rec.year !== 'N/A'" class="flex items-center gap-1"><PhCalendar class="h-4 w-4" /> {{ rec.year }}</span>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>
      
      <div v-else class="text-center p-8 border border-dashed border-gray-300 rounded-lg text-gray-500">
        Gagal memuat rekomendasi jurnal.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { PhBookOpen, PhUsers, PhFileText, PhGlobe, PhUser, PhCalendar } from '@phosphor-icons/vue'
import api from '../../api/axios'

import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import CardTitle from '../../components/ui/CardTitle.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Skeleton from '../../components/ui/Skeleton.vue'

const authStore = useAuthStore()
const stats = ref<any>(null)
const loading = ref(true)

const recommendations = ref<any[]>([])
const loadingRecs = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error)
  } finally {
    loading.value = false
  }
  
  fetchRecommendations()
})

const fetchRecommendations = async () => {
  loadingRecs.value = true
  try {
    // Defaulting to "Ekonomi Syariah" or using user's role to adjust slightly
    const query = authStore.user?.role === 'MAHASISWA' ? 'Skripsi Ekonomi Syariah' : 'Jurnal Ekonomi';
    
    const res = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5&select=title,author,URL,published`)
    const data = await res.json()
    
    if (data.message && data.message.items) {
      recommendations.value = data.message.items.map((item: any) => ({
        title: item.title?.[0] || 'Unknown Title',
        author: item.author?.map((a: any) => a.family ? `${a.given || ''} ${a.family}`.trim() : a.name).join(', ') || 'Unknown Author',
        url: item.URL,
        year: item.published?.['date-parts']?.[0]?.[0] || 'N/A'
      }))
    }
  } catch (err) {
    console.error('Failed to fetch recommendations', err)
  } finally {
    loadingRecs.value = false
  }
}
</script>
