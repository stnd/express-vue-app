<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  components: {
    Navbar
  },
  async created() {
    const authStore = useAuthStore()
    await authStore.checkAuth()
  }
}
</script>