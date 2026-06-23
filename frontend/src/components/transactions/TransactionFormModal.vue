<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-8">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">New Transaction</h3>
          <button @click="$emit('close')" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Product Selection -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Product <span class="text-red-400">*</span>
            </label>
            <select
              v-model="form.product_id"
              required
              class="input-field"
              @change="onProductSelect"
            >
              <option value="">Select a product</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }} ({{ product.sku }}) — Stock: {{ product.quantity }}
              </option>
            </select>
          </div>

          <!-- Transaction Type -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Transaction Type <span class="text-red-400">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.type = 'in'"
                :class="[
                  'p-4 rounded-xl border-2 text-center transition-all duration-200',
                  form.type === 'in'
                    ? 'border-green-400 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500'
                ]"
              >
                <ArrowDown class="w-6 h-6 mx-auto mb-1.5" />
                <span class="text-sm font-semibold">Stock In</span>
              </button>
              <button
                type="button"
                @click="form.type = 'out'"
                :class="[
                  'p-4 rounded-xl border-2 text-center transition-all duration-200',
                  form.type === 'out'
                    ? 'border-red-400 bg-red-50 text-red-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500'
                ]"
              >
                <ArrowUp class="w-6 h-6 mx-auto mb-1.5" />
                <span class="text-sm font-semibold">Stock Out</span>
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Quantity <span class="text-red-400">*</span>
            </label>
            <input
              v-model.number="form.quantity"
              type="number"
              required
              min="1"
              :max="form.type === 'out' ? selectedProduct?.quantity : undefined"
              class="input-field"
              placeholder="Enter quantity"
            />
            <p v-if="selectedProduct" class="text-xs text-gray-400 mt-1.5">
              Current stock: <span class="font-medium text-gray-600">{{ selectedProduct.quantity }}</span> 
              <span class="mx-1.5">•</span> 
              Price: <span class="font-medium text-gray-600">${{ Number(selectedProduct.unit_price).toFixed(2) }}</span>
            </p>
          </div>

          <!-- Unit Price -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Unit Price $
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium"></span>
              <input
                v-model.number="form.unit_price"
                type="number"
                step="0.01"
                min="0"
                class="input-field pl-8"
                :placeholder="selectedProduct?.unit_price?.toString() || '0.00'"
              />
            </div>
          </div>

          <!-- Reference -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Reference
            </label>
            <input
              v-model="form.reference"
              type="text"
              class="input-field"
              placeholder="Order number, PO number, etc."
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="input-field resize-none"
              placeholder="Additional notes..."
            ></textarea>
          </div>

          <!-- Total Preview -->
          <div v-if="form.quantity && form.unit_price" class="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-blue-700">Transaction Total</span>
              <span class="text-xl font-bold text-blue-700">
                ${{ (form.quantity * form.unit_price).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Error -->
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
            <button
              type="submit"
              :disabled="loading || !form.product_id || !form.quantity"
              class="btn-primary"
            >
              <span v-if="loading" class="spinner mr-2"></span>
              <span>Create Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { transactionService } from '@/services/transactionService'
import { X, ArrowUp, ArrowDown } from 'lucide-vue-next'

const emit = defineEmits(['close', 'saved'])

const productStore = useProductStore()
const loading = ref(false)
const error = ref<string | null>(null)
const products = ref<any[]>([])

const form = ref({
  product_id: '',
  type: 'in' as 'in' | 'out',
  quantity: 0,
  unit_price: 0,
  reference: '',
  notes: '',
})

const selectedProduct = ref<any>(null)

const onProductSelect = () => {
  const product = products.value.find(p => p.id === Number(form.value.product_id))
  selectedProduct.value = product
  if (product) {
    form.value.unit_price = product.unit_price
  }
}

const fetchProducts = async () => {
  try {
    await productStore.fetchProducts({ limit: 1000 })
    products.value = productStore.products.filter(p => p.is_active)
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await transactionService.create({
      product_id: Number(form.value.product_id),
      type: form.value.type,
      quantity: form.value.quantity,
      unit_price: form.value.unit_price || undefined,
      reference: form.value.reference || undefined,
      notes: form.value.notes || undefined,
    })
    
    await productStore.fetchProducts()
    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create transaction'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>