<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M12 3.75v9m0 0l-3-3m3 3l3-3M3.75 7.5h16.5" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Create account</h2>
        <p class="mt-2 text-sm text-gray-500">Get started with your inventory management</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1.5">
              Username
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                placeholder="Choose a username"
                autocomplete="username"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                placeholder="Enter your email"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                placeholder="Create a password"
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <p class="mt-1.5 text-xs text-gray-400">
              Must contain uppercase, lowercase, and number
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ authStore.error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300/50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 text-sm"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>{{ authStore.loading ? 'Creating account...' : 'Create account' }}</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-7 pt-5 border-t border-gray-100">
          <p class="text-center text-sm text-gray-500">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
              Sign in
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }} Inventory System. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
})

const showPassword = ref(false)

const handleRegister = async () => {
  try {
    await authStore.register(form.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped>
.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>