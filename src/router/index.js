import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

import PaisIndex from '@/views/paises/IndexView.vue'
import PaisForm from '@/views/paises/FormView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
      path: "/paises",
      component: PaisIndex
  },
  {
      path: "/paises/create",
      component: PaisForm
  },
  {
      path: "/paises/:id/edit",
      component: PaisForm,
      props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de protección
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();

//   if (to.meta.requiresAuth && !userStore.isAuthenticated) {
//     next('/');
//   } else {
//     next();
//   }
// });

export default router;
