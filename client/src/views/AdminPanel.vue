<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

    <!-- Users Management -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold">Users Management</h2>
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
                  <span @click="console.log(user.Roles)" v-for="role in user.Roles" :key="role.id"
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
                <select @change="assignRole(user.id, $event.target.value)"
                  class="text-sm border border-gray-300 rounded px-2 py-1">
                  <option value="">Assign Role</option>
                  <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Roles Management -->
    <div class="bg-white rounded-lg shadow overflow-hidden mt-8">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold">Available Roles</h2>
      </div>
      <div class="p-6">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="role in availableRoles" :key="role.id" class="border rounded-lg p-4">
            <h3 class="font-medium text-lg">{{ role.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ role.description }}</p>
            <div class="text-xs">
              <span class="font-medium">Permissions:</span>
              <div class="mt-1">
                <span v-for="permission in role.permissions" :key="permission"
                  class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1 mb-1">
                  {{ permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
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
    const availableRoles = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchUsers = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/admin/users')
        users.value = response.data.users
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to fetch users'
      } finally {
        loading.value = false
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/admin/roles')
        availableRoles.value = response.data.roles
      } catch (err) {
        console.error('Failed to fetch roles:', err)
      }
    }

    const assignRole = async (userId, roleId) => {
      if (!roleId) return

      try {
        await axios.post(`/api/admin/users/${userId}/roles`, { roleId: parseInt(roleId) })
        await fetchUsers() // Refresh users list
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to assign role')
      }
    }

    onMounted(() => {
      fetchUsers()
      fetchRoles()
    })

    return {
      users,
      availableRoles,
      loading,
      error,
      assignRole
    }
  }
}
</script>