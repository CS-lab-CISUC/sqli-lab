<script setup lang="ts">
import { RouterLink } from 'vue-router'

const news = [
  {
    id: 1,
    tag: 'MATCH REPORT',
    title: 'Jumentos 3-0 Inter: Donkeys dominate Derby',
    date: '5 May 2026',
    img: 'https://placehold.co/400x220/111/C9A84C?text=JUMENTOS+FC',
  },
  {
    id: 2,
    tag: 'TRANSFER',
    title: 'Club signs striker for record-breaking bale of hay',
    date: '3 May 2026',
    img: 'https://placehold.co/400x220/111/C9A84C?text=TRANSFER+NEWS',
  },
  {
    id: 3,
    tag: 'PRESS',
    title: 'Coach: "We are the most humble club in the world"',
    date: '1 May 2026',
    img: 'https://placehold.co/400x220/111/C9A84C?text=PRESS+CONF',
  },
]
</script>

<template>
  <div class="site">
    <!-- NAVBAR -->
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
        <li><RouterLink to="/login" class="nav-login">Login</RouterLink></li>
      </ul>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-label">SERIE A — SEASON 2025/26</p>
        <h1 class="hero-title">JUMENTOS<br>FOOTBALL CLUB</h1>
        <p class="hero-tagline">Vincere non è importante,<br>è l'unica cosa.</p>
        <RouterLink to="/login" class="hero-cta">Members Area</RouterLink>
      </div>
      <div class="hero-stripe"></div>
    </section>

    <!-- NEXT MATCH BANNER -->
    <div class="match-banner">
      <span class="match-label">NEXT MATCH</span>
      <div class="match-fixture">
        <span class="team home">JUMENTOS FC</span>
        <span class="vs">VS</span>
        <span class="team away">AC BURROS</span>
      </div>
      <span class="match-date">Sat 10 May 2026 — 20:45 CEST · Stadio delle Bestie</span>
    </div>

    <!-- NEWS -->
    <section class="news-section">
      <h2 class="section-title">Latest News</h2>
      <div class="news-grid">
        <article v-for="item in news" :key="item.id" class="news-card">
          <img :src="item.img" :alt="item.title" class="news-img" />
          <div class="news-body">
            <span class="news-tag">{{ item.tag }}</span>
            <h3 class="news-title">{{ item.title }}</h3>
            <p class="news-date">{{ item.date }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <span class="footer-logo">JUMENTOS FC</span>
      <p class="footer-copy">&copy; 2026 Jumentos Football Club S.p.A. All rights reserved.</p>
      <p class="footer-disclaimer">This is a parody site for educational purposes.</p>
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

/* --- NAVBAR --- */
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
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #C9A84C;
}

.nav-login {
  background: #C9A84C;
  color: #000 !important;
  padding: 0.4rem 1rem;
  font-weight: 700;
}

.nav-login:hover {
  background: #e8c96a;
  color: #000 !important;
}

/* --- HERO --- */
.hero {
  position: relative;
  background: url('/futebol_background.jpg') center center / cover no-repeat;
  min-height: 520px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 4px solid #C9A84C;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.hero::before {
  content: 'JUMENTOS';
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18vw;
  font-weight: 900;
  color: #fff;
  opacity: 0.06;
  pointer-events: none;
  line-height: 1;
  white-space: nowrap;
  z-index: 2;
}

.hero-inner {
  position: relative;
  z-index: 3;
  padding: 4rem 3rem;
  max-width: 700px;
}

.hero-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #C9A84C;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 1.5rem;
}

.hero-tagline {
  font-size: 1.1rem;
  color: #aaa;
  font-style: italic;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.hero-cta {
  display: inline-block;
  background: #C9A84C;
  color: #000;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.9rem 2.2rem;
  transition: background 0.2s;
}

.hero-cta:hover {
  background: #e8c96a;
}

.hero-stripe {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: repeating-linear-gradient(
    to bottom,
    #C9A84C 0px,
    #C9A84C 40px,
    #000 40px,
    #000 80px
  );
}

/* --- MATCH BANNER --- */
.match-banner {
  background: #111;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  padding: 1.2rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.match-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #C9A84C;
  white-space: nowrap;
}

.match-fixture {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-weight: 800;
  font-size: 1.1rem;
}

.team.home { color: #fff; }
.team.away { color: #ccc; }

.vs {
  font-size: 0.75rem;
  font-weight: 700;
  color: #C9A84C;
  letter-spacing: 0.1em;
}

.match-date {
  font-size: 0.8rem;
  color: #888;
  margin-left: auto;
}

/* --- NEWS --- */
.news-section {
  padding: 4rem 2.5rem;
  flex: 1;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #C9A84C;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #222;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.news-card {
  background: #111;
  border: 1px solid #222;
  cursor: pointer;
  transition: border-color 0.2s;
}

.news-card:hover {
  border-color: #C9A84C;
}

.news-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.news-body {
  padding: 1.2rem;
}

.news-tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #C9A84C;
  display: block;
  margin-bottom: 0.5rem;
}

.news-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  color: #fff;
  margin-bottom: 0.75rem;
}

.news-date {
  font-size: 0.75rem;
  color: #666;
}

/* --- FOOTER --- */
.footer {
  background: #000;
  border-top: 2px solid #C9A84C;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.footer-logo {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #C9A84C;
}

.footer-copy {
  font-size: 0.78rem;
  color: #555;
}

.footer-disclaimer {
  font-size: 0.7rem;
  color: #333;
}
</style>
