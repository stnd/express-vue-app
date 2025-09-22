<template>
  <div class="max-w-md mx-auto mt-16 text-center">
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-8">
      <div class="text-gray-400 mb-4">
        <h1 class="text-6xl font-bold">404</h1>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>

      <p class="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="space-x-4">
        <router-link to="/" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go Home
        </router-link>

        <button @click="$router.go(-1)"
          class="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>