// src/composables/useProdutos.js
// Composable responsável por todo o estado e lógica de dados

import { computed, ref } from 'vue'

const API_URL = 'https://dummyjson.com/products?limit=12'
const DELAY_MS = 2000

export function useProdutos() {
  const produtos   = ref([])
  const carregando = ref(true)
  const erro       = ref('')
  const busca      = ref('')

  const produtosFiltrados = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    if (!termo) return produtos.value
    return produtos.value.filter(p => p.title.toLowerCase().includes(termo))
  })

  async function buscarProdutos() {
    carregando.value = true
    erro.value       = ''
    produtos.value   = []

    setTimeout(async () => {
      try {
        const resposta = await fetch(API_URL)
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`)
        const dados = await resposta.json()
        produtos.value = dados.products
      } catch (e) {
        erro.value = e.message || 'Falha ao conectar com o servidor.'
      } finally {
        carregando.value = false
      }
    }, DELAY_MS)
  }

  return { produtos, carregando, erro, busca, produtosFiltrados, buscarProdutos }
}

