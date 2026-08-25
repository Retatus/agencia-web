import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import customerRoutes from '@/modules/crm/customer.routes.js'
import providerRoutes from '@/modules/catalog/providers/router/provider.routes.js'
import serviceRoutes from '@/modules/catalog/services/router/service.routes.js'
import quotationRoutes from '@/modules/quotation/router/quotation.routes.js'
import PricingCorePage from '@/modules/pricing/prices/PricingCorePage.vue'
import pricingManagementRoutes from '@/modules/pricing/router/pricing-management.routes'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        ...customerRoutes,
        ...providerRoutes,
        ...serviceRoutes,
        ...quotationRoutes,
        {
          path: 'ui-components',
          name: 'ui.components',
          component: () => import('@/views/UiShowcaseView.vue'),
          meta: {
            title: 'Componentes UI',
          },
        },
        {
          path: '/pricing',
          children: [
            {
              path: 'prices',
              name: 'pricing.prices',
              component: PricingCorePage,
            },
          ],
        },
        ...pricingManagementRoutes,
      ],
    },
    // Las rutas públicas, como login, van fuera de AppLayout.
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/auth/LoginPage.vue'),
    //   meta: {
    //     public: true,
    //     title: 'Iniciar sesión',
    //   },
    // },

    // // Ruta no encontrada
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'not-found',
    //   component: () => import('@/views/NotFoundPage.vue'),
    // },
  ],
})

export default router
