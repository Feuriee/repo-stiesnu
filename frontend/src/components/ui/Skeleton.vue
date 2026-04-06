<template>
  <div :class="['animate-pulse rounded-md bg-gray-200/60', className]"></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  className?: string
}>(), {
  className: ''
})
</script>
