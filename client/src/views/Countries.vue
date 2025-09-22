<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Countries Panel</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold mb-4">Country Management</h2>
        
        <!-- Filter Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="countryFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Filter by Country Name
            </label>
            <input
              id="countryFilter"
              v-model="filters.country"
              type="text"
              placeholder="Search countries..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label for="capitalFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Filter by Capital City
            </label>
            <input
              id="capitalFilter"
              v-model="filters.capital"
              type="text"
              placeholder="Search capitals..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label for="regionFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Filter by Region
            </label>
            <select
              id="regionFilter"
              v-model="filters.region"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              <option v-for="region in uniqueRegions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Clear Filters Button -->
        <div class="mt-4 flex justify-between items-center">
          <button
            @click="clearFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            :disabled="!hasActiveFilters"
            :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }"
          >
            Clear Filters
          </button>
          
          <div class="text-sm text-gray-500">
            Showing {{ filteredCountries.length }} of {{ countries.length }} countries
          </div>
        </div>
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
            <tr v-for="country in filteredCountries" :key="country.name" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ country.name }}
                  </div>
                  <div class="text-sm text-gray-500">{{ country.official }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ country.capital }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatNumber(country.population) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ country.region }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- No Results Message -->
        <div v-if="filteredCountries.length === 0" class="p-6 text-center text-gray-500">
          <p>No countries match your current filters.</p>
          <button
            @click="clearFilters"
            class="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            Clear filters to see all countries
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const countries = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    // Filter state
    const filters = reactive({
      country: '',
      capital: '',
      region: ''
    })

    const fetchCountries = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/countries/countries')
        countries.value = response.data.countries
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to fetch countries'
      } finally {
        loading.value = false
      }
    }

    // Get unique regions for dropdown
    const uniqueRegions = computed(() => {
      const regions = countries.value.map(country => country.region)
      return [...new Set(regions)].filter(Boolean).sort()
    })

    // Filtered countries based on search criteria
    const filteredCountries = computed(() => {
      return countries.value.filter(country => {
        const matchesCountry = !filters.country || 
          country.name.toLowerCase().includes(filters.country.toLowerCase()) ||
          country.official.toLowerCase().includes(filters.country.toLowerCase())
          
        const matchesCapital = !filters.capital || 
          country.capital.toLowerCase().includes(filters.capital.toLowerCase())
          
        const matchesRegion = !filters.region || 
          country.region === filters.region

        return matchesCountry && matchesCapital && matchesRegion
      })
    })

    // Check if any filters are active
    const hasActiveFilters = computed(() => {
      return filters.country || filters.capital || filters.region
    })

    // Clear all filters
    const clearFilters = () => {
      filters.country = ''
      filters.capital = ''
      filters.region = ''
    }

    // Format numbers with commas
    const formatNumber = (num) => {
      if (!num) return 'N/A'
      return num.toLocaleString()
    }

    onMounted(fetchCountries)

    return {
      countries,
      loading,
      error,
      filters,
      uniqueRegions,
      filteredCountries,
      hasActiveFilters,
      clearFilters,
      formatNumber
    }
  }
}
</script>