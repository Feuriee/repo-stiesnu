<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="[
      'flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
      className
    ]"
    v-bind="$attrs"
  ></textarea>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string | number
  className?: string
}>(), {
  modelValue: '',
  className: ''
})
defineEmits(['update:modelValue'])
</script>
