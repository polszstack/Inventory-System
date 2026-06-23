<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Adjust Stock</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Current Stock Info -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ product?.name }}</p>
              <p class="text-xs text-gray-500">SKU: {{ product?.sku }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold" :class="getStockColor">
                {{ product?.quantity }}
              </p>
              <p class="text-xs text-gray-500">Current Stock</p>
            </div>
          </div>
        </div>

        <!-- Adjustment Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Adjustment Type
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.type = 'in'"
                :class="[
                  'p-3 rounded-lg border-2 text-center transition-all',
                  form.type === 'in'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <ArrowDown class="w-6 h-6 mx-auto mb-1" />
                <span class="text-sm font-medium">Stock In</span>
              </button>
              <button
                type="button"
                @click="form.type = 'out'"
                :class="[
                  'p-3 rounded-lg border-2 text-center transition-all',
                  form.type === 'out'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <ArrowUp class="w-6 h-6 mx-auto mb-1" />
                <span class="text-sm font-medium">Stock Out</span>
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              v-model.number="form.quantity"
              type="number"
              required
              min="1"
              :max="form.type === 'out' ? product?.quantity : undefined"
              class="input-field"
              placeholder="Enter quantity"
            />
            <p v-if="form.type === 'out'" class="text-xs text-gray-500 mt-1">
              Maximum available: {{ product?.quantity }}
            </p>
          </div>

          <!-- Reference -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Reference
            </label>
            <input
              v-model="form.reference"
              type="text"
              class="input-field"
              placeholder="Order number, reason, etc."
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="input-field"
              placeholder="Additional notes..."
            ></textarea>
          </div>

          <!-- Preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Current Stock:</span>
              <span class="font-medium">{{ product?.quantity }}</span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span :class="form.type === 'in' ? 'text-green-600' : 'text-red-600'">
                {{ form.type === 'in' ? '+' : '-' }}{{ form.quantity || 0 }}
              </span>
            </div>
            <div class="flex justify-between text-sm font-bold mt-1 pt-1 border-t">
              <span>New Stock:</span>
              <span :class="getNewStockColor">
                {{ newStock }}
              </span>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="$emit('close')" class="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !form.quantity"
              :class="form.type === 'in' ? 'btn-primary' : 'btn-danger'"
            >
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 inline animate-spin" />
              {{ form.type === 'in' ? 'Add Stock' : 'Remove Stock' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import { X, ArrowUp, ArrowDown, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  product: any
}>()

const emit = defineEmits(['close', 'saved'])

const productStore = useProductStore()
const loading = ref(false)
const error = ref<string | null>(null)

const form = ref({
  type: 'in' as 'in' | 'out',
  quantity: 0,
  reference: '',
  notes: '',
})

const newStock = computed(() => {
  if (!form.value.quantity) return props.product?.quantity || 0
  if (form.value.type === 'in') {
    return (props.product?.quantity || 0) + form.value.quantity
  } else {
    return (props.product?.quantity || 0) - form.value.quantity
  }
})

const getStockColor = computed(() => {
  if (!props.product) return 'text-gray-900'
  if (props.product.quantity === 0) return 'text-red-600'
  if (props.product.quantity <= props.product.reorder_level) return 'text-yellow-600'
  return 'text-green-600'
})

const getNewStockColor = computed(() => {
  if (newStock.value <= 0) return 'text-red-600'
  if (newStock.value <= (props.product?.reorder_level || 10)) return 'text-yellow-600'
  return 'text-green-600'
})

const handleSubmit = async () => {
  if (!form.value.quantity) return

  loading.value = true
  error.value = null

  try {
    const { quantity, type, reference, notes } = form.value
    
    // Create transaction
    const { transactionService } = await import('@/services/transactionService')
    await transactionService.create({
      product_id: props.product.id,
      type,
      quantity,
      reference,
      notes,
    })

    emit('saved')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to adjust stock'
  } finally {
    loading.value = false
  }
}
</script>