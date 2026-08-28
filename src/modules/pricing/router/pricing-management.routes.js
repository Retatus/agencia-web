import PricingCorePage from '../prices/PricingManagementPage.vue'

const pricingManagementRoutes = [
  {
    path: '/pricing/management',

    name: 'pricing.management',

    component: PricingCorePage,

    meta: {
      title: 'Gestión de tarifas',

      requiresAuth: true,
    },
  },
]

export default pricingManagementRoutes
