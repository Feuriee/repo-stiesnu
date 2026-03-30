<template>
  <div :class="['rounded-xl border border-gray-200 bg-white text-gray-950 shadow', className]">
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
