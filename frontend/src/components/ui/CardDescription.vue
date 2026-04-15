<template>
  <p :class="['text-sm text-gray-500 dark:text-gray-400', className]">
    <slot />
  </p>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  className?: string
}>(), {
  className: ''
})
</script>
