<template>
  <div :class="['p-6 pt-0', className]">
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
