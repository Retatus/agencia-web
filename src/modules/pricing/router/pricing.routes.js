const pricingRoutes = [
  /*
  |--------------------------------------------------------------------------
  | Base Prices
  |--------------------------------------------------------------------------
  */

  {
    path: '/pricing/base-prices',
    name: 'pricing.base-prices',
    component: () => import('../base-prices/pages/BasePriceManagementPage.vue'),
    meta: {
      title: 'Precios base',
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Price List Items
  |--------------------------------------------------------------------------
  */

  {
    path: '/pricing/price-list-items',
    name: 'pricing.price-list-items',
    component: () => import('../price-list-items/pages/PriceListItemManagementPage.vue'),
    meta: {
      title: 'Reglas de listas de precios',
    },
  },
]

export default pricingRoutes
