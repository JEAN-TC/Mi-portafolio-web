import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('../views/HomeView.vue')
const CertificationsView = () => import('../views/CertificationsView.vue')
const ApuntesView = () => import('../views/ApuntesView.vue')
const NotaView = () => import('../views/NotaView.vue')
const TerminalView = () => import('../views/TerminalView.vue')

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
  scrollBehavior(to, _from, savedPosition) {
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
