import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/productService'
import type { Product, ProductFilters, CreateProductDTO, UpdateProductDTO } from '@/types'

export const useProductStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const filters = ref<ProductFilters>({
    page: 1,
    limit: 10,
  })

  // Getters
  const lowStockProducts = computed(() => 
    products.value.filter(p => p.quantity <= p.reorder_level)
  )

  const outOfStockProducts = computed(() => 
    products.value.filter(p => p.quantity === 0)
  )

  const totalInventoryValue = computed(() => 
    products.value.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0)
  )

  // Actions
  const fetchProducts = async (params?: ProductFilters) => {
    loading.value = true
    error.value = null
    
    if (params) {
      filters.value = { ...filters.value, ...params }
    }
    
    try {
      const response = await productService.getAll(filters.value)
      products.value = response.data
      total.value = response.meta.total
      currentPage.value = response.meta.page
      totalPages.value = response.meta.totalPages
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      selectedProduct.value = await productService.getById(id)
      return selectedProduct.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data: CreateProductDTO) => {
    loading.value = true
    error.value = null
    try {
      const product = await productService.create(data)
      await fetchProducts()
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: number, data: UpdateProductDTO) => {
    loading.value = true
    error.value = null
    try {
      const product = await productService.update(id, data)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = product
      }
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await productService.delete(id)
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLowStock = async () => {
    try {
      return await productService.getLowStock()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch low stock products'
      throw err
    }
  }

  return {
    products,
    selectedProduct,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    filters,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchLowStock,
  }
})