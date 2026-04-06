import { createRouter, createWebHistory } from 'vue-router'

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
          meta: { requiresAdmin: true }
        },
        {
          path: 'profile',
          name: 'dashboard-profile',
          component: () => import('../views/dashboard/ProfileView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach(async (_to, _from, next) => {
  // We'll implement auth guards based on pinia state later
  next();
})

export default router
