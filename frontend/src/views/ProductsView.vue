<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 class="page-title">Products</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your inventory items</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary mt-4 sm:mt-0">
        <Plus class="w-4 h-4" />
        <span>Add Product</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 mb-6 border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Search</label>
          <input
            v-model="searchQuery"
            @input="onSearch"
            type="text"
            placeholder="Search products..."
            class="input-field"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
          <select v-model="filters.category_id" @change="onFilter" class="input-field">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
          <select v-model="filters.is_active" @change="onFilter" class="input-field">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors w-full">
            <input
              v-model="filters.low_stock"
              @change="onFilter"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2.5 text-sm text-gray-700 font-medium">Low Stock Only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productStore.loading">
              <td colspan="7" class="text-center py-12">
                <div class="spinner mx-auto mb-3" style="border-top-color: #2563eb; border-color: #e5e7eb;"></div>
                <p class="text-sm text-gray-500">Loading products...</p>
              </td>
            </tr>
            <tr v-else-if="productStore.products.length === 0">
              <td colspan="7">
                <div class="empty-state">
                  <Package class="empty-state-icon" />
                  <p class="text-sm font-medium text-gray-500">No products found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or add a new product</p>
                </div>
              </td>
            </tr>
            <tr
              v-for="product in productStore.products"
              :key="product.id"
            >
              <td class="text-sm font-mono text-gray-500">{{ product.sku }}</td>
              <td>
                <router-link :to="`/products/${product.id}`" class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {{ product.name }}
                </router-link>
                <div class="text-xs text-gray-400 mt-0.5">{{ product.description?.substring(0, 60) }}{{ product.description?.length > 60 ? '...' : '' }}</div>
              </td>
              <td class="text-sm text-gray-500">
                {{ product.category?.name || '—' }}
              </td>
              <td>
                <span :class="getStockBadge(product)" class="inline-flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStockDot(product)"></span>
                  {{ product.quantity }}
                </span>
              </td>
              <td class="text-sm font-medium text-gray-900">${{ Number(product.unit_price).toFixed(2) }}</td>
              <td>
                <span :class="product.is_active ? 'badge-success' : 'badge-danger'">
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    @click="openAdjustModal(product)" 
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Adjust Stock"
                  >
                    <ArrowLeftRight class="w-4 h-4" />
                  </button>
                  <button 
                    @click="editProduct(product)" 
                    class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleDelete(product.id)" 
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="productStore.totalPages > 1" class="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-t border-gray-100">
        <p class="text-sm text-gray-500">
          Showing {{ ((productStore.currentPage - 1) * 10) + 1 }}–{{ Math.min(productStore.currentPage * 10, productStore.total) }} of {{ productStore.total }} results
        </p>
        <div class="flex gap-2">
          <button
            @click="changePage(productStore.currentPage - 1)"
            :disabled="productStore.currentPage === 1"
            class="btn-secondary text-sm py-1.5 px-3"
          >
            Previous
          </button>
          <button
            @click="changePage(productStore.currentPage + 1)"
            :disabled="productStore.currentPage === productStore.totalPages"
            class="btn-secondary text-sm py-1.5 px-3"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Product Modal -->
    <ProductFormModal
      v-if="showCreateModal || showEditModal"
      :product="editingProduct"
      @close="closeModals"
      @saved="onProductSaved"
    />

    <!-- Stock Adjustment Modal -->
    <StockAdjustModal
      v-if="showAdjustModal"
      :product="adjustingProduct"
      @close="showAdjustModal = false"
      @saved="onProductSaved"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useProductStore } from '@/stores/products'
import { categoryService } from '@/services/categoryService'
import { Plus, ArrowLeftRight, Edit, Trash2, Package } from 'lucide-vue-next'

import ProductFormModal from '@/components/products/ProductFormModal.vue'
import StockAdjustModal from '@/components/products/StockAdjustModal.vue'

const productStore = useProductStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAdjustModal = ref(false)
const editingProduct = ref(null)
const adjustingProduct = ref(null)
const searchQuery = ref('')
const categories = ref<any[]>([])

const filters = ref({
  category_id: '',
  is_active: '',
  low_stock: false,
})

let searchTimeout: any

const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    productStore.fetchProducts({ search: searchQuery.value || undefined, page: 1 })
  }, 300)
}

const onFilter = () => {
  productStore.fetchProducts({
    category_id: filters.value.category_id ? Number(filters.value.category_id) : undefined,
    is_active: filters.value.is_active === '' ? undefined : filters.value.is_active === 'true',
    low_stock: filters.value.low_stock,
    page: 1,
  })
}

const changePage = (page: number) => {
  productStore.fetchProducts({ page })
}

const editProduct = (product: any) => {
  editingProduct.value = product
  showEditModal.value = true
}

const openAdjustModal = (product: any) => {
  adjustingProduct.value = product
  showAdjustModal.value = true
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingProduct.value = null
}

const onProductSaved = () => {
  closeModals()
  showAdjustModal.value = false
  productStore.fetchProducts()
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(id)
  }
}

const getStockBadge = (product: any) => {
  if (product.quantity === 0) return 'badge-danger'
  if (product.quantity <= product.reorder_level) return 'badge-warning'
  return 'badge-success'
}

const getStockDot = (product: any) => {
  if (product.quantity === 0) return 'bg-red-500'
  if (product.quantity <= product.reorder_level) return 'bg-yellow-500'
  return 'bg-green-500'
}

onMounted(async () => {
  await productStore.fetchProducts()
  try {
    const response = await categoryService.getAll()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
})
</script>