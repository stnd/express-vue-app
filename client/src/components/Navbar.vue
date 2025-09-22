<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <!-- <router-link to="/" class="text-xl font-bold text-grey-800"> -->
          <!-- <router-link to="/" class="text-xl font-semibold tracking-tight" style="color: var(--color-primary);"> -->
          <router-link to="/" class="text-2xl font-bold tracking-wide text-primary">
            DB Portal
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-4">
          <!-- Public Links -->
          <router-link to="/" class="text-primary hover:text-secondary font-medium">
            Home
          </router-link>

          <!-- Authenticated Links -->
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="text-primary hover:text-secondary font-medium">
              Dashboard
            </router-link>

            <!-- Role-based Links -->
            <router-link v-if="authStore.hasAnyRole(['admin', 'manager', 'editor'])" to="/editor"
              class="text-primary hover:text-secondary font-medium">
              Editor
            </router-link>

            <router-link v-if="authStore.hasAnyRole(['admin', 'manager'])" to="/manager"
              class="text-primary hover:text-secondary font-medium">
              Manager
            </router-link>

            <router-link v-if="authStore.hasRole('admin')" to="/admin"
              class="text-primary hover:text-secondary font-medium">
              Admin
            </router-link>

            <!-- User Menu -->
            <div class="relative">
              <button @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-primary hover:text-secondary font-medium">
                <UserCircleIcon class="h-6 w-6" />
                <span>{{ authStore.user.firstName }}</span>
                <ChevronDownIcon class="h-4 w-4" />
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                @click="showUserMenu = false">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </router-link>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </template>

          <!-- Guest Links -->
          <template v-else>
            <router-link to="/login" class="bg-accent text-white px-4 py-2 rounded hover:bg-secondary">
              Login
            </router-link>
            <!-- <router-link to="/login" class="text-gray-700 hover:text-blue-600">
              Login
            </router-link> -->
            <!-- <router-link to="/register" class="bg-accent text-white px-4 py-2 rounded hover:bg-secondary">
              Register
            </router-link> -->
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserCircleIcon,
    ChevronDownIcon
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const showUserMenu = ref(false)

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/')
    }

    return {
      authStore,
      showUserMenu,
      handleLogout
    }
  }
}
</script>