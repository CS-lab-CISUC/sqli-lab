<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const section = ref('')
const valor = ref<string | null>(null)
const error = ref('')
const loading = ref(false)
const congrats33 = ref(false)

async function consultar() {
  if (!section.value) return
  error.value = ''
  valor.value = null
  loading.value = true
  try {
    const res = await fetch(`/api/config?section=${encodeURIComponent(section.value)}`)
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error ?? 'Erro ao consultar configuração.'
    } else {
      valor.value = data.valor
      if (data.valor?.includes('JUMENTOS{')) {
        congrats33.value = true
      }
    }
  } catch {
    error.value = 'Não foi possível contactar o servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="site">
    <div v-if="congrats33" class="congrats-banner congrats-33">
      <div class="congrats-body">
        <span class="congrats-label">LEVEL 3-3 COMPLETE</span>
        <span class="congrats-msg">Leste um ficheiro do servidor via pg_read_file. Injecção SQL elevou-se a acesso ao sistema de ficheiros. Nível 3 concluído.</span>
      </div>
      <span class="congrats-dismiss" @click="congrats33 = false">&#x2715;</span>
    </div>

    <nav class="navbar">
      <RouterLink to="/" class="brand">
        <span class="brand-name">JUMENTOS FC</span>
      </RouterLink>
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/oob">OOB</RouterLink></li>
        <li><RouterLink to="/waf">WAF</RouterLink></li>
        <li><RouterLink to="/secrets" class="nav-active">Secrets</RouterLink></li>
      </ul>
    </nav>

    <main class="content">
      <div class="card">
        <p class="card-label">NÍVEL 3-3 — LEITURA DE FICHEIROS</p>
        <h1 class="card-title">Configurações do Servidor</h1>
        <p class="card-sub">
          Visualizador de configurações internas. Introduz a secção para obter o valor correspondente.
        </p>

        <div class="search-bar">
          <input
            v-model="section"
            type="text"
            placeholder="Secção (ex: db_version, app_mode...)"
            @keyup.enter="consultar"
          />
          <button class="search-btn" @click="consultar" :disabled="loading">
            {{ loading ? '...' : 'Consultar' }}
          </button>
        </div>

        <div v-if="error" class="result-msg result-error error-msg">{{ error }}</div>
        <div v-if="valor !== null" class="result-msg result-valor" :class="{ 'flag-valor': valor?.includes('JUMENTOS{') }">
          {{ valor }}
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.site { min-height: 100vh; background: #111; color: #fff; font-family: system-ui, sans-serif; }
.navbar { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 56px; background: #000; border-bottom: 2px solid #C9A84C; }
.brand { text-decoration: none; color: #C9A84C; font-weight: 800; font-size: 1.1rem; letter-spacing: 0.1em; }
.nav-links { list-style: none; display: flex; gap: 1.5rem; margin: 0; padding: 0; }
.nav-links a { color: #aaa; text-decoration: none; font-size: 0.9rem; transition: color 0.15s; }
.nav-links a:hover, .nav-active { color: #C9A84C !important; }
.content { max-width: 760px; margin: 3rem auto; padding: 0 1rem; }
.card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 2rem; }
.card-label { font-size: 0.7rem; letter-spacing: 0.15em; color: #C9A84C; margin: 0 0 0.5rem; text-transform: uppercase; }
.card-title { font-size: 1.6rem; font-weight: 800; margin: 0 0 0.5rem; }
.card-sub { color: #888; font-size: 0.9rem; margin: 0 0 1.5rem; line-height: 1.6; }
.search-bar { display: flex; gap: 0.5rem; }
.search-bar input { flex: 1; background: #111; border: 1px solid #333; border-radius: 4px; padding: 0.6rem 0.8rem; color: #fff; font-size: 0.95rem; }
.search-bar input:focus { outline: none; border-color: #C9A84C; }
.search-btn { background: #C9A84C; color: #000; border: none; border-radius: 4px; padding: 0.6rem 1.2rem; font-weight: 700; cursor: pointer; }
.search-btn:disabled { opacity: 0.5; cursor: default; }
.result-msg { margin-top: 1rem; padding: 0.7rem 1rem; border-radius: 4px; font-size: 0.9rem; }
.result-error { background: #2a1010; border: 1px solid #5a2020; color: #f88; }
.result-valor { background: #1e1e1e; border: 1px solid #333; color: #ccc; font-family: monospace; }
.flag-valor { border-color: #C9A84C; color: #C9A84C; font-weight: 700; }
.congrats-banner { position: fixed; bottom: 1.5rem; right: 1.5rem; background: #000; border: 2px solid #C9A84C; border-radius: 8px; padding: 1.2rem 1.5rem; max-width: 420px; display: flex; align-items: flex-start; gap: 1rem; z-index: 100; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
.congrats-body { display: flex; flex-direction: column; gap: 0.4rem; }
.congrats-label { font-size: 0.7rem; letter-spacing: 0.15em; color: #C9A84C; font-weight: 800; text-transform: uppercase; }
.congrats-msg { font-size: 0.85rem; color: #ccc; line-height: 1.5; }
.congrats-dismiss { cursor: pointer; color: #666; font-size: 1rem; line-height: 1; flex-shrink: 0; }
</style>
