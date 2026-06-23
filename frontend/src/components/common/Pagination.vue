<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn-secondary text-sm"
      >
        Previous
      </button>
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn-secondary text-sm"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('page-change', page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === currentPage
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
  limit?: number
}>()

defineEmits(['page-change'])

const startItem = computed(() => {
  return ((props.currentPage - 1) * (props.limit || 10)) + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * (props.limit || 10), props.total)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>