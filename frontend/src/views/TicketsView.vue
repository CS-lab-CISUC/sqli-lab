<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const codigo = ref('')
const disponivel = ref<boolean | null>(null)
const error = ref('')
const loading = ref(false)
const congrats21 = ref(false)
const congrats22 = ref(false)

async function verificar() {
  if (!codigo.value) return
  disponivel.value = null
  error.value = ''
  loading.value = true
  const start = Date.now()
  try {
    const res = await fetch(`/api/bilhete?codigo=${encodeURIComponent(codigo.value)}`)
    const elapsed = Date.now() - start
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error ?? 'Erro ao verificar bilhete.'
    } else {
      disponivel.value = data.disponivel
      const isLastChar = codigo.value.includes("'}'")
      if (data.disponivel && codigo.value.includes('SUBSTRING') && isLastChar) {
        congrats21.value = true
      }
      if (elapsed >= 2500 && isLastChar) {
        congrats22.value = true
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
    <div v-if="congrats21" class="congrats-banner congrats-21">
      <div class="congrats-body">
        <span class="congrats-label">LEVEL 2-1 COMPLETE</span>
        <span class="congrats-msg">You extracted the flag using boolean-based blind injection. Now extract it again — but using only response timing.</span>
      </div>
      <span class="congrats-dismiss" @click="congrats21 = false">&#x2715;</span>
    </div>
    <div v-if="congrats22" class="congrats-banner congrats-22">
      <div class="congrats-body">
        <span class="congrats-label">LEVEL 2-2 COMPLETE</span>
        <span class="congrats-msg">You extracted the flag using only response timing, with no observable difference in the response body. Well done.</span>
      </div>
      <span class="congrats-dismiss" @click="congrats22 = false">&#x2715;</span>
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
        <li><RouterLink to="/tickets" class="nav-active">Bilhetes</RouterLink></li>
        <li><RouterLink to="/login" class="nav-login">Login</RouterLink></li>
      </ul>
    </nav>

    <main class="content">
      <div class="card">
        <p class="card-label">ESTÁDIO DAS BESTIAS — TEMPORADA 2025/26</p>
        <h1 class="card-title">Verificação de Bilhetes</h1>
        <p class="card-sub">Introduza o código do lugar para verificar a disponibilidade.</p>

        <div class="search-bar">
          <input
            v-model="codigo"
            type="text"
            placeholder="Código do lugar (ex: A1, B7...)"
            @keyup.enter="verificar"
          />
          <button class="search-btn" @click="verificar" :disabled="loading">
            {{ loading ? '...' : 'Verificar' }}
          </button>
        </div>

        <div v-if="error" class="result-msg result-error">{{ error }}</div>
        <div v-else-if="disponivel === true" class="result-msg result-available">Disponível</div>
        <div v-else-if="disponivel === false" class="result-msg result-unavailable">Não disponível</div>
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
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
}

.card {
  width: 100%;
  max-width: 520px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-top: 3px solid #C9A84C;
  padding: 2.5rem 2rem;
}

.card-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #C9A84C;
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
  border-color: #C9A84C;
}

.search-btn {
  background: #C9A84C;
  color: #000;
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
  background: #e8c96a;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-msg {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.result-available {
  background: #001a0d;
  border: 1px solid #0a4020;
  color: #4CAF84;
}

.result-unavailable {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #555;
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
  border-bottom: 2px solid #C9A84C;
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.congrats-21 {
  background: #0d1a00;
  border-bottom-color: #C9A84C;
}

.congrats-22 {
  background: #001a14;
  border-bottom-color: #4CAF84;
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
  color: #C9A84C;
}

.congrats-22 .congrats-label {
  color: #4CAF84;
}

.congrats-msg {
  font-size: 0.82rem;
  color: #ccc;
}

.congrats-dismiss {
  font-size: 0.75rem;
  color: #555;
  flex-shrink: 0;
  align-self: flex-start;
  cursor: pointer;
}
</style>
