<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const scoutId = ref('')
const results = ref<{ nome: string; alcunha: string }[]>([])
const error = ref('')
const loading = ref(false)
const congrats31 = ref(false)

async function lookup() {
  if (!scoutId.value) return
  error.value = ''
  results.value = []
  loading.value = true
  try {
    const res = await fetch(`/api/oob?id=${encodeURIComponent(scoutId.value)}`)
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error ?? 'Erro ao consultar olheiro.'
      if (scoutId.value.includes(';')) {
        congrats31.value = true
      }
    } else {
      results.value = data
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
    <div v-if="congrats31" class="congrats-banner congrats-31">
      <div class="congrats-body">
        <span class="congrats-label">LEVEL 3-1 COMPLETE</span>
        <span class="congrats-msg">Dados exfiltrados via COPY TO PROGRAM + curl. O caminho <code>/waf</code> chegou ao teu listener é o próximo nível.</span>
        <RouterLink to="/waf" class="congrats-next">Avançar para Nível 3-2 &rarr;</RouterLink>
      </div>
      <span class="congrats-dismiss" @click="congrats31 = false">&#x2715;</span>
    </div>

    <nav class="navbar">
      <RouterLink to="/" class="brand">
        <span class="brand-name">JUMENTOS FC</span>
      </RouterLink>
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/oob" class="nav-active">OOB</RouterLink></li>
        <li><RouterLink to="/waf">WAF</RouterLink></li>
        <li><RouterLink to="/secrets">Secrets</RouterLink></li>
      </ul>
    </nav>

    <main class="content">
      <div class="card">
        <p class="card-label">NÍVEL 3-1 — EXFILTRAÇÃO OUT-OF-BAND</p>
        <h1 class="card-title">Consulta de Olheiros</h1>
        <p class="card-sub">
          Introduza o ID do olheiro para obter o seu perfil.<br>
          Corre <code>python3 -m http.server 9000</code> na tua máquina antes de injectar
        </p>

        <div class="search-bar">
          <input
            v-model="scoutId"
            type="text"
            placeholder="ID do olheiro (ex: 1, 2...)"
            @keyup.enter="lookup"
          />
          <button class="search-btn" @click="lookup" :disabled="loading">
            {{ loading ? '...' : 'Consultar' }}
          </button>
        </div>

        <div v-if="error" class="result-msg result-error">{{ error }}</div>

        <table v-if="results.length" class="entries-table">
          <thead>
            <tr><th>Nome</th><th>Alcunha</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in results" :key="r.nome">
              <td>{{ r.nome }}</td>
              <td>{{ r.alcunha }}</td>
            </tr>
          </tbody>
        </table>
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
.content { max-width: 760px; margin: 3rem auto; padding: 0 1rem; display: flex; flex-direction: column; gap: 2rem; }
.card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 2rem; }
.card-label { font-size: 0.7rem; letter-spacing: 0.15em; color: #C9A84C; margin: 0 0 0.5rem; text-transform: uppercase; }
.card-title { font-size: 1.6rem; font-weight: 800; margin: 0 0 0.5rem; }
.card-sub { color: #888; font-size: 0.9rem; margin: 0 0 1.5rem; line-height: 1.6; }
.card-sub code { background: #2a2a2a; padding: 0.1em 0.4em; border-radius: 3px; font-family: monospace; color: #C9A84C; }
.search-bar { display: flex; gap: 0.5rem; }
.search-bar input { flex: 1; background: #111; border: 1px solid #333; border-radius: 4px; padding: 0.6rem 0.8rem; color: #fff; font-size: 0.95rem; }
.search-bar input:focus { outline: none; border-color: #C9A84C; }
.search-btn { background: #C9A84C; color: #000; border: none; border-radius: 4px; padding: 0.6rem 1.2rem; font-weight: 700; cursor: pointer; }
.search-btn:disabled { opacity: 0.5; cursor: default; }
.result-msg { margin-top: 1rem; padding: 0.7rem 1rem; border-radius: 4px; font-size: 0.9rem; }
.result-error { background: #2a1010; border: 1px solid #5a2020; color: #f88; }
.entries-table { width: 100%; border-collapse: collapse; margin-top: 1.2rem; font-size: 0.9rem; }
.entries-table th { text-align: left; color: #C9A84C; border-bottom: 1px solid #333; padding: 0.5rem; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; }
.entries-table td { padding: 0.5rem; border-bottom: 1px solid #222; color: #ccc; }
.congrats-banner { position: fixed; bottom: 1.5rem; right: 1.5rem; background: #000; border: 2px solid #C9A84C; border-radius: 8px; padding: 1.2rem 1.5rem; max-width: 420px; display: flex; align-items: flex-start; gap: 1rem; z-index: 100; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
.congrats-body { display: flex; flex-direction: column; gap: 0.4rem; }
.congrats-label { font-size: 0.7rem; letter-spacing: 0.15em; color: #C9A84C; font-weight: 800; text-transform: uppercase; }
.congrats-msg { font-size: 0.85rem; color: #ccc; line-height: 1.5; }
.congrats-msg code { background: #2a2a2a; padding: 0.1em 0.4em; border-radius: 3px; font-family: monospace; color: #C9A84C; font-size: 0.8rem; }
.congrats-next { display: inline-block; margin-top: 0.5rem; color: #C9A84C; text-decoration: none; font-weight: 700; font-size: 0.85rem; }
.congrats-dismiss { cursor: pointer; color: #666; font-size: 1rem; line-height: 1; flex-shrink: 0; }
</style>
