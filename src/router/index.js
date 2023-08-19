import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import authService from '../services/authService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/view/:id',
      name: 'view',
      component: () => import('../views/ArticleView.vue')
    },
    {
      path: '/author/:id',
      name: 'author',
      component: () => import('../views/Author.vue')
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../views/Category.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/myarticle',
      name: 'myarticle',
      component: () => import('../views/dashboard/MyArticle.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/dashboard/AddArticle.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categorydash',
      name: 'categorydash',
      component: () => import('../views/dashboard/Category.vue'),
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If route requires auth, check if user is logged in
    const loggedIn = await authService.isLoggedIn();

    if (!loggedIn) {
      localStorage.removeItem('user-token')
      next({
        path: '/login'
      });
    } else {
      next();
    }
  } else {
    next(); // Always call `next()` at the end
  }
});

export default router
