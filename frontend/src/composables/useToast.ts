import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  message: string
  type: ToastType
}

// Global state for toasts
const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (params: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, ...params })
    // Auto remove after 4 seconds
    setTimeout(() => removeToast(id), 4000)
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, title = 'Berhasil') => addToast({ type: 'success', title, message }),
    error: (message: string, title = 'Gagal') => addToast({ type: 'error', title, message }),
    info: (message: string, title = 'Info') => addToast({ type: 'info', title, message }),
    warning: (message: string, title = 'Peringatan') => addToast({ type: 'warning', title, message }),
  }
}
