<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input v-model="form.firstName" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input v-model="form.lastName" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input v-model="form.username" type="text" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input v-model="form.email" type="email" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input v-model="form.password" type="password" required minlength="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button type="submit" :disabled="authStore.loading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {{ authStore.loading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <div v-if="authStore.error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ authStore.error }}
    </div>

    <div v-if="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>

    <p class="mt-4 text-center text-sm text-gray-600">
      Already have an account?
      <router-link to="/login" class="text-blue-600 hover:underline">
        Login here
      </router-link>
    </p>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const successMessage = ref('')

    const form = reactive({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    })

    const handleRegister = async () => {
      authStore.clearError()
      successMessage.value = ''

      const result = await authStore.register(form)

      if (result.success) {
        successMessage.value = 'Registration successful! You can now log in.'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    }

    return {
      authStore,
      form,
      successMessage,
      handleRegister
    }
  }
}
</script>
