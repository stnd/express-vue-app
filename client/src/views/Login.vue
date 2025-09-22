<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-primary">Login</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <!-- <input v-model="form.email" type="email" required -->
        <input v-model="form.email" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="Enter your email" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input v-model="form.password" type="password" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="Enter your password" />
      </div>

      <button type="submit" :disabled="authStore.loading"
        class="w-full bg-accent text-white py-2 px-4 rounded-md hover:bg-secondary disabled:opacity-50 cursor-pointer">
        {{ authStore.loading ? 'Logging in...' : 'Login' }}
      </button>

    </form>

    <div v-if="authStore.error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ authStore.error }}
    </div>

    <!-- <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account?
      <router-link to="/register" class="text-blue-600 hover:underline">
        Register here
      </router-link>
    </p> -->
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const form = reactive({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      authStore.clearError()
      const result = await authStore.login(form)

      if (result.success) {
        router.push('/dashboard')
      }
    }

    return {
      authStore,
      form,
      handleLogin
    }
  }
}
</script>