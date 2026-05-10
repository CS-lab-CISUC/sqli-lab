<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const reservaNome = ref('')
const reservaCodigo = ref('')
const reservaMsg = ref('')
const reservaError = ref('')
const reservaLoading = ref(false)

const consultarCodigo = ref('')
const setorResult = ref<string | null>(null)
const setorError = ref('')
const setorLoading = ref(false)

const congrats23 = ref(false)

async function reservar() {
  if (!reservaNome.value || !reservaCodigo.value) return
  reservaMsg.value = ''
  reservaError.value = ''
  reservaLoading.value = true
  try {
    const res = await fetch('/api/reservar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: reservaNome.value, codigo: reservaCodigo.value }),
    })
    const data = await res.json()
    if (!res.ok) {
      reservaError.value = data.error ?? 'Erro ao registar reserva.'
    } else {
      reservaMsg.value = data.message ?? 'Reserva registada.'
    }
  } catch {
    reservaError.value = 'Não foi possível contactar o servidor.'
  } finally {
    reservaLoading.value = false
  }
}

async function consultarReserva() {
  if (!consultarCodigo.value) return
  setorResult.value = null
  setorError.value = ''
  setorLoading.value = true
  try {
    const res = await fetch(`/api/ver-reserva?codigo=${encodeURIComponent(consultarCodigo.value)}`)
    const data = await res.json()
    if (!res.ok) {
      setorError.value = data.error ?? 'Erro ao consultar reserva.'
    } else {
      setorResult.value = data.setor
      if (data.setor && data.setor.includes('JUMENTOS{')) {
        congrats23.value = true
      }
    }
  } catch {
    setorError.value = 'Não foi possível contactar o servidor.'
  } finally {
    setorLoading.value = false
  }
}
</script>

<template>
  <div class="site">
    <div v-if="congrats23" class="congrats-banner congrats-23">
      <div class="congrats-body">
        <span class="congrats-label">LEVEL 2-3 COMPLETE</span>
        <span class="congrats-msg">You stored a payload safely, then triggered it in a separate query. Second-order SQLi complete.</span>
        <RouterLink to="/oob" class="congrats-next">Avançar para Nível 3-1 &rarr;</RouterLink>
      </div>
      <span class="congrats-dismiss" @click="congrats23 = false">&#x2715;</span>
    </div>

    <nav class="navbar">
      <RouterLink to="/" class="brand">
        <span class="brand-crest">⬡</span>
        <span class="brand-name">JUMENTOS FC</span>
      </RouterLink>
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><a href="#">News</a></li>
        <li><a href="#">Matches</a></li>
        <li><a href="#">Players</a></li>
        <li><RouterLink to="/tickets">Bilhetes</RouterLink></li>
        <li><RouterLink to="/reservas" class="nav-active">Reservas</RouterLink></li>
        <li><RouterLink to="/login" class="nav-login">Login</RouterLink></li>
      </ul>
    </nav>

    <main class="content">
      <div class="card">
        <p class="card-label">ESTÁDIO DAS BESTIAS — LISTA DE ESPERA</p>
        <h1 class="card-title">Reservar Lugar</h1>
        <p class="card-sub">Coloque o seu nome e o código do lugar para entrar na lista de espera.</p>

        <div class="reservar-bar">
          <input id="reservar-nome" v-model="reservaNome" type="text" placeholder="Nome" />
          <input id="reservar-codigo" v-model="reservaCodigo" type="text" placeholder="Código (ex: A1)" />
          <button class="reservar-btn search-btn" @click="reservar" :disabled="reservaLoading">
            {{ reservaLoading ? '...' : 'Reservar' }}
          </button>
        </div>

        <div v-if="reservaError" class="result-msg result-error">{{ reservaError }}</div>
        <div v-if="reservaMsg" class="result-msg reserva-msg">{{ reservaMsg }}</div>

        <div class="divider"></div>

        <h2 class="card-subtitle">Consultar Reserva</h2>
        <p class="card-sub">Introduza o código do lugar para consultar a sua reserva.</p>

        <div class="search-bar">
          <input
            id="consultar-codigo"
            v-model="consultarCodigo"
            type="text"
            placeholder="Código do lugar"
            @keyup.enter="consultarReserva"
          />
          <button class="consultar-btn search-btn" @click="consultarReserva" :disabled="setorLoading">
            {{ setorLoading ? '...' : 'Consultar' }}
          </button>
        </div>

        <div v-if="setorError" class="result-msg result-error">{{ setorError }}</div>
        <div v-if="setorResult !== null" class="result-msg setor-result">Setor: {{ setorResult }}</div>
      </div>
    </main>

    <footer class="footer">
      <span class="footer-logo">JUMENTOS FC</span>
      <p class="footer-copy">&copy; 2026 Jumentos Football Club S.p.A. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
  color: #fff;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
  background: #000;
  border-bottom: 2px solid #C9A84C;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  color: #fff;
  text-decoration: none;
}

.brand-crest {
  font-size: 1.5rem;
  color: #C9A84C;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #C9A84C;
}

.nav-active {
  color: #C9A84C !important;
}

.nav-login {
  background: #C9A84C;
  color: #000 !important;
  padding: 0.4rem 1rem;
  font-weight: 700;
}

.nav-login:hover {
  background: #e8c96a;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1.5rem;
  gap: 2rem;
}

.card {
  width: 100%;
  max-width: 520px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-top: 3px solid #9b59b6;
  padding: 2.5rem 2rem;
}

.card-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9b59b6;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 0.4rem 0;
}

.card-sub {
  font-size: 0.8rem;
  color: #555;
  margin: 0 0 2rem 0;
  line-height: 1.5;
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
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input::placeholder {
  color: #444;
}

.search-bar input:focus {
  border-color: #9b59b6;
}

.reservar-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.reservar-bar input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.reservar-bar input::placeholder {
  color: #444;
}

.reservar-bar input:focus {
  border-color: #9b59b6;
}

.search-btn {
  background: #9b59b6;
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: #b07fd0;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background: #1e1e1e;
  margin: 1.75rem 0;
}

.result-msg {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.result-error {
  background: #1a0000;
  border: 1px solid #5a0000;
  color: #ff6b6b;
  font-family: monospace;
  font-size: 0.82rem;
  text-transform: none;
  letter-spacing: 0;
  word-break: break-word;
}

.reserva-msg {
  background: #0d001a;
  border: 1px solid #3d0060;
  color: #c084e0;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.85rem;
}

.setor-result {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ccc;
  font-family: monospace;
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: 0;
  word-break: break-word;
}

.footer {
  background: #000;
  border-top: 2px solid #C9A84C;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.footer-logo {
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #C9A84C;
}

.footer-copy {
  font-size: 0.75rem;
  color: #444;
}

.congrats-banner {
  border-bottom: 2px solid #9b59b6;
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.congrats-23 {
  background: #0a001a;
  border-bottom-color: #9b59b6;
}

.congrats-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.congrats-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9b59b6;
}

.congrats-msg {
  font-size: 0.82rem;
  color: #ccc;
}

.congrats-next {
  display: inline-block;
  margin-top: 0.5rem;
  color: #9b59b6;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
}

.congrats-dismiss {
  font-size: 0.75rem;
  color: #555;
  flex-shrink: 0;
  align-self: flex-start;
  cursor: pointer;
}
</style>
