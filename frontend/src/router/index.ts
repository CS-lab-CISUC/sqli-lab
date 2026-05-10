import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/dashboard/transfers',
      name: 'transfers',
      component: () => import('../views/TransfersView.vue'),
    },
    {
      path: '/dashboard/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue'),
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsView.vue'),
    },
    {
      path: '/oob',
      name: 'oob',
      component: () => import('../views/OobView.vue'),
    },
    {
      path: '/waf',
      name: 'waf',
      component: () => import('../views/WafView.vue'),
    },
    {
      path: '/secrets',
      name: 'secrets',
      component: () => import('../views/SecretsView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if ((to.name === 'dashboard' || to.name === 'transfers' || to.name === 'perfil') && !token) {
    return { name: 'login' }
  }
  if (to.name === 'perfil' && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'goat') return { name: 'dashboard' }
    } catch {
      return { name: 'login' }
    }
  }
})

export default router
