import { defineStore } from 'pinia'
import CountryService from '../service/country.service'

export const useCountryStore = defineStore('countries', {
  state: () => ({
    countries: [],
    loaded: false,
    loading: false,
  }),

  actions: {
    async getCountries() {
      if (this.loaded) return

      try {
        this.loading = true

        const response = await CountryService.getAll()

        this.countries = response.data ?? response
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    getCountryByIso(iso) {
      return this.countries.find((country) => country.iso === iso)
    },
  },
})
