<template>
  <MainLayout>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Users</h2>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-700 font-medium">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span :class="getRoleBadge(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="user.is_active ? 'badge-success' : 'badge-danger'">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import api from '@/services/api'

const users = ref<any[]>([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return 'badge-danger'
    case 'manager': return 'badge-warning'
    case 'staff': return 'badge-info'
    default: return 'badge-info'
  }
}

onMounted(() => {
  fetchUsers()
})
</script>