<template>
  <label
    :class="[
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900',
      className
    ]"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  className?: string
}>(), {
  className: ''
})
</script>
