<template>
  <div class="space-y-6 max-w-7xl">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">
        Selamat datang, <span class="font-medium text-gray-900">{{ authStore.user?.name || "Pengguna" }}</span>. 
        Anda login sebagai <span class="font-semibold">{{ authStore.user?.role }}</span>.
      </p>
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
      <Skeleton class="h-[120px] w-full rounded-xl" />
    </div>
    
    <template v-else>
      <!-- ADMIN VIEW -->
      <div v-if="isAdmin">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle class="text-sm font-medium text-gray-700">Akun Terverifikasi</CardTitle>
              <PhCheckCircle class="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-gray-900">{{ stats?.totalVerifiedUsers || 0 }}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle class="text-sm font-medium text-gray-700">Akun Belum Verifikasi</CardTitle>
              <PhWarningCircle class="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-gray-900">{{ stats?.totalUnverifiedUsers || 0 }}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle class="text-sm font-medium text-gray-700">Total Publikasi</CardTitle>
              <PhBooks class="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-gray-900">{{ stats?.totalPublications || 0 }}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle class="text-sm font-medium text-gray-700">Publikasi Pending</CardTitle>
              <PhHourglass class="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-gray-900">{{ stats?.totalPendingPublications || 0 }}</div>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <!-- Scatter Chart / Bar Chart -->
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Publikasi per Tahun</CardTitle>
            </CardHeader>
            <CardContent>
              <VueApexCharts type="scatter" height="350" :options="scatterChartOptions" :series="scatterChartSeries" />
            </CardContent>
          </Card>

          <!-- Donut Chart -->
          <Card>
            <CardHeader>
              <CardTitle>Tipe Publikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <VueApexCharts type="donut" height="350" :options="donutChartOptions" :series="donutChartSeries" />
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- MAHASISWA & DOSEN VIEW -->
      <div v-else>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

        <!-- Role specific message or activity -->
        <Card class="mb-8">
          <CardContent class="pt-6">
            <h2 class="text-xl font-semibold mb-2">
              Informasi {{ authStore.user?.role === 'MAHASISWA' ? 'Akademik Mahasiswa' : 'Publikasi Dosen' }}
            </h2>
            <p class="text-gray-600">
              Gunakan platform ini untuk {{ authStore.user?.role === 'MAHASISWA' ? 'menemukan referensi skripsi, jurnal, dan tugas akhir.' : 'mengunggah dan mencari bahan ajar, jurnal, serta penelitian lainnya.' }}
            </p>
          </CardContent>
        </Card>

        <!-- Recommendations Section (CrossRef API) -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PhGlobe class="text-emerald-600 h-6 w-6" /> Rekomendasi Jurnal Global
              </h2>
              <p class="text-sm text-gray-500 mt-1">Disesuaikan dengan profil {{ authStore.user?.role }} Anda (via CrossRef).</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { 
  PhBookOpen, PhUsers, PhFileText, PhGlobe, PhUser, PhCalendar,
  PhCheckCircle, PhWarningCircle, PhBooks, PhHourglass
} from '@phosphor-icons/vue'
import api from '../../api/axios'

// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

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

const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

// Charts Data
const scatterChartSeries = ref<any[]>([])
const scatterChartOptions = ref<any>({
  chart: {
    type: 'scatter',
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  xaxis: {
    type: 'numeric',
    tickAmount: 5,
    labels: { formatter: (val: number) => Math.floor(val).toString() }
  },
  yaxis: {
    title: { text: 'Jumlah Publikasi' },
    min: 0
  },
  colors: ['#0ea5e9']
})

const donutChartSeries = ref<number[]>([])
const donutChartOptions = ref<any>({
  chart: { type: 'donut' },
  labels: [] as string[],
  colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  dataLabels: { enabled: true },
  legend: { position: 'bottom' }
})

const parseChartData = () => {
  if (!stats.value) return;

  // Scatter Chart: Year vs Count
  if (stats.value.publicationsByYear) {
    const data = stats.value.publicationsByYear.map((item: any) => [item.year, item.count]);
    scatterChartSeries.value = [{
      name: 'Publikasi',
      data: data
    }];
  }

  // Donut Chart: By Type
  if (stats.value.publicationsByType) {
    donutChartSeries.value = stats.value.publicationsByType.map((item: any) => item.value);
    donutChartOptions.value = {
      ...donutChartOptions.value,
      labels: stats.value.publicationsByType.map((item: any) => item.name)
    };
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/stats')
    stats.value = response.data
    
    if (isAdmin.value) {
      parseChartData()
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error)
  } finally {
    loading.value = false
  }
  
  if (!isAdmin.value) {
    fetchRecommendations()
  }
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
