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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { PhBookOpen, PhUsers, PhFileText } from '@phosphor-icons/vue'
import api from '../../api/axios'

import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import CardTitle from '../../components/ui/CardTitle.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Skeleton from '../../components/ui/Skeleton.vue'

const authStore = useAuthStore()
const stats = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error)
  } finally {
    loading.value = false
  }
})
</script>
