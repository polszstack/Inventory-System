<template>
  <MainLayout>
    <div class="max-w-2xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h2 class="page-title">My Profile</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your account information</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        <!-- Avatar & Basic Info -->
        <div class="flex items-center gap-5 pb-6 border-b border-gray-100">
          <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
            <span class="text-3xl text-blue-700 font-bold">
              {{ authStore.user?.username?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ authStore.user?.username }}</h3>
            <p class="text-gray-500 text-sm">{{ authStore.user?.email }}</p>
            <span :class="getRoleBadge(authStore.user?.role)" class="mt-1.5 inline-block">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <!-- Account Details -->
        <div class="pt-6">
          <h4 class="text-base font-semibold text-gray-900 mb-5">Account Information</h4>
          <dl class="space-y-4">
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Username</dt>
              <dd class="text-sm font-medium text-gray-900">{{ authStore.user?.username }}</dd>
            </div>
            
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Email</dt>
              <dd class="text-sm font-medium text-gray-900">{{ authStore.user?.email }}</dd>
            </div>
            
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Role</dt>
              <dd class="text-sm font-medium text-gray-900 capitalize">
                <span :class="getRoleBadge(authStore.user?.role)">
                  {{ authStore.user?.role }}
                </span>
              </dd>
            </div>
            
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Status</dt>
              <dd>
                <span :class="authStore.user?.is_active ? 'badge-success' : 'badge-danger'">
                  {{ authStore.user?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </dd>
            </div>
            
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Last Login</dt>
              <dd class="text-sm font-medium text-gray-900">
                {{ authStore.user?.last_login ? formatDate(authStore.user.last_login) : 'Never' }}
              </dd>
            </div>
            
            <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-gray-50/50">
              <dt class="text-sm text-gray-500">Member Since</dt>
              <dd class="text-sm font-medium text-gray-900">
                {{ formatDate(authStore.user?.created_at || '') }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getRoleBadge = (role?: string) => {
  switch (role) {
    case 'admin': return 'badge-danger'
    case 'manager': return 'badge-warning'
    case 'staff': return 'badge-info'
    default: return 'badge-info'
  }
}
</script>