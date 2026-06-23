<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('cancel')"></div>
      
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <div v-if="icon" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle class="h-6 w-6 text-red-600" />
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>

        <div class="mt-6 flex justify-center space-x-3">
          <button @click="$emit('cancel')" class="btn-secondary">
            {{ cancelText }}
          </button>
          <button @click="$emit('confirm')" :class="confirmButtonClass">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  icon?: boolean
  variant?: 'danger' | 'warning' | 'primary'
}>(), {
  title: 'Are you sure?',
  message: 'This action cannot be undone.',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  icon: true,
  variant: 'danger',
})

defineEmits(['confirm', 'cancel'])

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'btn-danger'
    case 'warning': return 'bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700'
    case 'primary': return 'btn-primary'
    default: return 'btn-primary'
  }
})
</script>