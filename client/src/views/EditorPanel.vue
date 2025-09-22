<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Editor Panel</h1>

    <!-- Content List -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">Content Management</h2>
        <button @click="showCreateForm = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Content
        </button>
      </div>

      <div v-if="loading" class="p-6">
        <p>Loading content...</p>
      </div>

      <div v-else-if="error" class="p-6 text-red-600">
        Error: {{ error }}
      </div>

      <div v-else-if="content.length === 0" class="p-6 text-gray-500">
        No content available
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in content" :key="item.id">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.title }}</td>
              <td class="px-6 py-4">
                <span
                  :class="item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="inline-block px-2 py-1 rounded-full text-xs">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button @click="editContent(item)" class="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button @click="deleteContent(item.id)" class="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showCreateForm || editingContent" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ editingContent ? 'Edit Content' : 'Create New Content' }}
      </h3>

      <form @submit.prevent="saveContent" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="contentForm.title" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea v-model="contentForm.body" rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="contentForm.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div class="flex space-x-4">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {{ editingContent ? 'Update' : 'Create' }}
          </button>
          <button type="button" @click="cancelEdit"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const content = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showCreateForm = ref(false)
    const editingContent = ref(null)

    const contentForm = reactive({
      title: '',
      body: '',
      status: 'draft'
    })

    const fetchContent = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/editor/content')
        content.value = response.data.content || []
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to fetch content'
      } finally {
        loading.value = false
      }
    }

    const editContent = (item) => {
      editingContent.value = item
      contentForm.title = item.title
      contentForm.body = item.body || ''
      contentForm.status = item.status
      showCreateForm.value = false
    }

    const saveContent = async () => {
      try {
        if (editingContent.value) {
          await axios.put(`/api/editor/content/${editingContent.value.id}`, contentForm)
        } else {
          await axios.post('/api/editor/content', contentForm)
        }

        await fetchContent()
        cancelEdit()
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to save content')
      }
    }

    const deleteContent = async (id) => {
      if (confirm('Are you sure you want to delete this content?')) {
        try {
          await axios.delete(`/api/editor/content/${id}`)
          await fetchContent()
        } catch (err) {
          alert(err.response?.data?.error || 'Failed to delete content')
        }
      }
    }

    const cancelEdit = () => {
      showCreateForm.value = false
      editingContent.value = null
      contentForm.title = ''
      contentForm.body = ''
      contentForm.status = 'draft'
    }

    onMounted(fetchContent)

    return {
      content,
      loading,
      error,
      showCreateForm,
      editingContent,
      contentForm,
      editContent,
      saveContent,
      deleteContent,
      cancelEdit
    }
  }
}
</script>