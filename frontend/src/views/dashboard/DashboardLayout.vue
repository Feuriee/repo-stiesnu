<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
    <div class="hidden lg:block">
      <AdminSidebar />
    </div>
    <main class="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '../../components/layout/AdminSidebar.vue'
</script>
