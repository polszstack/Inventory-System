import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User, LoginDTO, RegisterDTO } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager')
  const isStaff = computed(() => user.value?.role === 'staff')

  // Actions
  const login = async (data: LoginDTO) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(data)
      user.value = response.user
      accessToken.value = response.tokens.accessToken
      refreshToken.value = response.tokens.refreshToken
      
      // Save tokens
      localStorage.setItem('accessToken', response.tokens.accessToken)
      localStorage.setItem('refreshToken', response.tokens.refreshToken)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterDTO) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(data)
      user.value = response.user
      accessToken.value = response.tokens.accessToken
      refreshToken.value = response.tokens.refreshToken
      
      // Save tokens
      localStorage.setItem('accessToken', response.tokens.accessToken)
      localStorage.setItem('refreshToken', response.tokens.refreshToken)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const getProfile = async () => {
    try {
      const userData = await authService.getProfile()
      user.value = userData
    } catch (err) {
      logout()
      throw err
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    isStaff,
    login,
    register,
    logout,
    getProfile,
  }
})