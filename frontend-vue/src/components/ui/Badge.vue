<template>
  <div
    :class="[
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variantClasses[variant],
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}>(), {
  variant: 'default',
  className: ''
})

const variantClasses = {
  default: 'border-transparent bg-emerald-600 text-white hover:bg-emerald-700',
  secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
  destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
  outline: 'text-gray-900 border-gray-200'
}
</script>
