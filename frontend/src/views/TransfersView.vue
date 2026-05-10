<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Transfer {
  id: number | string
  nome: string | null
  origem: string | null
  destino: string | null
  valor: string | null
}

const user = ref<{ sub: string; role: string } | null>(null)
const search = ref('')
const transfers = ref<Transfer[]>([])
const error = ref('')
const loading = ref(false)
const congrats13 = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      user.value = JSON.parse(atob(token.split('.')[1]))
    } catch { /* invalid token, router guard handles it */ }
  }
  fetchTransfers()
})

async function fetchTransfers() {
  error.value = ''
  loading.value = true
  try {
    const params = search.value ? `?search=${encodeURIComponent(search.value)}` : ''
    const token = localStorage.getItem('token') ?? ''
    const res = await fetch(`/api/transfers${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error ?? 'Erro ao carregar transferências.'
    } else {
      transfers.value = data
      if (data.some((t: Transfer) => t.id == null || isNaN(Number(t.id)))) {
        congrats13.value = true
      }
    }
  } catch {
    error.value = 'Não foi possível contactar o servidor.'
  } finally {
    loading.value = false
  }
}

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
</script>

<template>
  <div class="dashboard">
    <div v-if="congrats13" class="congrats-banner" @click="congrats13 = false">
      <span class="congrats-label">LEVEL 1-3 COMPLETE</span>
      <span class="congrats-msg">You enumerated the database structure via UNION injection. Well done. Now log in as <strong>cristiano</strong> for the next challenge.</span>
      <span class="congrats-dismiss">&#x2715;</span>
    </div>

    <nav class="navbar">
      <RouterLink to="/" class="nav-brand">JUMENTOS FC</RouterLink>
      <div class="nav-center">
        <RouterLink to="/dashboard" class="nav-link">Entradas</RouterLink>
        <RouterLink to="/dashboard/transfers" class="nav-link nav-link-active">Transferências</RouterLink>
      </div>
      <div class="nav-right">
        <span v-if="user" class="nav-user">{{ user.sub }}</span>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>
    </nav>

    <main class="content">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">Transferências da Temporada</h2>
          <p class="section-sub">Movimentações do mercado — 2025/26</p>
        </div>
      </div>

      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Pesquisar por jogador..."
          @keyup.enter="fetchTransfers"
        />
        <button class="search-btn" @click="fetchTransfers" :disabled="loading">
          {{ loading ? '...' : 'Pesquisar' }}
        </button>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <table v-else class="entries-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Jogador</th>
            <th>De</th>
            <th>Para</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="transfers.length === 0">
            <td colspan="5" class="empty">Nenhuma transferência encontrada.</td>
          </tr>
          <tr v-for="t in transfers" :key="String(t.id)">
            <td>{{ t.id }}</td>
            <td>{{ t.nome }}</td>
            <td>{{ t.origem }}</td>
            <td>{{ t.destino }}</td>
            <td>{{ t.valor }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: system-ui, sans-serif;
}

.navbar {
  background: #000;
  border-bottom: 2px solid #C9A84C;
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #C9A84C;
  text-decoration: none;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ccc;
}

.nav-link-active {
  color: #C9A84C;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-user {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aaa;
}

.logout-btn {
  background: none;
  border: 1px solid #333;
  color: #888;
  padding: 0.35rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s, color 0.2s;
}

.logout-btn:hover {
  border-color: #C9A84C;
  color: #C9A84C;
}

.content {
  max-width: 960px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 0.2rem 0;
  color: #fff;
}

.section-sub {
  font-size: 0.75rem;
  color: #555;
  margin: 0;
  letter-spacing: 0.05em;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.search-bar input {
  flex: 1;
  background: #111;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input::placeholder {
  color: #444;
}

.search-bar input:focus {
  border-color: #C9A84C;
}

.search-btn {
  background: #C9A84C;
  color: #000;
  border: none;
  padding: 0.65rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: #e8c96a;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  background: #1a0000;
  border: 1px solid #5a0000;
  color: #ff6b6b;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  line-height: 1.4;
  word-break: break-word;
}

.entries-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.entries-table th {
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  border-bottom: 1px solid #1e1e1e;
  padding: 0.6rem 0.8rem;
}

.entries-table td {
  padding: 0.75rem 0.8rem;
  border-bottom: 1px solid #141414;
  color: #ccc;
}

.entries-table tr:hover td {
  background: #111;
}

.empty {
  text-align: center;
  color: #444;
  padding: 2rem !important;
}

.congrats-banner {
  background: #001a14;
  border-bottom: 2px solid #C9A84C;
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.congrats-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C9A84C;
  white-space: nowrap;
}

.congrats-msg {
  font-size: 0.82rem;
  color: #ccc;
  flex: 1;
}

.congrats-dismiss {
  font-size: 0.75rem;
  color: #555;
  flex-shrink: 0;
}
</style>
