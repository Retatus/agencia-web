import api from '@/services/api'

const PricingCatalogService = {
  getCurrencies(params = {}) {
    return api.get('/currencies', {
      params,
    })
  },

  getPriceTypes(params = {}) {
    return api.get('/pricing/price-types', {
      params,
    })
  },

  getPassengerTypes(params = {}) {
    return api.get('/passenger-types', {
      params,
    })
  },

  getProviders(params = {}) {
    return api.get('/providers/select', {
      params,
    })
  },

  getServiceCategories(params = {}) {
    return api.get('/service-categories', {
      params,
    })
  },

  async getAll() {
    const [
      currenciesResponse,
      priceTypesResponse,
      passengerTypesResponse,
      providersResponse,
      categoriesResponse,
    ] = await Promise.all([
      this.getCurrencies({
        active: 1,
      }),

      this.getPriceTypes({
        active: 1,
      }),

      this.getPassengerTypes({
        active: 1,
      }),

      this.getProviders({
        active: 1,
      }),

      this.getServiceCategories({
        active: 1,
      }),
    ])

    return {
      currencies: currenciesResponse.data.data ?? [],

      priceTypes: priceTypesResponse.data.data ?? [],

      passengerTypes: passengerTypesResponse.data.data ?? [],

      providers: providersResponse.data.data ?? [],

      categories: categoriesResponse.data.data ?? [],
    }
  },
}

export default PricingCatalogService
