<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const username = ref('admin')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.message ?? 'Login failed.'
    } else {
      localStorage.setItem('token', data.token)
      sessionStorage.setItem('level1-1-passed', '1')
      window.location.href = '/dashboard'
    }
  } catch {
    error.value = 'Could not reach server.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <RouterLink to="/" class="back-link">&#8592; Back to home</RouterLink>

    <div class="login-card">
      <div class="card-header">
        <span class="crest">⬡</span>
        <h1 class="club-name">JUMENTOS FC</h1>
        <p class="card-subtitle">Members Area</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Authenticating...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.back-link {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.back-link:hover {
  color: #C9A84C;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #111;
  border: 1px solid #222;
  border-top: 3px solid #C9A84C;
  padding: 2.5rem 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.crest {
  font-size: 2.5rem;
  color: #C9A84C;
  display: block;
  margin-bottom: 0.5rem;
}

.club-name {
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #fff;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C9A84C;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #aaa;
}

.field input {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.field input::placeholder {
  color: #444;
}

.field input:focus {
  border-color: #C9A84C;
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

.submit-btn {
  background: #C9A84C;
  color: #000;
  border: none;
  padding: 0.9rem;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #e8c96a;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
