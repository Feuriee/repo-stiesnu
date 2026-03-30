<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-6">
      <Button variant="ghost" class="pl-0 hover:bg-transparent hover:text-emerald-600" @click="router.push('/repository')">
        <PhArrowLeft class="mr-2 h-4 w-4" /> Kembali ke Koleksi
      </Button>
    </div>

    <template v-if="loading">
      <Card class="border-t-4 border-t-emerald-600 shadow-md overflow-hidden">
        <CardContent class="p-6 md:p-10 space-y-4">
          <Skeleton class="h-8 w-3/4 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
          </div>
          <Skeleton class="h-32 w-full mt-8" />
        </CardContent>
      </Card>
    </template>

    <template v-else-if="pub">
      <Card class="border-t-4 border-t-emerald-600 shadow-md overflow-hidden">
        <CardContent class="p-6 md:p-10">
          <div class="flex flex-wrap gap-2 mb-4">
            <Badge class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">{{ pub.type }}</Badge>
            <Badge v-if="pub.programStudy" variant="outline">{{ pub.programStudy }}</Badge>
          </div>
          
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {{ pub.title }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-gray-200">
            <div class="flex items-start gap-3">
              <PhUser class="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-gray-500">Penulis</p>
                <router-link :to="`/author/${pub.author.id}`" class="font-semibold text-emerald-700 hover:underline">
                  {{ pub.author.name }}
                </router-link>
                <p v-if="pub.author.affiliation" class="text-xs text-gray-500">{{ pub.author.affiliation }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <PhCalendar class="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-gray-500">Tahun Terbit</p>
                <p class="font-semibold">{{ pub.year }}</p>
              </div>
            </div>

            <div v-if="pub.programStudy" class="flex items-start gap-3">
              <PhGraduationCap class="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-gray-500">Program Studi</p>
                <p class="font-semibold">{{ pub.programStudy }}</p>
              </div>
            </div>
            
            <div v-if="pub.keywords && pub.keywords.length > 0" class="col-span-1 md:col-span-2 mt-2">
              <p class="text-sm font-medium text-gray-500 mb-2">Kata Kunci</p>
              <div class="flex flex-wrap gap-1.5">
                <Badge v-for="k in pub.keywords" :key="k.keywordId" variant="secondary" class="font-normal text-xs font-mono">
                  {{ k.keyword.name }}
                </Badge>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="text-lg font-bold mb-3 border-l-4 border-gray-300 pl-3">Abstrak</h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-wrap text-justify">
              {{ pub.abstract }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 border flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <PhFileText class="h-6 w-6 text-emerald-700" />
              </div>
              <div class="overflow-hidden">
                <p class="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">
                  {{ pub.pdfUrl ? pub.pdfUrl.split('/').pop() : "Dokumen File" }}
                </p>
                <p class="text-xs text-gray-500">PDF Document</p>
              </div>
            </div>
            
            <Button v-if="pub.pdfUrl" class="w-full md:w-auto shadow-sm" @click="downloadFile(pub.pdfUrl)">
              <PhDownload class="mr-2 h-4 w-4" /> Unduh Dokumen FullText
            </Button>
            <Button v-else disabled variant="outline" class="w-full md:w-auto">
              <PhFileText class="mr-2 h-4 w-4" /> Dokumen Tidak Tersedia
            </Button>
          </div>
        </CardContent>
      </Card>
    </template>
    
    <template v-else>
      <div class="text-center py-16 text-gray-500">
        <h2 class="text-2xl font-bold mb-2">Tidak Ditemukan</h2>
        <p>Gagal memuat detail publikasi atau dokumen tidak ada.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowLeft, PhUser, PhCalendar, PhGraduationCap, PhFileText, PhDownload } from '@phosphor-icons/vue'
import api from '../api/axios'

import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Skeleton from '../components/ui/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const pub = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await api.get(`/publications/${id}`)
    if (response.data.publication) {
      pub.value = response.data.publication
    }
  } catch (e) {
    console.error("Failed to fetch publication:", e)
  } finally {
    loading.value = false
  }
})

const downloadFile = (url: string) => {
  // Replace backend endpoint properly if necessary
  const backendUrl = 'http://localhost:8000'
  const fullUrl = url.startsWith('/') ? `${backendUrl}${url}` : url
  window.open(fullUrl, '_blank', 'noopener,noreferrer')
}
</script>
