<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Manajemen Karya Ilmiah</h1>
        <p class="text-gray-500 mt-1">Kelola semua dokumen yang ada di reposituri.</p>
      </div>
      <Button @click="router.push('/dashboard/publications/new')">
        <PhPlus class="mr-2 h-4 w-4" /> Tambah Baru
      </Button>
    </div>

    <!-- Error message -->
    <div v-if="error" class="p-4 border border-red-500/50 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>

    <div v-else class="bg-white">
      <!-- Mobile view (Card Layout) -->
      <div class="md:hidden flex flex-col gap-4">
        <template v-if="loading">
          <div v-for="i in 5" :key="i" class="p-4 border border-gray-200 rounded-lg space-y-3">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
            <div class="flex gap-2">
              <Skeleton class="h-6 w-16" />
              <Skeleton class="h-6 w-16" />
            </div>
          </div>
        </template>
        
        <template v-else-if="publications.length > 0">
          <div v-for="pub in publications" :key="pub.id" class="p-4 border border-gray-200 rounded-lg flex flex-col gap-3 shadow-sm relative transition-all">
            <div class="absolute top-4 right-4">
              <Badge v-if="pub.isApproved" variant="outline" class="bg-emerald-50 text-emerald-700 border-emerald-200">
                Di-ACC
              </Badge>
              <Badge v-else variant="outline" class="bg-amber-50 text-amber-600 border-amber-200">
                Menunggu
              </Badge>
            </div>
            
            <div class="pr-20">
              <h3 class="font-semibold text-gray-900 text-base leading-snug line-clamp-2" :title="pub.title">
                {{ pub.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1 truncate">{{ pub.author?.name }}</p>
            </div>
            
            <div class="flex gap-2 items-center text-sm text-gray-500">
              <Badge variant="secondary" class="bg-gray-100 text-gray-700 font-medium border-gray-200">{{ pub.type }}</Badge>
              <span>•</span>
              <span class="font-medium">{{ pub.year }}</span>
            </div>
            
            <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
              <Button 
                v-if="authStore.user?.role === 'ADMIN'"
                :variant="pub.isApproved ? 'outline' : 'default'" 
                size="sm"
                class="flex-1"
                @click="requestApprovalToggle(pub.id, pub.isApproved)"
              >
                {{ pub.isApproved ? "Cabut ACC" : "ACC" }}
              </Button>
              
              <Button variant="outline" size="sm" class="px-3" @click="openNewTab(`/repository/${pub.id}`)">
                <PhEye class="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                class="px-3" 
                :disabled="authStore.user?.role !== 'ADMIN'"
                @click="authStore.user?.role === 'ADMIN' && router.push(`/dashboard/publications/${pub.id}/edit`)"
              >
                <PhPencilSimple class="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                class="px-3 border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50" 
                :disabled="authStore.user?.role !== 'ADMIN'"
                @click="authStore.user?.role === 'ADMIN' && requestDelete(pub.id)"
              >
                <PhTrash class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="p-8 text-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50/50">
            Belum ada dokumen yang diunggah.
          </div>
        </template>
      </div>

      <!-- Desktop view (Table) -->
      <div class="hidden md:block w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
        <table class="w-full caption-bottom text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="transition-colors hover:bg-gray-100/50">
              <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Judul</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Penulis</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Jenis</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Tahun</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Status ACC</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="hover:bg-gray-50/50 transition-colors">
                <td class="p-4 align-middle"><Skeleton class="h-4 w-[250px]" /></td>
                <td class="p-4 align-middle"><Skeleton class="h-4 w-[120px]" /></td>
                <td class="p-4 align-middle"><Skeleton class="h-4 w-[80px]" /></td>
                <td class="p-4 align-middle"><Skeleton class="h-4 w-[50px]" /></td>
                <td class="p-4 align-middle"><Skeleton class="h-4 w-[80px]" /></td>
                <td class="p-4 align-middle text-right"><Skeleton class="h-8 w-[100px] ml-auto" /></td>
              </tr>
            </template>
            
            <template v-else-if="publications.length > 0">
              <tr v-for="pub in publications" :key="pub.id" class="hover:bg-gray-50/50 transition-colors group">
                <td class="p-4 align-middle font-medium text-gray-900 max-w-[300px] truncate" :title="pub.title">
                  {{ pub.title }}
                </td>
                <td class="p-4 align-middle text-gray-600">{{ pub.author?.name }}</td>
                <td class="p-4 align-middle">
                  <Badge variant="outline">{{ pub.type }}</Badge>
                </td>
                <td class="p-4 align-middle text-gray-600">{{ pub.year }}</td>
                <td class="p-4 align-middle">
                  <Badge v-if="pub.isApproved" variant="outline" class="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Di-ACC
                  </Badge>
                  <Badge v-else variant="outline" class="bg-amber-50 text-amber-600 border-amber-200">
                    Menunggu
                  </Badge>
                </td>
                <td class="p-4 align-middle text-right space-x-2">
                  <Button 
                    v-if="authStore.user?.role === 'ADMIN'"
                    :variant="pub.isApproved ? 'outline' : 'default'" 
                    size="sm"
                    class="mr-2"
                    @click="requestApprovalToggle(pub.id, pub.isApproved)"
                  >
                    {{ pub.isApproved ? "Cabut ACC" : "ACC" }}
                  </Button>
                  
                  <Button variant="ghost" class="px-2" @click="openNewTab(`/repository/${pub.id}`)">
                    <PhEye class="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    class="px-2" 
                    :disabled="authStore.user?.role !== 'ADMIN'"
                    @click="authStore.user?.role === 'ADMIN' && router.push(`/dashboard/publications/${pub.id}/edit`)"
                  >
                    <PhPencilSimple class="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    class="px-2 text-red-500 hover:text-red-700 hover:bg-red-50" 
                    :disabled="authStore.user?.role !== 'ADMIN'"
                    @click="authStore.user?.role === 'ADMIN' && requestDelete(pub.id)"
                  >
                    <PhTrash class="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            </template>
            
            <template v-else>
              <tr>
                <td colspan="6" class="p-4 h-24 text-center align-middle text-gray-500">
                  Belum ada dokumen yang diunggah.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="alertOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900">Konfirmasi</h2>
          <p class="text-gray-500 mt-2">
            Apakah Anda yakin ingin {{ targetPub?.actionName }} karya ilmiah ini?
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="outline" @click="alertOpen = false">Batal</Button>
          <Button variant="default" @click="handleActionConfirm" :loading="actionLoading">Ya, Lanjutkan</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../api/axios'
import { PhPlus, PhEye, PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import { useToast } from '../../composables/useToast'

import Skeleton from '../../components/ui/Skeleton.vue'
import Badge from '../../components/ui/Badge.vue'
import Button from '../../components/ui/Button.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const publications = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Action State
const alertOpen = ref(false)
const actionLoading = ref(false)
const targetPub = ref<{ id: string; status: boolean; actionName: string; actionType: "approve" | "delete" } | null>(null)

onMounted(async () => {
  try {
    const response = await api.get('/publications?dashboard=true')
    publications.value = response.data.publications || response.data || []
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.message || err.message || "Gagal mengambil data publikasi"
  } finally {
    loading.value = false
  }
})

const openNewTab = (url: string) => {
  window.open(url, '_blank')
}

const requestApprovalToggle = (pubId: string, currentStatus: boolean) => {
  const actionName = currentStatus ? "mencabut ACC" : "menyetujui (ACC)"
  targetPub.value = { id: pubId, status: currentStatus, actionName, actionType: "approve" }
  alertOpen.value = true
}

const toggleApproval = async () => {
  if (!targetPub.value) return
  const { id: pubId, status: currentStatus } = targetPub.value

  try {
    await api.patch(`/publications/${pubId}/approve`, {
      isApproved: !currentStatus
    })
    
    publications.value = publications.value.map(p => 
      p.id === pubId ? { ...p, isApproved: !currentStatus } : p
    )
    toast.success(`Karya ilmiah berhasil ${!currentStatus ? 'di-ACC' : 'dicabut status ACC-nya'}`)
  } catch (err: any) {
    toast.error(err.response?.data?.message || err.message || "Gagal mengubah status ACC")
    throw err
  }
}

const requestDelete = (pubId: string) => {
  targetPub.value = { id: pubId, status: false, actionName: "menghapus", actionType: "delete" }
  alertOpen.value = true
}

const deletePublication = async () => {
  if (!targetPub.value) return
  const { id: pubId } = targetPub.value

  try {
    await api.delete(`/publications/${pubId}`)
    publications.value = publications.value.filter(p => p.id !== pubId)
    toast.success("Karya ilmiah berhasil dihapus secara permanen")
  } catch (err: any) {
    toast.error(err.response?.data?.message || err.message || "Gagal menghapus publikasi")
    throw err
  }
}

const handleActionConfirm = async () => {
  actionLoading.value = true
  try {
    if (targetPub.value?.actionType === "approve") {
      await toggleApproval()
    } else if (targetPub.value?.actionType === "delete") {
      await deletePublication()
    }
    alertOpen.value = false
    targetPub.value = null
  } catch (err) {
    // Errors are already alerted in specific handlers
  } finally {
    actionLoading.value = false
  }
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
