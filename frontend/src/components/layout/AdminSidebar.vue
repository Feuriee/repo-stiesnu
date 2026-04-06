<template>
  <nav class="flex flex-col space-y-1 w-full lg:w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4 shadow-sm">
    <div class="mb-8 px-4">
      <h2 class="text-xl font-bold tracking-tight text-emerald-700">
        Dashboard Panel
      </h2>
      <p class="text-sm text-gray-500 mt-1 capitalize">
        {{ authStore.user?.role?.toLowerCase() || 'Pengguna' }}
      </p>
    </div>
    
    <router-link
      v-for="item in sidebarNavItems"
      :key="item.href"
      :to="item.href"
      class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors"
      :class="{
         'bg-emerald-600 text-white shadow-sm': isActive(item.href, route.path),
         'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive(item.href, route.path)
       }"
    >
      <component :is="item.icon" class="h-4 w-4" />
      {{ item.title }}
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { PhLayout, PhFileText, PhUsers, PhUploadSimple, PhUserGear } from '@phosphor-icons/vue'

const route = useRoute()
const authStore = useAuthStore()

const sidebarNavItems = computed(() => {
  const role = authStore.user?.role
  const items = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: PhLayout,
    },
    {
      title: "Karya Ilmiah",
      href: "/dashboard/publications",
      icon: PhFileText,
    },
    {
      title: "Upload Karya",
      href: "/dashboard/publications/new",
      icon: PhUploadSimple,
    },
    {
      title: "Profil Saya",
      href: "/dashboard/profile",
      icon: PhUserGear,
    },
  ]

  if (role === "ADMIN") {
    items.push({
      title: "Manajemen User",
      href: "/dashboard/users",
      icon: PhUsers,
    })
  }

  return items
})

const isActive = (href: string, currentPath: string) => {
  if (href === "/dashboard") {
    return currentPath === "/dashboard"
  }
  if (href === "/dashboard/publications") {
    return currentPath === "/dashboard/publications" || 
           (currentPath.startsWith("/dashboard/publications/") && !currentPath.includes("/new"))
  }
  return currentPath.startsWith(href)
}
</script>
