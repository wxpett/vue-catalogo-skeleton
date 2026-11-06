<script setup>
import { computed, onMounted, ref } from 'vue'

// ─── Estado reativo ─────────────────────────────────────────────────────────
const produtos    = ref([])
const carregando  = ref(true)
const erro        = ref('')
const busca       = ref('')

// ─── Computed: filtragem local por nome ──────────────────────────────────────
const produtosFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  if (!termo) return produtos.value
  return produtos.value.filter(p => p.title.toLowerCase().includes(termo))
})

// ─── Busca na API ────────────────────────────────────────────────────────────
async function buscarProdutos() {
  carregando.value = true
  erro.value       = ''
  produtos.value   = []

  // setTimeout de 2 s para garantir a exibição dos Skeletons
  setTimeout(async () => {
    try {
      const resposta = await fetch('https://dummyjson.com/products?limit=12')
      if (!resposta.ok) throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`)
      const dados = await resposta.json()
      produtos.value = dados.products
    } catch (e) {
      erro.value = e.message || 'Falha ao conectar com o servidor.'
    } finally {
      carregando.value = false
    }
  }, 2000)
}

onMounted(buscarProdutos)

// ─── Formatação de preço ─────────────────────────────────────────────────────
const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(valor)
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">

    <!-- ══════════════ HEADER ══════════════ -->
    <header class="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        <!-- Logo / Título -->
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
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            v-model="busca"
            type="text"
            placeholder="Buscar produto..."
            :disabled="carregando || !!erro"
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
          />
        </div>

        <!-- Contador de resultados -->
        <span
          v-if="!carregando && !erro"
          class="shrink-0 text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded-full px-3 py-1"
        >
          {{ produtosFiltrados.length }} produto{{ produtosFiltrados.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </header>

    <!-- ══════════════ CONTEÚDO PRINCIPAL ══════════════ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <!-- ── GRID ─────────────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        <!-- ┌─────────────────────────────────────────────────────────────────┐
             │  ESTADO: CARREGANDO → 12 Skeleton Cards com animate-pulse      │
             └─────────────────────────────────────────────────────────────────┘ -->
        <template v-if="carregando">
          <div
            v-for="n in 12"
            :key="'sk-' + n"
            class="animate-pulse bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50"
          >
            <!-- Placeholder da imagem -->
            <div class="bg-gray-700 aspect-square w-full"></div>

            <!-- Placeholder do conteúdo -->
            <div class="p-4 space-y-3">
              <!-- Título linha 1 -->
              <div class="h-3.5 bg-gray-700 rounded-full w-5/6"></div>
              <!-- Título linha 2 -->
              <div class="h-3.5 bg-gray-700 rounded-full w-4/6"></div>
              <!-- Preço -->
              <div class="h-3 bg-gray-600 rounded-full w-2/6 mt-2"></div>
            </div>
          </div>
        </template>

        <!-- ┌─────────────────────────────────────────────────────────────────┐
             │  ESTADO: SUCESSO → Cartões reais dos produtos                  │
             └─────────────────────────────────────────────────────────────────┘ -->
        <template v-else-if="!erro">
          <div
            v-for="produto in produtosFiltrados"
            :key="produto.id"
            class="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50
                   transition-all duration-300 cursor-pointer
                   hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40"
          >
            <!-- Imagem do produto -->
            <div class="relative overflow-hidden aspect-square bg-gray-700">
              <img
                :src="produto.thumbnail"
                :alt="produto.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <!-- Badge de desconto -->
              <span
                v-if="produto.discountPercentage"
                class="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
              >
                -{{ Math.round(produto.discountPercentage) }}%
              </span>
            </div>

            <!-- Texto do cartão -->
            <div class="p-4 space-y-1.5">
              <!-- Categoria -->
              <span class="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                {{ produto.category }}
              </span>
              <!-- Título -->
              <h2 class="text-sm font-semibold text-gray-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {{ produto.title }}
              </h2>
              <!-- Rating -->
              <div class="flex items-center gap-1">
                <svg v-for="s in 5" :key="s" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3"
                     :class="s <= Math.round(produto.rating) ? 'text-yellow-400' : 'text-gray-600'" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

      </div>

      <!-- ┌──────────────────────────────────────────────────────────────────┐
           │  ESTADO: ERRO → Feedback amigável + botão Tentar Novamente      │
           └──────────────────────────────────────────────────────────────────┘ -->
      <div
        v-if="erro"
        class="flex flex-col items-center justify-center gap-5 py-24 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-100 mb-1">Ops! Algo deu errado.</h2>
          <p class="text-sm text-gray-400 max-w-xs">{{ erro }}</p>
        </div>
        <button
          @click="buscarProdutos"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95
                 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Tentar Novamente
        </button>
      </div>

      <!-- ┌──────────────────────────────────────────────────────────────────┐
           │  ESTADO: VAZIO → Nenhum produto encontrado na busca             │
           └──────────────────────────────────────────────────────────────────┘ -->
      <div
        v-if="!carregando && !erro && produtosFiltrados.length === 0"
        class="flex flex-col items-center justify-center gap-5 py-24 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-100 mb-1">Nenhum produto encontrado</h2>
          <p class="text-sm text-gray-400 max-w-xs">
            Nenhum resultado para "<span class="text-indigo-400 font-medium">{{ busca }}</span>". Tente outro termo.
          </p>
        </div>
        <button
          @click="busca = ''"
          class="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
        >
          Limpar busca
        </button>
      </div>

    </main>

    <!-- ══════════════ FOOTER ══════════════ -->
    <footer class="border-t border-gray-800 mt-10 py-6 text-center text-xs text-gray-600">
      SwiftList &mdash; Dados via
      <a href="https://dummyjson.com" target="_blank" rel="noopener" class="text-indigo-500 hover:text-indigo-400 transition-colors">DummyJSON</a>
    </footer>

  </div>
</template>
