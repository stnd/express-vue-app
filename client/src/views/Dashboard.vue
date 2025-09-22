<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome, {{ authStore.user.firstName }}!
      </h1>
      <p class="text-gray-600 mt-2">
        Your dashboard - access level based on your roles
      </p>
    </div>

    <!-- User Info Card -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Your Information</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <p><span class="font-medium">Name:</span> {{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
          <p><span class="font-medium">Username:</span> {{ authStore.user.username }}</p>
          <p><span class="font-medium">Email:</span> {{ authStore.user.email }}</p>
        </div>
        <div>
          <p class="font-medium mb-2">Your Roles:</p>
          <div class="space-x-2">
            <span v-for="role in authStore.user.roles" :key="role.id"
              class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {{ role.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Editor Panel -->
      <div v-if="authStore.hasAnyRole(['admin', 'manager', 'editor'])"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-lg font-semibold mb-2">Content Management</h3>
        <p class="text-gray-600 mb-4">Create and edit content</p>
        <router-link to="/editor" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Go to Editor
        </router-link>
      </div>

      <!-- Manager Panel -->
      <div v-if="authStore.hasAnyRole(['admin', 'manager'])"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-lg font-semibold mb-2">User Management</h3>
        <p class="text-gray-600 mb-4">Manage user accounts</p>
        <router-link to="/manager" class="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Go to Manager
        </router-link>
      </div>

      <!-- Admin Panel -->
      <div v-if="authStore.hasRole('admin')" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-lg font-semibold mb-2">System Administration</h3>
        <p class="text-gray-600 mb-4">Full system control</p>
        <router-link to="/admin" class="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Go to Admin
        </router-link>
      </div>

      <!-- Profile -->
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-lg font-semibold mb-2">Profile Settings</h3>
        <p class="text-gray-600 mb-4">Update your profile information</p>
        <router-link to="/profile" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Profile
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>
