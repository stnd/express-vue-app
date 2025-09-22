<template>
  <div class="max-w-7xl mx-auto py-12 px-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-8">
        Welcome to the DB portal.
      </h1>
      <p class="text-xl gray-600text- mb-8">
        A collection of tools for visualizing and auditing data.
      </p>

      <div v-if="!authStore.isAuthenticated" class="space-x-4">
        <router-link to="/register" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Started
        </router-link>
        <router-link to="/login" class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
          Login
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <p class="text-lg text-green-600">
          Welcome back, {{ authStore.user.firstName }}!
        </p>
        <router-link to="/dashboard" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Go to Dashboard
        </router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mt-16 grid md:grid-cols-3 gap-8">
      <div class="text-center p-6 bg-white rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Role-Based Access</h3>
        <p class="text-gray-600">Different user roles with specific permissions and access levels</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Secure Authentication</h3>
        <p class="text-gray-600">Session-based authentication with password encryption</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Modern Stack</h3>
        <p class="text-gray-600">Built with Vue 3, Express, PostgreSQL, and Tailwind CSS</p>
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