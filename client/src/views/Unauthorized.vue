<template>
  <div class="max-w-md mx-auto mt-16 text-center">
    <div class="bg-red-50 border border-red-200 rounded-lg p-8">
      <div class="text-red-500 mb-4">
        <ExclamationTriangleIcon class="h-16 w-16 mx-auto" />
      </div>

      <h1 class="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>

      <p class="text-red-600 mb-6">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>

      <div class="space-x-4">
        <router-link to="/dashboard" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Dashboard
        </router-link>

        <router-link to="/"
          class="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
          Go Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    ExclamationTriangleIcon
  }
}
</script>