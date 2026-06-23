<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-100">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? 'Edit Product' : 'Create Product' }}
          </h3>
          <button @click="$emit('close')" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- SKU -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                SKU <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.sku"
                type="text"
                required
                :disabled="isEditing"
                class="input-field font-mono"
                :class="{ 'opacity-60 bg-gray-50': isEditing }"
                placeholder="PROD-001"
              />
            </div>

            <!-- Name -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Product Name <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input-field"
                placeholder="Product name"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select v-model="form.category_id" class="input-field">
                <option :value="undefined">No Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Unit Price -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Unit Price $ <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium"></span>
                <input
                  v-model.number="form.unit_price"
                  type="number"
                  required
                  step="0.01"
                  min=""
                  class="input-field pl-8"
                  placeholder=""
                />
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Initial Quantity
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="0"
                class="input-field"
                placeholder="0"
              />
            </div>

            <!-- Reorder Level -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Reorder Level
              </label>
              <input
                v-model.number="form.reorder_level"
                type="number"
                min="0"
                class="input-field"
                placeholder="10"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="input-field resize-none"
              placeholder="Product description..."
            ></textarea>
          </div>

          <!-- Active Status -->
          <label class="flex items-center cursor-pointer bg-gray-50/70 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="ml-3">
              <span class="text-sm font-medium text-gray-900">Active</span>
              <p class="text-xs text-gray-400 mt-0.5">Product will be visible in inventory</p>
            </div>
          </label>

          <!-- Error Message -->
          <div v-if="error" class="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="btn-primary">
              <span v-if="loading" class="spinner mr-2"></span>
              <span>{{ isEditing ? 'Update Product' : 'Create Product' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { categoryService } from '@/services/categoryService'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  product?: any
}>()

const emit = defineEmits(['close', 'saved'])

const productStore = useProductStore()
const loading = ref(false)
const error = ref<string | null>(null)
const categories = ref<any[]>([])

const isEditing = computed(() => !!props.product)

const form = ref({
  sku: '',
  name: '',
  description: '',
  category_id: undefined as number | undefined,
  quantity: 0,
  unit_price: 0,
  reorder_level: 10,
  is_active: true,
})

if (props.product) {
  form.value = {
    sku: props.product.sku,
    name: props.product.name,
    description: props.product.description || '',
    category_id: props.product.category_id,
    quantity: props.product.quantity,
    unit_price: props.product.unit_price,
    reorder_level: props.product.reorder_level,
    is_active: props.product.is_active,
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response.data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (isEditing.value) {
      const { sku, ...updateData } = form.value
      await productStore.updateProduct(props.product.id, updateData)
    } else {
      await productStore.createProduct(form.value as any)
    }
    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save product'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>