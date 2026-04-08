<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
    <AdminSidebar />
    <main class="flex-1 p-4 pb-24 md:p-8 md:pb-8 overflow-y-auto w-full">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '../../components/layout/AdminSidebar.vue'
</script>
