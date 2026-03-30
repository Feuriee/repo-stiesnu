<template>
  <h3 :class="['font-semibold leading-none tracking-tight', className]">
    <slot />
  </h3>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  className?: string
}>(), {
  className: ''
})
</script>
