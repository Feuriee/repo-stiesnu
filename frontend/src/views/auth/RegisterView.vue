<template>
  <div class="container flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mx-auto">
    <Card class="w-full max-w-md shadow-lg border-t-4 border-t-emerald-500">
      <CardHeader class="space-y-1 flex flex-col items-center text-center">
        <img src="/logo.png" alt="Logo STIESNU" class="h-16 w-auto mb-3" />
        <CardTitle class="text-2xl font-bold tracking-tight text-emerald-700">
          Daftar Akun Baru
        </CardTitle>
        <CardDescription>
          Buat akun untuk dapat mengakses layanan penuh
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Ahmad Fulan"
              v-model="name"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@stiesnu.ac.id"
              v-model="email"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="password"
              required
              minlength="6"
            />
          </div>
          
          <div v-if="authStore.error" class="text-sm text-red-500 text-center font-medium">
            {{ authStore.error }}
          </div>
          <div v-if="successMessage" class="text-sm text-green-600 text-center font-medium">
            {{ successMessage }}
          </div>

          <Button class="w-full mt-6" type="submit" :loading="loading" variant="secondary">
            {{ loading ? "Memproses..." : "Daftar" }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col space-y-4 px-6 py-4">
        <div class="text-sm text-center text-gray-500 w-full">
          Sudah punya akun?
          <router-link
            to="/login"
            class="text-emerald-700 hover:underline font-medium"
          >
            Masuk disini
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { PhBookOpen } from '@phosphor-icons/vue'

import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import CardTitle from '../../components/ui/CardTitle.vue'
import CardDescription from '../../components/ui/CardDescription.vue'
import CardContent from '../../components/ui/CardContent.vue'
import CardFooter from '../../components/ui/CardFooter.vue'
import Label from '../../components/ui/Label.vue'
import Input from '../../components/ui/Input.vue'
import Button from '../../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const successMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  successMessage.value = ''
  
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    successMessage.value = 'Berhasil mendaftar. Mengalihkan ke halaman login...'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    // Error is handled by Pinia wrapper
  } finally {
    loading.value = false
  }
}
</script>
