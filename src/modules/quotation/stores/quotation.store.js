import { defineStore } from 'pinia'
import QuotationService from '../services/quotation.service'
import { toRaw } from 'vue'

function createQuotation() {
  return {
    id: null,
    uuid: null,
    code: '',

    customer_id: null,
    price_list_id: null,
    currency_id: 1,
    quotation_status_id: null,

    exchange_rate: 1,

    travel_date: null,
    valid_until: null,

    notes: '',

    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,

    active: true,

    passengers: [],

    itineraries: [],
  }
}

export const useQuotationStore = defineStore('quotation', {
  state: () => ({
    loading: false,
    saving: false,

    quotation: createQuotation(),

    selectedItineraryUuid: null,
  }),

  getters: {
    // Cotización
    isNew: (state) => !state.quotation.uuid,

    quotationUuid: (state) => state.quotation.uuid,

    // Itinerario seleccionado
    selectedItinerary(state) {
      return state.quotation.itineraries.find((x) => x.uuid === state.selectedItineraryUuid) ?? null
    },

    // Items del itinerario seleccionado
    selectedItems() {
      return this.selectedItinerary?.items ?? []
    },

    // Cantidades
    itineraryCount: (state) => state.quotation.itineraries.length,

    itemCount(state) {
      return state.quotation.itineraries.reduce(
        (total, itinerary) => total + itinerary.items.length,
        0,
      )
    },

    hasItineraries: (state) => state.quotation.itineraries.length > 0,

    // Totales
    subtotal: (state) => Number(state.quotation.subtotal ?? 0),

    discount: (state) => Number(state.quotation.discount ?? 0),

    tax: (state) => Number(state.quotation.tax ?? 0),

    total: (state) => Number(state.quotation.total ?? 0),
  },

  actions: {
    /*
|--------------------------------------------------------------------------
| LIFECYCLE
|--------------------------------------------------------------------------
*/

    reset() {
      this.loading = false
      this.saving = false

      this.selectedItineraryUuid = null

      this.quotation = createQuotation()
    },

    newQuotation() {
      this.reset()

      this.addItinerary()
    },

    async load(uuid) {
      this.loading = true

      try {
        const response = await QuotationService.show(uuid)

        this.quotation = response.data.data

        if (!this.quotation.passengers) {
          this.quotation.passengers = []
        }

        if (!this.quotation.itineraries) {
          this.quotation.itineraries = []
        }

        // Asegurar estructura
        this.quotation.itineraries.forEach((itinerary) => {
          if (!itinerary.items) {
            itinerary.items = []
          }

          itinerary.subtotal = Number(itinerary.subtotal ?? 0)
        })

        if (this.quotation.itineraries.length > 0) {
          this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
        }

        this.refreshCalculations()

        return this.quotation
      } finally {
        this.loading = false
      }
    },

    async fetchQuotations() {
      this.loading = true

      try {
        const response = await QuotationService.getAll()
        this.items = response.data.data
      } finally {
        this.loading = false
      }
    },

    async save() {
      this.saving = true

      try {
        this.refreshCalculations()

        let response

        if (this.isNew) {
          response = await QuotationService.store(this.quotation)
        } else {
          response = await QuotationService.update(this.quotation.uuid, this.quotation)
        }

        this.quotation = response.data.data

        if (!this.quotation.itineraries) {
          this.quotation.itineraries = []
        }

        this.quotation.itineraries.forEach((itinerary) => {
          if (!itinerary.items) {
            itinerary.items = []
          }
        })

        if (this.quotation.itineraries.length > 0) {
          this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
        }

        return response
      } finally {
        this.saving = false
      }
    },

    duplicate() {
      const quotation = JSON.parse(JSON.stringify(this.quotation))

      quotation.id = null
      quotation.uuid = null
      quotation.code = ''

      quotation.quotation_status_id = null

      quotation.itineraries = (quotation.itineraries ?? []).map((itinerary) => {
        return {
          ...itinerary,
          id: null,
          uuid: crypto.randomUUID(),
          quotation_id: null,

          items: (itinerary.items ?? []).map((item) => {
            return {
              ...item,
              id: null,
              uuid: crypto.randomUUID(),
              quotation_itinerary_id: null,
            }
          }),
        }
      })

      quotation.passengers = (quotation.passengers ?? []).map((passenger) => {
        return {
          ...passenger,
          id: null,
          uuid: crypto.randomUUID(),
          quotation_id: null,
        }
      })

      // ASIGNAR COPIA AL STORE

      this.quotation = quotation

      this.selectedItineraryUuid =
        quotation.itineraries.length > 0 ? quotation.itineraries[0].uuid : null

      this.refreshCalculations()
      return this.quotation
    },

    async destroy() {
      if (this.isNew) {
        this.reset()
        return
      }

      await QuotationService.destroy(this.quotation.uuid)

      this.reset()
    },

    /*
|--------------------------------------------------------------------------
| ITINERARIES
|--------------------------------------------------------------------------
*/

    addItinerary(data = {}) {
      const itinerary = {
        id: null,
        uuid: crypto.randomUUID(),

        quotation_id: this.quotation.id,

        day_number: this.quotation.itineraries.length + 1,

        travel_date: null,

        title: '',

        description: '',

        sort_order: this.quotation.itineraries.length + 1,

        subtotal: 0,

        items: [],

        ...structuredClone(data),
      }

      this.quotation.itineraries.push(itinerary)

      this.selectedItineraryUuid = itinerary.uuid

      this.renumberItineraries()

      this.refreshCalculations()

      return itinerary
    },

    updateItinerary(uuid, values) {
      const itinerary = this.getItinerary(uuid)

      if (!itinerary) return

      Object.assign(itinerary, values)

      this.refreshCalculations()
    },

    removeItinerary(uuid) {
      const index = this.quotation.itineraries.findIndex((x) => x.uuid === uuid)

      if (index < 0) return

      this.quotation.itineraries.splice(index, 1)

      this.renumberItineraries()

      if (this.quotation.itineraries.length) {
        this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
      } else {
        this.selectedItineraryUuid = null
      }

      this.refreshCalculations()
    },

    duplicateItinerary(uuid) {
      const itinerary = this.getItinerary(uuid)

      if (!itinerary) return

      const copy = structuredClone(toRaw(itinerary))

      copy.id = null
      copy.uuid = crypto.randomUUID()

      copy.items = copy.items.map((item) => ({
        ...item,
        id: null,
        uuid: crypto.randomUUID(),
      }))

      const index = this.quotation.itineraries.findIndex((x) => x.uuid === uuid)

      this.quotation.itineraries.splice(index + 1, 0, copy)

      this.renumberItineraries()

      this.selectedItineraryUuid = copy.uuid

      this.refreshCalculations()

      return copy
    },

    selectItinerary(uuid) {
      this.selectedItineraryUuid = uuid
    },

    moveItineraryUp(uuid) {
      const index = this.quotation.itineraries.findIndex((x) => x.uuid === uuid)

      if (index <= 0) return
      ;[this.quotation.itineraries[index - 1], this.quotation.itineraries[index]] = [
        this.quotation.itineraries[index],
        this.quotation.itineraries[index - 1],
      ]

      this.renumberItineraries()

      this.refreshCalculations()
    },

    moveItineraryDown(uuid) {
      const index = this.quotation.itineraries.findIndex((x) => x.uuid === uuid)

      if (index < 0 || index >= this.quotation.itineraries.length - 1) return
      ;[this.quotation.itineraries[index], this.quotation.itineraries[index + 1]] = [
        this.quotation.itineraries[index + 1],
        this.quotation.itineraries[index],
      ]

      this.renumberItineraries()

      this.refreshCalculations()
    },

    renumberItineraries() {
      this.quotation.itineraries.forEach((itinerary, index) => {
        itinerary.day_number = index + 1
        itinerary.sort_order = index + 1
      })
    },

    /*
|--------------------------------------------------------------------------
| ITEMS
|--------------------------------------------------------------------------
*/

    addItem(item = {}) {
      if (!this.selectedItinerary) return null

      const newItem = {
        id: null,
        uuid: crypto.randomUUID(),

        quotation_itinerary_id: this.selectedItinerary.id,

        service_id: null,
        service_variant_id: null,

        item_type: '',

        name: '',
        variant_name: '',
        description: '',
        duration: null,

        quantity: 1,

        price_id: null,

        unit_cost: 0,
        unit_price: 0,

        subtotal: 0,

        sort_order: this.selectedItems.length + 1,

        notes: '',

        active: true,

        ...structuredClone(item),
      }

      this.calculateItem(newItem)

      this.selectedItinerary.items.push(newItem)

      this.renumberItems()

      this.refreshCalculations()

      return newItem
    },

    updateItem(uuid, values) {
      const item = this.findItem(uuid)

      if (!item) return

      Object.assign(item, values)

      this.calculateItem(item)

      this.refreshCalculations()
    },

    removeItem(uuid) {
      if (!this.selectedItinerary) return

      const index = this.selectedItems.findIndex((item) => item.uuid === uuid)

      if (index < 0) return

      this.selectedItinerary.items.splice(index, 1)

      this.renumberItems()

      this.refreshCalculations()
    },

    duplicateItem(uuid) {
      const item = this.findItem(uuid)

      if (!item) return

      const copy = structuredClone(toRaw(item))

      copy.id = null
      copy.uuid = crypto.randomUUID()

      const index = this.selectedItems.findIndex((x) => x.uuid === uuid)

      this.selectedItinerary.items.splice(index + 1, 0, copy)

      this.renumberItems()

      this.refreshCalculations()

      return copy
    },

    toggleItem(uuid) {
      const item = this.findItem(uuid)

      if (!item) return

      item.active = !item.active

      this.refreshCalculations()
    },

    moveItemUp(uuid) {
      const index = this.selectedItems.findIndex((item) => item.uuid === uuid)

      if (index <= 0) return
      ;[this.selectedItems[index], this.selectedItems[index - 1]] = [
        this.selectedItems[index - 1],
        this.selectedItems[index],
      ]

      this.renumberItems()

      this.refreshCalculations()
    },

    moveItemDown(uuid) {
      const index = this.selectedItems.findIndex((item) => item.uuid === uuid)

      if (index < 0 || index >= this.selectedItems.length - 1) {
        return
      }

      ;[this.selectedItems[index], this.selectedItems[index + 1]] = [
        this.selectedItems[index + 1],
        this.selectedItems[index],
      ]

      this.renumberItems()

      this.refreshCalculations()
    },

    renumberItems() {
      if (!this.selectedItinerary) return

      this.selectedItems.forEach((item, index) => {
        item.sort_order = index + 1
      })
    },

    /*
|--------------------------------------------------------------------------
| CALCULATIONS
|--------------------------------------------------------------------------
*/

    calculateItem(item) {
      item.quantity = Number(item.quantity ?? 0)

      item.unit_cost = Number(item.unit_cost ?? 0)

      item.unit_price = Number(item.unit_price ?? 0)

      item.subtotal = item.active ? item.quantity * item.unit_price : 0

      return item.subtotal
    },

    calculateItinerary(itinerary) {
      itinerary.subtotal = 0

      itinerary.items.forEach((item) => {
        itinerary.subtotal += this.calculateItem(item)
      })

      return itinerary.subtotal
    },

    calculateQuotation() {
      let subtotal = 0

      this.quotation.itineraries.forEach((itinerary) => {
        subtotal += itinerary.subtotal
      })

      this.quotation.subtotal = subtotal

      this.quotation.discount = Number(this.quotation.discount ?? 0)

      this.quotation.tax = Number(this.quotation.tax ?? 0)

      this.quotation.total = subtotal - this.quotation.discount + this.quotation.tax

      return this.quotation.total
    },

    refreshCalculations() {
      this.quotation.itineraries.forEach((itinerary) => {
        this.calculateItinerary(itinerary)
      })

      this.calculateQuotation()
    },

    /*
|--------------------------------------------------------------------------
| DATES
|--------------------------------------------------------------------------
*/

    updateTravelDates() {
      if (!this.quotation.travel_date) return

      const start = new Date(this.quotation.travel_date)

      this.quotation.itineraries.forEach((itinerary, index) => {
        const date = new Date(start)

        date.setDate(start.getDate() + index)

        itinerary.travel_date = date.toISOString().substring(0, 10)
      })
    },

    /*
|--------------------------------------------------------------------------
| SORT
|--------------------------------------------------------------------------
*/

    sortItineraries() {
      this.quotation.itineraries.sort((a, b) => a.sort_order - b.sort_order)
    },

    sortItems() {
      this.quotation.itineraries.forEach((itinerary) => {
        itinerary.items.sort((a, b) => a.sort_order - b.sort_order)
      })
    },

    /*
|--------------------------------------------------------------------------
| PASSENGERS
|--------------------------------------------------------------------------
*/

    addPassenger(data = {}) {
      const passenger = {
        id: null,
        uuid: crypto.randomUUID(),

        quotation_id: this.quotation.id,

        passenger_type_id: null,

        first_name: '',
        last_name: '',

        birth_date: null,

        document_number: '',

        nationality: '',

        email: '',

        phone: '',

        notes: '',

        active: true,

        sort_order: this.quotation.passengers.length + 1,

        ...structuredClone(data),
      }

      this.quotation.passengers.push(passenger)

      this.renumberPassengers()

      return passenger
    },

    updatePassenger(uuid, values) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) return

      Object.assign(passenger, values)
    },

    removePassenger(uuid) {
      const index = this.quotation.passengers.findIndex((passenger) => passenger.uuid === uuid)

      if (index < 0) return

      this.quotation.passengers.splice(index, 1)

      this.renumberPassengers()
    },

    duplicatePassenger(uuid) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) return

      const copy = structuredClone(passenger)

      copy.id = null
      copy.uuid = crypto.randomUUID()

      const index = this.quotation.passengers.findIndex((x) => x.uuid === uuid)

      this.quotation.passengers.splice(index + 1, 0, copy)

      this.renumberPassengers()

      return copy
    },

    togglePassenger(uuid) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) return

      passenger.active = !passenger.active
    },

    movePassengerUp(uuid) {
      const index = this.quotation.passengers.findIndex((passenger) => passenger.uuid === uuid)

      if (index <= 0) return
      ;[this.quotation.passengers[index - 1], this.quotation.passengers[index]] = [
        this.quotation.passengers[index],
        this.quotation.passengers[index - 1],
      ]

      this.renumberPassengers()
    },

    movePassengerDown(uuid) {
      const index = this.quotation.passengers.findIndex((passenger) => passenger.uuid === uuid)

      if (index < 0 || index >= this.quotation.passengers.length - 1) {
        return
      }

      ;[this.quotation.passengers[index], this.quotation.passengers[index + 1]] = [
        this.quotation.passengers[index + 1],
        this.quotation.passengers[index],
      ]

      this.renumberPassengers()
    },

    renumberPassengers() {
      this.quotation.passengers.forEach((passenger, index) => {
        passenger.sort_order = index + 1
      })
    },

    /*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

    generateUuid() {
      return crypto.randomUUID()
    },

    getItinerary(uuid) {
      return this.quotation.itineraries.find((itinerary) => itinerary.uuid === uuid) ?? null
    },

    findItinerary(uuid) {
      return this.getItinerary(uuid)
    },

    findItem(uuid) {
      if (!this.selectedItinerary) return null

      return this.selectedItinerary.items.find((item) => item.uuid === uuid) ?? null
    },

    getItem(itineraryUuid, itemUuid) {
      const itinerary = this.getItinerary(itineraryUuid)

      if (!itinerary) return null

      return itinerary.items.find((item) => item.uuid === itemUuid) ?? null
    },

    refresh() {
      this.sortItineraries()

      this.sortItems()

      this.renumberItineraries()

      this.renumberItems()

      this.refreshCalculations()
    },

    clear() {
      this.reset()
    },

    existsItinerary(uuid) {
      return this.getItinerary(uuid) !== null
    },

    existsItem(uuid) {
      return this.findItem(uuid) !== null
    },

    setSelectedItinerary(uuid) {
      if (!this.existsItinerary(uuid)) return

      this.selectedItineraryUuid = uuid
    },

    isSelectedItinerary(uuid) {
      return this.selectedItineraryUuid === uuid
    },

    updateDiscount(value) {
      this.quotation.discount = Number(value ?? 0)

      this.refreshCalculations()
    },

    updateTax(value) {
      this.quotation.tax = Number(value ?? 0)

      this.refreshCalculations()
    },

    updateExchangeRate(value) {
      this.quotation.exchange_rate = Number(value ?? 1)
    },

    updateCurrency(currencyId) {
      this.quotation.currency_id = currencyId
    },

    updateTravelDate(date) {
      this.quotation.travel_date = date

      this.updateTravelDates()
    },

    updateCustomer(customerId) {
      this.quotation.customer_id = customerId
    },

    updatePriceList(priceListId) {
      this.quotation.price_list_id = priceListId
    },

    updateStatus(statusId) {
      this.quotation.quotation_status_id = statusId
    },

    updateNotes(notes) {
      this.quotation.notes = notes
    },

    findPassenger(uuid) {
      return this.quotation.passengers.find((passenger) => passenger.uuid === uuid) ?? null
    },

    getPassenger(uuid) {
      return this.findPassenger(uuid)
    },

    existsPassenger(uuid) {
      return this.findPassenger(uuid) !== null
    },
  },
})
