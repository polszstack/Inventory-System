<template>
  <MainLayout>
    <!-- Loading -->
    <div v-if="productStore.loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="spinner mx-auto mb-3" style="width: 2rem; height: 2rem; border-top-color: #2563eb; border-color: #e5e7eb;"></div>
        <p class="text-sm text-gray-500">Loading product...</p>
      </div>
    </div>

    <div v-else-if="product" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button @click="$router.back()" class="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1.5 group">
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Products
          </button>
          <h1 class="page-title">{{ product.name }}</h1>
          <p class="text-sm text-gray-400 mt-1 font-mono">SKU: {{ product.sku }}</p>
        </div>
        <div class="flex gap-2.5">
          <button @click="openAdjustModal" class="btn-secondary">
            <ArrowLeftRight class="w-4 h-4" />
            <span>Adjust Stock</span>
          </button>
          <button @click="editProduct" class="btn-primary">
            <Edit class="w-4 h-4" />
            <span>Edit Product</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Product Info (2/3 width) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Details Card -->
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-5">Product Information</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Category</dt>
                <dd class="text-sm font-medium text-gray-900">{{ product.category?.name || 'Uncategorized' }}</dd>
              </div>
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Status</dt>
                <dd>
                  <span :class="product.is_active ? 'badge-success' : 'badge-danger'">
                    {{ product.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </dd>
              </div>
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Unit Price</dt>
                <dd class="text-sm font-semibold text-gray-900">${{ Number(product.unit_price).toFixed(2) }}</dd>
              </div>
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Inventory Value</dt>
                <dd class="text-sm font-semibold text-gray-900">${{ (product.quantity * product.unit_price).toFixed(2) }}</dd>
              </div>
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Reorder Level</dt>
                <dd class="text-sm font-medium text-gray-900">{{ product.reorder_level }} units</dd>
              </div>
              <div class="bg-gray-50/50 rounded-xl p-3.5">
                <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Created</dt>
                <dd class="text-sm font-medium text-gray-900">{{ formatDate(product.created_at) }}</dd>
              </div>
            </dl>
            
            <!-- Description -->
            <div v-if="product.description" class="mt-5 pt-5 border-t border-gray-100">
              <dt class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Description</dt>
              <dd class="text-sm text-gray-600 leading-relaxed">{{ product.description }}</dd>
            </div>
          </div>

          <!-- Stock Level Card -->
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-5">Stock Level</h3>
            
            <div class="flex items-center gap-4 mb-5">
              <div class="text-5xl font-bold tracking-tight" :class="getStockColor(product)">
                {{ product.quantity }}
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-medium">Current Stock</p>
                <span :class="getStockBadge(product)">
                  {{ getStockStatus(product) }}
                </span>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                :class="getProgressColor(product)"
                :style="{ width: getStockPercentage(product) + '%' }"
              />
            </div>
            
            <div class="flex justify-between mt-2">
              <p class="text-xs text-gray-400">0</p>
              <p class="text-xs text-gray-400">Min: {{ product.reorder_level }}</p>
              <p class="text-xs text-gray-400">Max: {{ Math.max(product.quantity, product.reorder_level * 2) }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar (1/3 width) -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-2.5">
              <button @click="openAdjustModal" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium text-sm transition-colors">
                <ArrowLeftRight class="w-4 h-4 rotate-180" />
                Stock In
              </button>
              <button @click="openAdjustModal" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-medium text-sm transition-colors">
                <ArrowLeftRight class="w-4 h-4" />
                Stock Out
              </button>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            
            <div v-if="recentTransactions.length === 0" class="text-center py-6">
              <ArrowLeftRight class="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p class="text-sm text-gray-500">No transactions yet</p>
            </div>
            
            <div class="space-y-1.5">
              <div
                v-for="tx in recentTransactions"
                :key="tx.id"
                class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-2.5">
                  <span :class="tx.type === 'in' ? 'badge-success' : 'badge-danger'" class="text-xs">
                    {{ tx.type === 'in' ? '+' : '−' }}{{ tx.quantity }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDateShort(tx.created_at) }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">${{ Number(tx.unit_price).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProductFormModal
      v-if="showEditModal"
      :product="product"
      @close="showEditModal = false"
      @saved="onProductSaved"
    />
    <StockAdjustModal
      v-if="showAdjustModal"
      :product="product"
      @close="showAdjustModal = false"
      @saved="onProductSaved"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useProductStore } from '@/stores/products'
import { transactionService } from '@/services/transactionService'
import ProductFormModal from '@/components/products/ProductFormModal.vue'
import StockAdjustModal from '@/components/products/StockAdjustModal.vue'
import { ArrowLeft, ArrowLeftRight, Edit } from 'lucide-vue-next'

const route = useRoute()
const productStore = useProductStore()

const showEditModal = ref(false)
const showAdjustModal = ref(false)
const recentTransactions = ref<any[]>([])

const product = computed(() => productStore.selectedProduct)

const fetchProduct = async () => {
  const id = Number(route.params.id)
  await productStore.fetchProduct(id)
  await fetchTransactions(id)
}

const fetchTransactions = async (productId: number) => {
  try {
    const data = await transactionService.getByProduct(productId)
    recentTransactions.value = data.slice(0, 5)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

const editProduct = () => {
  showEditModal.value = true
}

const openAdjustModal = () => {
  showAdjustModal.value = true
}

const onProductSaved = () => {
  showEditModal.value = false
  showAdjustModal.value = false
  fetchProduct()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const getStockColor = (product: any) => {
  if (product.quantity === 0) return 'text-red-600'
  if (product.quantity <= product.reorder_level) return 'text-yellow-600'
  return 'text-green-600'
}

const getStockBadge = (product: any) => {
  if (product.quantity === 0) return 'badge-danger'
  if (product.quantity <= product.reorder_level) return 'badge-warning'
  return 'badge-success'
}

const getStockStatus = (product: any) => {
  if (product.quantity === 0) return 'Out of Stock'
  if (product.quantity <= product.reorder_level) return 'Low Stock'
  return 'In Stock'
}

const getStockPercentage = (product: any) => {
  const max = Math.max(product.quantity, product.reorder_level * 2)
  return Math.min((product.quantity / max) * 100, 100)
}

const getProgressColor = (product: any) => {
  if (product.quantity === 0) return 'bg-red-500'
  if (product.quantity <= product.reorder_level) return 'bg-yellow-500'
  return 'bg-green-500'
}

onMounted(() => {
  fetchProduct()
})
</script>