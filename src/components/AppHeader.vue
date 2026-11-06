<!-- src/components/AppHeader.vue -->
<script setup>
defineProps({
  busca:        { type: String,  required: true },
  desabilitado: { type: Boolean, default: false },
  total:        { type: Number,  default: null },
})
defineEmits(['update:busca'])
</script>

<template>
  <header class="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">

      <!-- Logo -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight text-white">
          Swift<span class="text-indigo-400">List</span>
        </span>
      </div>

      <!-- Campo de busca -->
      <div class="relative flex-1 w-full sm:max-w-md">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          :value="busca"
          @input="$emit('update:busca', $event.target.value)"
          type="text"
          placeholder="Buscar produto..."
          :disabled="desabilitado"
          class="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                 disabled:opacity-40 disabled:cursor-not-allowed transition"
        />
      </div>

      <!-- Contador -->
      <span
        v-if="total !== null"
        class="shrink-0 text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded-full px-3 py-1"
      >
        {{ total }} produto{{ total !== 1 ? 's' : '' }}
      </span>
    </div>
  </header>
</template>
