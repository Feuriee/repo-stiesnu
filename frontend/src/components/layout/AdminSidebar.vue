<template>
  <nav 
    class="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:shadow-sm transition-all duration-300 relative z-40 lg:border-r lg:border-gray-200 lg:min-h-[calc(100vh-4rem)] lg:py-4 lg:flex lg:flex-col lg:space-y-2 fixed bottom-0 left-0 right-0 border-t border-gray-100 flex-row px-1 sm:px-2 flex justify-around lg:justify-start items-center lg:items-stretch h-16 lg:h-auto lg:static"
    :class="[isCollapsed ? 'lg:w-20 lg:px-2' : 'lg:w-64 lg:px-4']"
  >
    <button 
      @click="toggleCollapse"
      class="hidden lg:flex absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm z-10 transition-colors"
      title="Toggle Sidebar"
    >
      <component :is="isCollapsed ? PhCaretRight : PhCaretLeft" class="h-3.5 w-3.5" />
    </button>

    <div class="hidden lg:block mb-6 mt-2 transition-all duration-300" :class="isCollapsed ? 'px-0 text-center' : 'px-4'">
      <h2 
        class="font-bold tracking-tight text-emerald-700 transition-all duration-300 whitespace-nowrap overflow-hidden"
        :class="isCollapsed ? 'text-xs' : 'text-xl'"
      >
        <span v-if="!isCollapsed">Dashboard Panel</span>
        <span v-else>DB</span>
      </h2>
      <p 
        v-if="!isCollapsed" 
        class="text-sm text-gray-500 mt-1 capitalize whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ authStore.user?.role?.toLowerCase() || 'Pengguna' }}
      </p>
    </div>
    
    <div class="flex flex-row flex-1 lg:flex-none justify-around lg:justify-start w-full lg:flex-col lg:space-y-1">
      <router-link
        v-for="item in sidebarNavItems"
        :key="item.href"
        :to="item.href"
        class="flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:gap-3 rounded-md p-1 lg:py-2.5 transition-all duration-200 group flex-1 min-w-0 lg:flex-none"
        :class="[
           isCollapsed ? 'lg:px-0 lg:justify-center' : 'lg:px-4',
           isActive(item.href, route.path)
             ? 'text-emerald-600 lg:bg-emerald-600 lg:text-white lg:shadow-sm font-medium'
             : 'text-gray-500 lg:text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium'
         ]"
         :title="isCollapsed ? item.title : ''"
      >
        <component 
          :is="item.icon" 
          class="h-5 w-5 sm:h-6 sm:w-6 lg:h-5 lg:w-5 shrink-0 transition-transform duration-200 mb-0.5 lg:mb-0" 
          :class="{ 'group-hover:scale-110': !isActive(item.href, route.path) }"
        />
        <span 
           class="text-[10px] sm:text-xs lg:text-sm truncate w-full transition-all text-center mt-0.5 lg:mt-0"
           :class="isCollapsed ? 'lg:hidden' : 'lg:inline'"
        >
          {{ item.title }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { 
  PhLayout, 
  PhFileText, 
  PhUsers, 
  PhUploadSimple, 
  PhUserGear,
  PhCaretLeft,
  PhCaretRight
} from '@phosphor-icons/vue'

const route = useRoute()
const authStore = useAuthStore()

// Read initial state from localStorage if available, defaults to false
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
}

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
