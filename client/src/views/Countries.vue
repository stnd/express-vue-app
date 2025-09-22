<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Countries Panel</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold">Country Management</h2>
      </div>

      <div v-if="loading" class="p-6">
        <p>Loading countries...</p>
      </div>

      <div v-else-if="error" class="p-6 text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital City</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Population</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="country in countries" :key="country.name">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ country.name }}
                  </div>
                  <div class="text-sm text-gray-500">{{ country.official }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ country.capital }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ country.population }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ country.region }}</td>
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
    const countries = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchCountries = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/countries/countries')
        countries.value = response.data.countries
      } catch  (err)  {
        error.value = err.response?.data?.error || 'Failed to fetch countries'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchCountries)

    return {
      countries,
      loading,
      error
    }
  }
}
</script>
