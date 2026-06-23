<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.getProfile()
    } catch (error) {
      authStore.logout()
      router.push('/login')
    }
  }
})
</script>

<style>
/* Smooth page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>