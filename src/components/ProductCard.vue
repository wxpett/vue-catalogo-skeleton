<!-- src/components/ProductCard.vue -->
<script setup>
const props = defineProps({
  produto: { type: Object, required: true },
})
const emit = defineEmits(['abrir'])

const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(valor)
</script>

<template>
  <div
    @click="emit('abrir', produto)"
    class="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50
           transition-all duration-300 cursor-pointer
           hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40"
  >
    <!-- Imagem -->
    <div class="relative overflow-hidden aspect-square bg-gray-700">
      <img
        :src="produto.thumbnail"
        :alt="produto.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Badge desconto -->
      <span
        v-if="produto.discountPercentage"
        class="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
      >
        -{{ Math.round(produto.discountPercentage) }}%
      </span>
      <!-- Badge estoque baixo -->
      <span
        v-if="produto.stock <= 10"
        class="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
      >
        Últimas {{ produto.stock }} un.
      </span>
    </div>

    <!-- Texto -->
    <div class="p-4 space-y-1.5">
      <span class="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
        {{ produto.category }}
      </span>
      <h2 class="text-sm font-semibold text-gray-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
        {{ produto.title }}
      </h2>

      <!-- Rating -->
      <div class="flex items-center gap-1">
        <svg
          v-for="s in 5" :key="s"
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          :class="s <= Math.round(produto.rating) ? 'text-yellow-400' : 'text-gray-600'"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span class="text-[10px] text-gray-500 ml-0.5">{{ produto.rating }}</span>
      </div>

      <!-- Preço -->
      <p class="text-base font-bold text-indigo-400 pt-1">
        {{ formatarPreco(produto.price) }}
      </p>
    </div>
  </div>
</template>

