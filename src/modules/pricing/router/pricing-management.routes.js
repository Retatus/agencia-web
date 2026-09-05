import PricingCorePage from '../prices/PricingManagementPage.vue'
import CommercialPricingPage from '../prices/CommercialPricingPage.vue'

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
  {
    path: '/pricing/commercial',
    name: 'pricing.commercial',
    component: CommercialPricingPage,
    meta: {
      title: 'Temporadas y promociones',
      requiresAuth: true,
    },
  },
]

export default pricingManagementRoutes
