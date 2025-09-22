<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Manager Panel</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold">User Management</h2>
      </div>

      <div v-if="loading" class="p-6">
        <p>Loading users...</p>
      </div>

      <div v-else-if="error" class="p-6 text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ user.username }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="role in user.Roles" :key="role.id"
                    class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {{ role.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-block px-2 py-1 rounded-full text-xs">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="toggleUserStatus(user.id)"
                  :class="user.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                  class="text-white px-3 py-1 rounded text-sm">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchUsers = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/manager/users')
        users.value = response.data.users
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to fetch users'
      } finally {
        loading.value = false
      }
    }

    const toggleUserStatus = async (userId) => {
      try {
        await axios.patch(`/api/manager/users/${userId}/status`)
        await fetchUsers() // Refresh users list
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to update user status')
      }
    }

    onMounted(fetchUsers)

    return {
      users,
      loading,
      error,
      toggleUserStatus
    }
  }
}
</script>
