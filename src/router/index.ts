import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CertificationsView from '../views/CertificationsView.vue'
import ApuntesView from '../views/ApuntesView.vue'
import NotaView from '../views/NotaView.vue'
import TerminalView from '../views/TerminalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/certificados/:category',
      name: 'certificados',
      component: CertificationsView
    },
    {
      path: '/apuntes',
      name: 'apuntes',
      component: ApuntesView
    },
    {
      path: '/apuntes/:id',
      name: 'nota',
      component: NotaView
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: TerminalView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
