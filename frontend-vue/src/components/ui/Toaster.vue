<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto relative flex w-full items-start space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all"
        :class="{
          'bg-white border-gray-200 text-gray-900': toast.type === 'info',
          'bg-emerald-50 border-emerald-200 text-emerald-900': toast.type === 'success',
          'bg-red-50 border-red-200 text-red-900': toast.type === 'error',
          'bg-yellow-50 border-yellow-200 text-yellow-900': toast.type === 'warning'
        }"
      >
        <div class="flex gap-3">
          <PhCheckCircle v-if="toast.type === 'success'" weight="fill" class="h-5 w-5 text-emerald-600 shrink-0" />
          <PhXCircle v-else-if="toast.type === 'error'" weight="fill" class="h-5 w-5 text-red-600 shrink-0" />
          <PhInfo v-else-if="toast.type === 'info'" weight="fill" class="h-5 w-5 text-blue-600 shrink-0" />
          <PhWarningCircle v-else weight="fill" class="h-5 w-5 text-yellow-600 shrink-0" />
          
          <div class="flex flex-col gap-1">
            <h3 class="text-sm font-semibold leading-none tracking-tight">{{ toast.title }}</h3>
            <div class="text-sm opacity-90 leading-relaxed">{{ toast.message }}</div>
          </div>
        </div>
        
        <button 
          @click="removeToast(toast.id)"
          class="absolute right-2 top-2 rounded-md p-1 opacity-50 hover:bg-black/5 hover:opacity-100 focus:opacity-100 transition-colors"
        >
          <PhX class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { PhCheckCircle, PhXCircle, PhInfo, PhWarningCircle, PhX } from '@phosphor-icons/vue'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
