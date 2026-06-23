<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 class="page-title">Transactions</h2>
        <p class="text-sm text-gray-500 mt-1">Track all stock movements</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary mt-4 sm:mt-0">
        <Plus class="w-4 h-4" />
        <span>New Transaction</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 mb-6 border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Type</label>
          <select v-model="filters.type" @change="fetchTransactions" class="input-field">
            <option :value="undefined">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
          <select v-model="filters.status" @change="fetchTransactions" class="input-field">
            <option :value="undefined">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Start Date</label>
          <input
            v-model="filters.start_date"
            @change="fetchTransactions"
            type="date"
            class="input-field"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">End Date</label>
          <input
            v-model="filters.end_date"
            @change="fetchTransactions"
            type="date"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="text-center py-12">
                <div class="spinner mx-auto mb-3" style="border-top-color: #2563eb; border-color: #e5e7eb;"></div>
                <p class="text-sm text-gray-500">Loading transactions...</p>
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0">
              <td colspan="9">
                <div class="empty-state">
                  <ArrowLeftRight class="empty-state-icon" />
                  <p class="text-sm font-medium text-gray-500">No transactions found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              </td>
            </tr>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="text-sm font-mono text-gray-500">#{{ tx.id }}</td>
              <td>
                <div class="text-sm font-medium text-gray-900">{{ tx.product?.name }}</div>
                <div class="text-xs text-gray-400">{{ tx.product?.sku }}</div>
              </td>
              <td>
                <span :class="tx.type === 'in' ? 'badge-success' : 'badge-danger'" class="flex items-center gap-1 w-fit">
                  <span class="text-xs">{{ tx.type === 'in' ? '↑' : '↓' }}</span>
                  {{ tx.type === 'in' ? 'Stock In' : 'Stock Out' }}
                </span>
              </td>
              <td class="text-sm font-medium text-gray-900">{{ tx.quantity }}</td>
              <td class="text-sm text-gray-600">${{ Number(tx.unit_price).toFixed(2) }}</td>
              <td class="text-sm font-semibold text-gray-900">${{ (tx.quantity * tx.unit_price).toFixed(2) }}</td>
              <td>
                <span :class="getStatusBadge(tx.status)">
                  {{ tx.status }}
                </span>
              </td>
              <td class="text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(tx.created_at) }}
              </td>
              <td class="text-right">
                <button
                  v-if="tx.status !== 'cancelled'"
                  @click="cancelTransaction(tx.id)"
                  class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Transaction Modal -->
    <TransactionFormModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @saved="onTransactionSaved"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { transactionService } from '@/services/transactionService'
import TransactionFormModal from '@/components/transactions/TransactionFormModal.vue'
import { Plus, ArrowLeftRight } from 'lucide-vue-next'

const transactions = ref<any[]>([])
const loading = ref(false)
const showCreateModal = ref(false)

const filters = ref({
  type: undefined as undefined | 'in' | 'out',
  status: undefined as undefined | 'completed' | 'pending' | 'cancelled',
  start_date: '',
  end_date: '',
  page: 1,
  limit: 10,
})

const fetchTransactions = async () => {
  loading.value = true
  try {
    const response = await transactionService.getAll(filters.value)
    transactions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  } finally {
    loading.value = false
  }
}

const cancelTransaction = async (id: number) => {
  if (confirm('Are you sure you want to cancel this transaction?')) {
    try {
      await transactionService.cancel(id)
      await fetchTransactions()
    } catch (error) {
      console.error('Failed to cancel transaction:', error)
    }
  }
}

const onTransactionSaved = () => {
  showCreateModal.value = false
  fetchTransactions()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'pending': return 'badge-warning'
    case 'cancelled': return 'badge-danger'
    default: return 'badge-info'
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>