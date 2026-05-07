import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress Configuration
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 })


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/repository',
      name: 'repository',
      component: () => import('../views/RepositoryView.vue')
    },
    {
      path: '/repository/:id',
      name: 'repository-detail',
      component: () => import('../views/RepositoryDetailView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('../views/dashboard/DashboardView.vue')
        },
        // Admin specific routes
        {
          path: 'users',
          name: 'dashboard-users',
          component: () => import('../views/dashboard/UsersView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'publications',
          name: 'dashboard-publications',
          component: () => import('../views/dashboard/PublicationsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'publications/new',
          name: 'dashboard-publications-new',
          component: () => import('../views/dashboard/UploadPublicationView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'publications/:id/edit',
          name: 'dashboard-publications-edit',
          component: () => import('../views/dashboard/EditPublicationView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'dashboard-profile',
          component: () => import('../views/dashboard/ProfileView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    // ─── Error Pages ──────────────────────────────────────────────────────────
    {
      path: '/error',
      name: 'server-error',
      component: () => import('../views/errors/ServerErrorView.vue'),
      // ?code=500 | 502 | 503
    },
    {
      // Catch-all: harus paling bawah
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/errors/NotFoundView.vue'),
    },
  ]
})

import { useAuthStore } from '../stores/auth'

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const authStore = useAuthStore()

  // Make sure we have established the initial session state before routing
  if (!authStore.isSessionChecked) {
    await authStore.checkSession()
  }

  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.isAuthenticated) {
    // Not logged in, redirect to login
    next({ name: 'login' })
    return
  }

  if (requiresAdmin && authStore.user?.role !== 'ADMIN') {
    // Not admin, redirect to generic dashboard root
    next({ name: 'dashboard-home' })
    return
  }

  // If user is already authenticated, don't let them hit login/register again
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next({ name: 'dashboard-home' })
    return
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
