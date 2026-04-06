<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Profil Saya</h1>
      <p class="text-gray-500 mt-1">Perbarui informasi dasar dan kata sandi akun Anda.</p>
    </div>

    <!-- Edit Profile Form -->
    <Card class="border-t-4 border-t-emerald-600 shadow-md">
      <CardHeader>
        <CardTitle class="text-xl text-emerald-800">Informasi Pribadi</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Nama Lengkap</Label>
            <Input id="name" v-model="formData.name" placeholder="John Doe" required />
          </div>
          
          <div class="space-y-2">
            <Label for="email">Alamat Email</Label>
            <Input id="email" v-model="formData.email" type="email" required />
          </div>

          <hr class="border-gray-200 my-6" />
          
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-3 mt-6">
            <PhWarning class="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-yellow-800">
              <p class="font-medium mb-1">Perubahan Kata Sandi</p>
              <p>Jika Anda ingin mengubah kata sandi akun, mohon hubungi administrator kampus Anda.</p>
            </div>
          </div>

          <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm border border-emerald-100">
            {{ successMessage }}
          </div>

          <div class="flex justify-end pt-4">
            <Button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white" :disabled="loading">
              <span v-if="loading">Menyimpan...</span>
              <span v-else>Simpan Perubahan</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../api/axios'
import { PhWarning } from '@phosphor-icons/vue'

import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import CardTitle from '../../components/ui/CardTitle.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Input from '../../components/ui/Input.vue'
import Label from '../../components/ui/Label.vue'
import Button from '../../components/ui/Button.vue'

const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  if (authStore.user) {
    formData.value.name = authStore.user.name
    formData.value.email = authStore.user.email
  }
})

const handleUpdateProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  loading.value = true
  try {
    const payload: any = { 
      name: formData.value.name,
      email: formData.value.email 
    }

    const res = await api.put(`/users/${authStore.user?.id}`, payload)
    
    if (authStore.user) {
      authStore.user.name = res.data.name;
      authStore.user.email = res.data.email;
    }
    
    successMessage.value = 'Profil berhasil diperbarui!'
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Gagal memperbarui profil. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
