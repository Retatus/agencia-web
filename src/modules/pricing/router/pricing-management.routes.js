import PricingCorePage from '../prices/PricingManagementPage.vue'
import CommercialPricingPage from '../prices/CommercialPricingPage.vue'
import ExchangeRateManagementPage from '../prices/ExchangeRateManagementPage.vue'

const pricingManagementRoutes = [
  {
    path: '/pricing/exchange-rates',
    name: 'pricing.exchange-rates',
    component: ExchangeRateManagementPage,
    meta: {
      title: 'Tipos de cambio',
      requiresAuth: true,
    },
  },
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
