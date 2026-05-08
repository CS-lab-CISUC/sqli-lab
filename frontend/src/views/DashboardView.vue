<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Entrada {
  id: number
  nome: string
  secao: string
  data: string
  confidencial: number
}

const user = ref<{ sub: string; role: string } | null>(null)
const search = ref('')
const entradas = ref<Entrada[]>([])
const error = ref('')
const loading = ref(false)
const congrats11 = ref(false)
const congrats12 = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      user.value = JSON.parse(atob(token.split('.')[1]))
    } catch { /* invalid token, router guard handles it */ }
  }
  if (sessionStorage.getItem('level1-1-passed')) {
    congrats11.value = true
    sessionStorage.removeItem('level1-1-passed')
  }
  fetchEntradas()
})

async function fetchEntradas() {
  error.value = ''
  loading.value = true
  try {
    const params = search.value ? `?search=${encodeURIComponent(search.value)}` : ''
    const token = localStorage.getItem('token') ?? ''
    const res = await fetch(`/api/entradas${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error ?? 'Erro ao carregar entradas.'
    } else {
      entradas.value = data
      if (data.some((e: Entrada) => e.confidencial === 1)) {
        congrats12.value = true
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
    <div v-if="congrats11" class="congrats-banner" @click="congrats11 = false">
      <span class="congrats-label">LEVEL 1-1 COMPLETE</span>
      <span class="congrats-msg">You bypassed authentication via SQL injection. Well done.</span>
      <span class="congrats-dismiss">&#x2715;</span>
    </div>
    <div v-if="congrats12" class="congrats-banner congrats-12" @click="congrats12 = false">
      <span class="congrats-label">LEVEL 1-2 COMPLETE</span>
      <span class="congrats-msg">You leaked confidential records by injecting into the WHERE clause. Well done.</span>
      <span class="congrats-dismiss">&#x2715;</span>
    </div>

    <nav class="navbar">
      <RouterLink to="/" class="nav-brand">JUMENTOS FC</RouterLink>
      <div class="nav-right">
        <span v-if="user" class="nav-user">{{ user.sub }}</span>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>
    </nav>

    <main class="content">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">Entradas no Estádio</h2>
          <p class="section-sub">Registo de acessos ao Estádio Jumentino</p>
        </div>
        <button class="confidential-btn" disabled title="Acesso restrito">
          <span class="lock-icon">&#128274;</span>
          Ver Acessos Confidenciais
        </button>
      </div>

      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Pesquisar por nome..."
          @keyup.enter="fetchEntradas"
        />
        <button class="search-btn" @click="fetchEntradas" :disabled="loading">
          {{ loading ? '...' : 'Pesquisar' }}
        </button>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <table v-else class="entries-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Seção</th>
            <th>Data</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entradas.length === 0">
            <td colspan="5" class="empty">Nenhuma entrada encontrada.</td>
          </tr>
          <tr
            v-for="e in entradas"
            :key="e.id"
            :class="{ confidencial: e.confidencial === 1 }"
          >
            <td>{{ e.id }}</td>
            <td>{{ e.nome }}</td>
            <td>{{ e.secao }}</td>
            <td>{{ e.data }}</td>
            <td>
              <span v-if="e.confidencial === 1" class="badge badge-confidencial">CONFIDENCIAL</span>
              <span v-else class="badge badge-publico">Público</span>
            </td>
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
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

.confidential-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #444;
  padding: 0.55rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: not-allowed;
  font-family: inherit;
}

.lock-icon {
  font-size: 0.8rem;
  filter: grayscale(1) opacity(0.4);
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

.entries-table tr.confidencial td {
  color: #fff;
}

.entries-table tr.confidencial:hover td {
  background: #1a0d00;
}

.empty {
  text-align: center;
  color: #444;
  padding: 2rem !important;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.badge-publico {
  background: #0d1a0d;
  color: #4a7c4a;
  border: 1px solid #1a3a1a;
}

.badge-confidencial {
  background: #3a0d00;
  color: #ff7043;
  border: 1px solid #7a2000;
}

.congrats-banner {
  background: #0d1a00;
  border-bottom: 2px solid #C9A84C;
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.congrats-12 {
  background: #001a0d;
  border-bottom-color: #4CAF84;
}

.congrats-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C9A84C;
  white-space: nowrap;
}

.congrats-12 .congrats-label {
  color: #4CAF84;
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
