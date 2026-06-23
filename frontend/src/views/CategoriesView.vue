<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 class="page-title">Categories</h2>
        <p class="text-sm text-gray-500 mt-1">Organize your products</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary mt-4 sm:mt-0">
        <Plus class="w-4 h-4" />
        <span>Add Category</span>
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold text-gray-900 truncate">{{ category.name }}</h3>
            <p class="text-sm text-gray-400 mt-1 line-clamp-2">{{ category.description || 'No description' }}</p>
          </div>
          <div class="flex items-center gap-1 ml-3 flex-shrink-0">
            <button 
              @click="editCategory(category)" 
              class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit Category"
            >
              <Edit class="w-4 h-4" />
            </button>
            <button 
              @click="handleDelete(category.id)" 
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Category"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500 uppercase tracking-wider font-medium">Products</span>
            <span class="text-lg font-bold text-gray-900">{{ category.products?.length || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="col-span-full">
        <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 text-center">
          <FolderTree class="w-14 h-14 mx-auto mb-3 text-gray-300" />
          <p class="text-base font-medium text-gray-500">No categories found</p>
          <p class="text-sm text-gray-400 mt-1 mb-5">Create categories to organize your products</p>
          <button @click="showCreateModal = true" class="btn-primary mx-auto">
            <Plus class="w-4 h-4" />
            <span>Create your first category</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="closeModals"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingCategory ? 'Edit Category' : 'Create Category' }}
            </h3>
            <button @click="closeModals" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                class="input-field" 
                placeholder="Category name"
                autofocus
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea 
                v-model="form.description" 
                rows="3" 
                class="input-field"
                placeholder="Optional description"
              ></textarea>
            </div>
            
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModals" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">
                {{ editingCategory ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { categoryService } from '@/services/categoryService'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-vue-next'

const categories = ref<any[]>([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref<any>(null)

const form = ref({
  name: '',
  description: '',
})

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const editCategory = (category: any) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
  }
  showEditModal.value = true
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  form.value = { name: '', description: '' }
}

const handleSubmit = async () => {
  try {
    if (editingCategory.value) {
      await categoryService.update(editingCategory.value.id, form.value)
    } else {
      await categoryService.create(form.value)
    }
    closeModals()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await categoryService.delete(id)
      await fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Cannot delete category with associated products')
    }
  }
}

onMounted(() => {
  fetchCategories()
})
</script>