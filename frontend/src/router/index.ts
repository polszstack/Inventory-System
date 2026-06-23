import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('@/views/ProductsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'manager'] },
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check if route requires guest (non-authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Check role-based access
  if (to.meta.roles) {
    const userRole = authStore.user?.role
    const requiredRoles = to.meta.roles as string[]
    
    if (userRole && !requiredRoles.includes(userRole)) {
      next({ name: 'Dashboard' })
      return
    }
  }
  
  next()
})

export default router