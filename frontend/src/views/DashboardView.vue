<template>
  <MainLayout>
    <!-- Page Header -->
    <div class="mb-6">
      <h2 class="page-title">Dashboard</h2>
      <p class="text-sm text-gray-500 mt-1">Overview of your inventory</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <!-- Total Products -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
            <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </div>
      
      <!-- Total Value -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</p>
            <p class="text-2xl font-bold text-gray-900 mt-0.5">${{ formatNumber(stats.totalValue) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Low Stock -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock</p>
            <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ stats.lowStock }}</p>
          </div>
        </div>
      </div>
      
      <!-- Out of Stock -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 border border-gray-100 hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <XCircle class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Out of Stock</p>
            <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ stats.outOfStock }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Products & Low Stock -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Products -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-base font-semibold text-gray-900">Recent Products</h3>
          <router-link to="/products" class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
            View all →
          </router-link>
        </div>
        
        <div v-if="recentProducts.length === 0" class="text-center py-8">
          <Package class="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p class="text-sm text-gray-500">No products yet</p>
        </div>
        
        <div class="space-y-2">
          <div
            v-for="product in recentProducts"
            :key="product.id"
            class="flex items-center justify-between p-3.5 bg-gray-50/70 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ product.sku }}</p>
            </div>
            <div class="text-right ml-4 flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900">${{ Number(product.unit_price).toFixed(2) }}</p>
              <span :class="getStockBadge(product)">
                {{ product.quantity }} in stock
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Products -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-base font-semibold text-gray-900">Low Stock Alert</h3>
          <router-link to="/products?low_stock=true" class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
            View all →
          </router-link>
        </div>
        
        <div v-if="lowStockProducts.length === 0" class="text-center py-8">
          <CheckCircle class="w-10 h-10 mx-auto mb-2 text-green-400" />
          <p class="text-sm font-medium text-gray-500">All products are well stocked!</p>
          <p class="text-xs text-gray-400 mt-1">No action needed</p>
        </div>
        
        <div class="space-y-2">
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="flex items-center justify-between p-3.5 bg-red-50/70 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ product.sku }}</p>
            </div>
            <div class="text-right ml-4 flex-shrink-0">
              <p class="text-lg font-bold text-red-600">{{ product.quantity }}</p>
              <p class="text-xs text-red-400">Min: {{ product.reorder_level }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useProductStore } from '@/stores/products'
import { Package, DollarSign, AlertTriangle, XCircle, CheckCircle } from 'lucide-vue-next'

const productStore = useProductStore()

const stats = ref({
  totalProducts: 0,
  totalValue: 0,
  lowStock: 0,
  outOfStock: 0,
})

const recentProducts = computed(() => productStore.products.slice(0, 5))
const lowStockProducts = computed(() => productStore.lowStockProducts.slice(0, 5))

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStockBadge = (product: any) => {
  if (product.quantity === 0) return 'badge-danger'
  if (product.quantity <= product.reorder_level) return 'badge-warning'
  return 'badge-success'
}

onMounted(async () => {
  await productStore.fetchProducts({ limit: 100 })
  stats.value = {
    totalProducts: productStore.total,
    totalValue: productStore.totalInventoryValue,
    lowStock: productStore.lowStockProducts.length,
    outOfStock: productStore.outOfStockProducts.length,
  }
})
</script>