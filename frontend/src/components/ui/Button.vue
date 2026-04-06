<template>
  <button
    :class="computedClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  className?: string
}>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  className: '',
})

defineEmits(['click'])

const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variantClasses = {
  default: 'bg-emerald-600 text-white hover:bg-emerald-700',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'hover:bg-gray-100 hover:text-gray-900',
  link: 'text-emerald-600 underline-offset-4 hover:underline'
}

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10'
}

const computedClasses = computed(() => {
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.className
  ].join(' ')
})
</script>
