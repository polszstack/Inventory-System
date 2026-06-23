<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 z-40 h-screen transition-transform duration-300',
        'bg-white border-r border-gray-100',
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-5 border-b border-gray-100">
        <router-link to="/" class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-200">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M12 3.75v9m0 0l-3-3m3 3l3-3M3.75 7.5h16.5" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-gray-900 tracking-tight">Inventory</span>
        </router-link>
        <button @click="toggleSidebar" class="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="p-3 space-y-0.5">
        <router-link
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-150"
          :class="isActiveRoute(item.to) 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-4 h-4 mr-3 flex-shrink-0" />
          <span>{{ item.label }}</span>
          <span 
            v-if="item.badge" 
            class="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>
      
      <!-- User Footer -->
      <div class="absolute bottom-0 w-full p-3 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm text-blue-700 font-medium">
              {{ authStore.user?.username?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ authStore.user?.username }}
            </p>
            <p class="text-xs text-gray-400 capitalize">
              {{ authStore.user?.role }}
            </p>
          </div>
          <button 
            @click="handleLogout" 
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity"
    />

    <!-- Main Content -->
    <div class="lg:ml-64">
      <!-- Top Navbar -->
      <header class="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div class="flex items-center justify-between h-16 px-5">
          <div class="flex items-center gap-3">
            <button @click="toggleSidebar" class="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu class="w-5 h-5" />
            </button>
            <h1 class="text-base font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Notification Bell -->
            <button class="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <!-- User Avatar (visible on mobile) -->
            <div class="lg:hidden w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-sm text-blue-700 font-medium">
                {{ authStore.user?.username?.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-5 lg:p-7">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ArrowLeftRight,
  Users,
  User,
  Bell,
  Menu,
  X,
  LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    Dashboard: 'Dashboard',
    Products: 'Products',
    ProductDetail: 'Product Details',
    Categories: 'Categories',
    Transactions: 'Transactions',
    Users: 'Users',
    Profile: 'My Profile',
  }
  return titles[route.name as string] || 'Inventory System'
})

type NavItem = {
  to: string
  label: string
  icon: any
  roles?: string[]
  badge?: string | number
}

const navigationItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/categories', label: 'Categories', icon: FolderTree, roles: ['admin', 'manager'] },
    { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { to: '/users', label: 'Users', icon: Users, roles: ['admin'] },
    { to: '/profile', label: 'Profile', icon: User },
  ]

  return items.filter(item => {
    if (!item.roles) return true
    return item.roles!.includes(authStore.user?.role || '')
  })
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const isActiveRoute = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>