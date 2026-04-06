import { defineStore } from 'pinia'
import api from '../api/axios'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'GUEST' | 'DOSEN' | 'MAHASISWA'
  isApproved: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  actions: {
    async checkSession() {
      this.isLoading = true;
      try {
        const response = await api.get('/auth/session')
        this.user = response.data
        this.isAuthenticated = true
      } catch (error: any) {
        this.user = null
        this.isAuthenticated = false
      } finally {
        this.isLoading = false
      }
    },

    async login(credentials: Record<string, string>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', credentials)
        this.user = response.data.user
        this.isAuthenticated = true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: Record<string, string>) {
      this.isLoading = true
      this.error = null
      try {
        await api.post('/auth/register', userData)
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Registration failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        console.error('Logout failed', error)
      }
    }
  }
})
