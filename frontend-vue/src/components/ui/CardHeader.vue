<template>
  <div :class="['flex flex-col space-y-1.5 p-6', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  className?: string
}>(), {
  className: ''
})
</script>
