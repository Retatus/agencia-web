const pricingRoutes = [
  {
    path: '/pricing/base-prices',
    name: 'pricing.base-prices',
    component: () => import('../base-prices/pages/BasePriceManagementPage.vue'),
    meta: {
      title: 'Precios base',
    },
  },
]

export default pricingRoutes
