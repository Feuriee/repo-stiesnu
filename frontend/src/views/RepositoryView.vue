<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="mb-8 space-y-4">
      <h1 class="text-3xl font-bold text-emerald-700">Koleksi Repository</h1>
      <p class="text-gray-500">Telusuri seluruh karya ilmiah STIESNU Bengkulu</p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar Filters -->
      <div class="w-full md:w-64 space-y-6 shrink-0">
        <Card>
          <CardHeader class="pb-4">
            <CardTitle class="text-lg">Filter Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="updateSearch" class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Kata Kunci</label>
                <div class="relative">
                  <PhMagnifyingGlass class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Cari judul/penulis" 
                    class="pl-8" 
                    v-model="searchTerm"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Jenis Karya</label>
                <Select v-model="filterType">
                  <option value="all">Semua Jenis</option>
                  <option value="Skripsi">Skripsi</option>
                  <option value="Jurnal">Jurnal</option>
                  <option value="Prosiding">Prosiding</option>
                  <option value="Laporan Penelitian">Laporan Penelitian</option>
                  <option value="Buku Ajar dosen">Buku Ajar Dosen</option>
                </Select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Tahun</label>
                <Input 
                  placeholder="Contoh: 2023" type="number" 
                  v-model="filterYear"
                />
              </div>

              <Button type="submit" class="w-full">Terapkan Filter</Button>
              <Button 
                v-if="searchTerm || filterType !== 'all' || filterYear !== 'all' && filterYear !== ''" 
                variant="ghost" 
                class="w-full" 
                type="button" 
                @click="resetFilter"
              >
                Reset Filter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <!-- Results -->
      <div class="flex-1 space-y-6">
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Menampilkan {{ data.publications.length }} dari {{ data.total || 0 }} hasil</span>
        </div>

        <template v-if="loading">
          <Card v-for="i in 5" :key="i" class="mb-4">
            <CardContent class="p-6 !pt-6 space-y-4">
              <Skeleton class="h-6 w-3/4" />
              <div class="flex gap-4">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-4 w-24" />
              </div>
              <Skeleton class="h-16 w-full" />
            </CardContent>
          </Card>
        </template>
        
        <template v-else-if="data.publications.length > 0">
          <Card v-for="pub in data.publications" :key="pub.id" class="transition-all hover:bg-gray-50/50 mb-4 cursor-pointer" @click="router.push(`/repository/${pub.id}`)">
            <CardContent class="p-6 !pt-6">
              <div class="flex flex-col gap-2">
                <div class="flex gap-2 items-center mb-1">
                  <Badge variant="secondary" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{{ pub.type }}</Badge>
                  <Badge v-if="pub.programStudy" variant="outline">{{ pub.programStudy }}</Badge>
                </div>
                
                <h2 class="text-xl font-bold text-emerald-700 hover:underline inline-block">{{ pub.title }}</h2>
                
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                  <div class="flex items-center gap-1">
                    <PhUser class="h-4 w-4" />
                    <span class="hover:text-emerald-600" @click.stop="router.push(`/author/${pub.author.id}`)">
                      {{ pub.author.name }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <PhCalendar class="h-4 w-4" />
                    <span>{{ pub.year }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <PhFileText class="h-4 w-4" />
                    <span>PDF Available</span>
                  </div>
                </div>
                
                <p class="text-sm mt-3 line-clamp-3 text-gray-500">
                  {{ pub.abstract }}
                </p>
              </div>
            </CardContent>
          </Card>
        </template>
        
        <template v-else>
          <div class="text-center py-16 text-gray-500 bg-gray-50/50 rounded-lg">
            <PhBookOpen class="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada hasil yang ditemukan.</p>
          </div>
        </template>

        <!-- Pagination -->
        <div v-if="data.totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
          <Button 
            variant="outline" size="sm" 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            <PhCaretLeft class="h-4 w-4 mr-1" />
            Sebelumnnya
          </Button>
          <div class="text-sm">
            Hal {{ currentPage }} dari {{ data.totalPages }}
          </div>
          <Button 
            variant="outline" size="sm" 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= data.totalPages"
          >
            Selanjutnya
            <PhCaretRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhMagnifyingGlass, PhBookOpen, PhUser, PhCalendar, PhFileText, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import api from '../api/axios'

import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import CardTitle from '../components/ui/CardTitle.vue'
import CardContent from '../components/ui/CardContent.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import Select from '../components/ui/Select.vue'
import Badge from '../components/ui/Badge.vue'
import Skeleton from '../components/ui/Skeleton.vue'

const route = useRoute()
const router = useRouter()

const searchTerm = ref(route.query.search?.toString() || '')
const filterType = ref(route.query.type?.toString() || 'all')
const filterYear = ref(route.query.year?.toString() || 'all')
if (filterYear.value === 'all') filterYear.value = ''

const currentPage = ref(parseInt(route.query.page?.toString() || '1'))
const loading = ref(true)

const data = ref({
  publications: [] as any[],
  totalPages: 1,
  page: 1,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  const params = new URLSearchParams()
  if (route.query.search) params.append('search', route.query.search.toString())
  if (route.query.type && route.query.type !== 'all') params.append('type', route.query.type.toString())
  if (route.query.year && route.query.year !== 'all') params.append('year', route.query.year.toString())
  params.append('page', currentPage.value.toString())

  try {
    const response = await api.get(`/publications?${params.toString()}`)
    if (Array.isArray(response.data)) {
      data.value = {
        publications: response.data,
        total: response.data.length,
        page: currentPage.value,
        totalPages: 1
      }
    } else if (response.data.publications) {
      data.value = response.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

watch(() => route.query, (newQuery) => {
  searchTerm.value = newQuery.search?.toString() || ''
  filterType.value = newQuery.type?.toString() || 'all'
  filterYear.value = newQuery.year?.toString() || ''
  currentPage.value = parseInt(newQuery.page?.toString() || '1')
  fetchData()
})

const updateSearch = () => {
  const query: Record<string, string> = { page: '1' }
  if (searchTerm.value) query.search = searchTerm.value
  if (filterType.value !== 'all') query.type = filterType.value
  if (filterYear.value) query.year = filterYear.value
  
  router.push({ path: '/repository', query })
}

const resetFilter = () => {
  searchTerm.value = ''
  filterType.value = 'all'
  filterYear.value = ''
  router.push('/repository')
}

const goToPage = (p: number) => {
  router.push({ path: '/repository', query: { ...route.query, page: p.toString() } })
}
</script>
