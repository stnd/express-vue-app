<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Personal Information</h2>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input v-model="profileForm.firstName" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!editing" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input v-model="profileForm.lastName" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="!editing" />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input v-model="profileForm.username" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" disabled />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="profileForm.email" type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" disabled />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Your Roles</label>
          <div class="space-x-2">
            <span v-for="role in authStore.user.roles" :key="role.id"
              class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {{ role.name }}
            </span>
          </div>
        </div>

        <div class="flex space-x-4">
          <button v-if="!editing" @click="editing = true"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit Profile
          </button>

          <template v-else>
            <button @click="saveProfile" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save Changes
            </button>
            <button @click="cancelEdit" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-lg shadow p-6 mt-8">
      <h2 class="text-xl font-semibold mb-4">Change Password</h2>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input v-model="passwordForm.currentPassword" type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input v-model="passwordForm.newPassword" type="password" minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input v-model="passwordForm.confirmPassword" type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Change Password
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const editing = ref(false)

    const profileForm = reactive({
      firstName: authStore.user.firstName,
      lastName: authStore.user.lastName,
      username: authStore.user.username,
      email: authStore.user.email
    })

    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const saveProfile = () => {
      // In a real app, you'd make an API call here
      console.log('Saving profile:', profileForm)
      editing.value = false
    }

    const cancelEdit = () => {
      // Reset form
      profileForm.firstName = authStore.user.firstName
      profileForm.lastName = authStore.user.lastName
      editing.value = false
    }

    const changePassword = () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      // In a real app, you'd make an API call here
      console.log('Changing password')

      // Reset form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }

    return {
      authStore,
      editing,
      profileForm,
      passwordForm,
      saveProfile,
      cancelEdit,
      changePassword
    }
  }
}
</script>