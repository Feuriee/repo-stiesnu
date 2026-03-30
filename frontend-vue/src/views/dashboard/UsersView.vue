<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Manajemen Pengguna</h1>
      <p class="text-gray-500 mt-1">Kelola akun administrator, dosen, dan mahasiswa serta approval akun.</p>
    </div>

    <!-- Admin Gate -->
    <div v-if="authStore.user?.role !== 'ADMIN'" class="flex flex-col items-center justify-center p-12 text-center">
      <PhWarning class="h-12 w-12 text-red-500 mb-4" />
      <h2 class="text-2xl font-bold text-gray-900">Akses Ditolak</h2>
      <p class="text-gray-500 mt-2">Halaman ini hanya dapat diakses oleh Administrator.</p>
    </div>

    <template v-else>
      <div v-if="error" class="p-4 border border-red-500/50 bg-red-50 text-red-700 rounded-md">
        {{ error }}
      </div>

      <div v-else class="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div class="w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr class="transition-colors hover:bg-gray-100/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Nama</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Email</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Peran</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Tanggal Bergabung</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Status ACC</th>
                <th class="h-12 px-4 text-right align-middle font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <template v-if="loading">
                <tr v-for="i in 5" :key="i" class="hover:bg-gray-50/50 transition-colors">
                  <td class="p-4 align-middle"><Skeleton class="h-4 w-[150px]" /></td>
                  <td class="p-4 align-middle"><Skeleton class="h-4 w-[200px]" /></td>
                  <td class="p-4 align-middle"><Skeleton class="h-4 w-[80px]" /></td>
                  <td class="p-4 align-middle"><Skeleton class="h-4 w-[100px]" /></td>
                  <td class="p-4 align-middle"><Skeleton class="h-4 w-[80px]" /></td>
                  <td class="p-4 align-middle text-right"><Skeleton class="h-8 w-[100px] ml-auto" /></td>
                </tr>
              </template>
              
              <template v-else-if="users.length > 0">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50/50 transition-colors group">
                  <td class="p-4 align-middle font-medium text-gray-900">{{ user.name }}</td>
                  <td class="p-4 align-middle text-gray-600">{{ user.email }}</td>
                  <td class="p-4 align-middle">
                    <select
                      v-if="authStore.user?.role === 'ADMIN' && user.id !== authStore.user?.id"
                      v-model="user.role"
                      @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)"
                      class="border border-gray-300 rounded-md text-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="DOSEN">DOSEN</option>
                      <option value="MAHASISWA">MAHASISWA</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                    <Badge v-else :variant="user.role === 'ADMIN' ? 'default' : 'secondary'">
                      {{ user.role }}
                    </Badge>
                  </td>
                  <td class="p-4 align-middle text-gray-600">
                    {{ new Date(user.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) }}
                  </td>
                  <td class="p-4 align-middle">
                    <Badge v-if="user.isApproved" variant="outline" class="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Di-ACC
                    </Badge>
                    <Badge v-else variant="destructive">
                      Tertunda
                    </Badge>
                  </td>
                  <td class="p-4 align-middle text-right">
                    <Button 
                      v-if="user.role !== 'ADMIN'"
                      :variant="user.isApproved ? 'outline' : 'default'" 
                      size="sm"
                      @click="requestApprovalToggle(user.id, user.isApproved)"
                    >
                      {{ user.isApproved ? "Cabut Akses" : "Setujui (ACC)" }}
                    </Button>
                  </td>
                </tr>
              </template>
              
              <template v-else>
                <tr>
                  <td colspan="6" class="p-4 h-24 text-center align-middle text-gray-500">
                    Belum ada pengguna.
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal Dialog -->
    <div v-if="alertOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900">Konfirmasi</h2>
          <p class="text-gray-500 mt-2">
            Apakah Anda yakin ingin {{ targetUser?.actionName }} akun ini?
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="outline" @click="alertOpen = false">Batal</Button>
          <Button variant="default" @click="toggleApproval" :loading="actionLoading">Ya, Lanjutkan</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../api/axios'
import { PhWarning } from '@phosphor-icons/vue'
import { useToast } from '../../composables/useToast'

import Skeleton from '../../components/ui/Skeleton.vue'
import Badge from '../../components/ui/Badge.vue'
import Button from '../../components/ui/Button.vue'

const authStore = useAuthStore()
const toast = useToast()
const users = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Action State
const alertOpen = ref(false)
const actionLoading = ref(false)
const targetUser = ref<{ id: string; status: boolean; actionName: string } | null>(null)

onMounted(async () => {
  if (authStore.user?.role !== 'ADMIN') return
  
  try {
    const response = await api.get('/users')
    users.value = response.data
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.message || err.message || "Gagal mengambil data"
  } finally {
    loading.value = false
  }
})

const requestApprovalToggle = (userId: string, currentStatus: boolean) => {
  const actionName = currentStatus ? "mencabut akses" : "menyetujui (ACC)"
  targetUser.value = { id: userId, status: currentStatus, actionName }
  alertOpen.value = true
}

const toggleApproval = async () => {
  if (!targetUser.value) return
  actionLoading.value = true
  const { id: userId, status: currentStatus } = targetUser.value

  try {
    await api.patch(`/users/${userId}/approve`, {
      isApproved: !currentStatus
    })
    
    // Update local state
    users.value = users.value.map(u => 
      u.id === userId ? { ...u, isApproved: !currentStatus } : u
    )
    
    toast.success(`Akun berhasil ${!currentStatus ? 'di-ACC' : 'dicabut aksesnya'}`)
    
    alertOpen.value = false
    targetUser.value = null
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Gagal mengubah status ACC")
  } finally {
    actionLoading.value = false
  }
}

const updateRole = async (userId: string, newRole: string) => {
  try {
    await api.put(`/users/${userId}`, { role: newRole })
    toast.success(`Peran pengguna berhasil diubah menjadi ${newRole}`)
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Gagal mengubah role pengguna")
    // Re-fetch to revert local state visually 
    const response = await api.get('/users')
    users.value = response.data
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
