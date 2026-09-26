import { defineStore } from 'pinia'
import { toRaw } from 'vue'

import QuotationService from '../services/quotation.service'
import { passengerActions } from './modules/quotation-passenger.actions'
import { itemActions } from './modules/quotation-item.actions'

/*
|--------------------------------------------------------------------------
| HELPERS LOCALES
|--------------------------------------------------------------------------
*/

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value))
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return Number.isNaN(date.getTime()) ? null : date
}

function addDays(value, days) {
  const date = parseDate(value)

  if (!date) return null

  date.setUTCDate(date.getUTCDate() + Number(days))

  return date.toISOString().slice(0, 10)
}

function differenceInDays(from, to) {
  const start = parseDate(from)
  const end = parseDate(to)

  if (!start || !end) return 0

  return Math.round((end.getTime() - start.getTime()) / 86400000)
}

/*
|--------------------------------------------------------------------------
| CREATE QUOTATION
|--------------------------------------------------------------------------
*/

function createQuotation() {
  // Obtener fechas actuales
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Formatear fechas a YYYY-MM-DD para inputs type="date"
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    id: null,
    uuid: null,

    code: 'COT-000003', // code: '',

    customer_id: 3, // customer_id: null,

    tourist_destination_id: null,

    tourist_destination_name: null,

    currency_id: 1,

    quotation_status_id: null,

    exchange_rate: 1,

    // Fechas inicializadas
    travel_date: formatDate(tomorrow), // Viaje comienza mañana por defecto

    valid_until: formatDate(tomorrow), // Se sincroniza con el último día del itinerario

    commercial_valid_until: formatDate(today),

    notes: '',

    subtotal: 0,

    discount: 0,

    tax: 0,

    total: 0,

    calculation_status: 'CURRENT',

    calculation_dirty_reasons: [],

    pending_calculation_items: [],

    calculated_at: null,

    status: {
      code: 'DRAFT',
      name: 'Borrador',
    },

    allowed_actions: {
      edit: true,
      recalculate: true,
      mark_ready: false,
      reopen: false,
      send: false,
      resend: false,
      confirm: false,
      reject: false,
      cancel: true,
      print: false,
      export_pdf: false,
    },

    active: true,

    passengers: [],

    itineraries: [],
  }
}

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

export const useQuotationStore = defineStore('quotation', {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  state: () => ({
    loading: false,

    saving: false,

    /*
    |--------------------------------------------------------------------------
    | Listado de cotizaciones
    |--------------------------------------------------------------------------
    */

    items: [],

    listMeta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Cotización actual
    |--------------------------------------------------------------------------
    */

    quotation: createQuotation(),

    /*
    |--------------------------------------------------------------------------
    | Itinerario seleccionado
    |--------------------------------------------------------------------------
    */

    selectedItineraryUuid: null,

    changedPassengers: new Map(),
  }),

  /*
  |--------------------------------------------------------------------------
  | GETTERS
  |--------------------------------------------------------------------------
  */

  getters: {
    /*
    |--------------------------------------------------------------------------
    | Cotización
    |--------------------------------------------------------------------------
    */

    isNew: (state) => !state.quotation.uuid,

    quotationUuid: (state) => state.quotation.uuid,

    /*
    |--------------------------------------------------------------------------
    | Itinerario seleccionado
    |--------------------------------------------------------------------------
    */

    selectedItinerary(state) {
      return (
        state.quotation.itineraries.find(
          (itinerary) => itinerary.uuid === state.selectedItineraryUuid,
        ) ?? null
      )
    },

    /*
    |--------------------------------------------------------------------------
    | Items del itinerario seleccionado
    |--------------------------------------------------------------------------
    */

    selectedItems() {
      return this.selectedItinerary?.items ?? []
    },

    /*
    |--------------------------------------------------------------------------
    | Cantidades
    |--------------------------------------------------------------------------
    */

    itineraryCount: (state) => state.quotation.itineraries.length,

    /*
    |--------------------------------------------------------------------------
    | Cantidad física de quotation_items
    |--------------------------------------------------------------------------
    |
    | Un hotel:
    |
    | Simple
    | Doble
    | Triple
    |
    | cuenta como 3.
    |
    */

    itemCount(state) {
      return state.quotation.itineraries.reduce(
        (total, itinerary) => total + (itinerary.items?.length ?? 0),
        0,
      )
    },

    /*
    |--------------------------------------------------------------------------
    | Cantidad lógica de servicios
    |--------------------------------------------------------------------------
    |
    | Un grupo completo cuenta como 1.
    |
    */

    logicalItemCount(state) {
      let total = 0

      state.quotation.itineraries.forEach((itinerary) => {
        const keys = new Set()

        ;(itinerary.items ?? []).forEach((item) => {
          keys.add(item.group_uuid ?? item.uuid)
        })

        total += keys.size
      })

      return total
    },

    hasItineraries: (state) => state.quotation.itineraries.length > 0,

    /*
    |--------------------------------------------------------------------------
    | Totales
    |--------------------------------------------------------------------------
    */

    subtotal: (state) => Number(state.quotation.subtotal ?? 0),

    discount: (state) => Number(state.quotation.discount ?? 0),

    tax: (state) => Number(state.quotation.tax ?? 0),

    total: (state) => Number(state.quotation.total ?? 0),

    /*
    |--------------------------------------------------------------------------
    | Pasajeros
    |--------------------------------------------------------------------------
    */

    hasPassengerChanges(state) {
      return state.changedPassengers.size > 0
    },

    passengerChangedCount(state) {
      return state.changedPassengers.size
    },

    calculationDirty: (state) => state.quotation.calculation_status === 'DIRTY',

    pendingCalculationCount: (state) =>
      (state.quotation.pending_calculation_items ?? []).length,

    statusCode: (state) => state.quotation.status?.code ?? 'DRAFT',

    allowedActions: (state) => state.quotation.allowed_actions ?? {},

    canEdit: (state) => state.quotation.allowed_actions?.edit ?? !state.quotation.uuid,
  },

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

  actions: {
    calculationItemKey(item) {
      return item?.group_uuid ?? item?.uuid ?? null
    },

    catalogCalculationKeys(itineraryUuid = null) {
      const keys = new Set()

      this.quotation.itineraries.forEach((itinerary) => {
        if (itineraryUuid && itinerary.uuid !== itineraryUuid) return

        ;(itinerary.items ?? []).forEach((item) => {
          if (item.item_type !== 'CATALOG' || item.active === false) return

          const key = this.calculationItemKey(item)
          if (key) keys.add(key)
        })
      })

      return [...keys]
    },

    markCalculationDirty(reason, itineraryUuid = null) {
      const affectedKeys = this.catalogCalculationKeys(itineraryUuid)

      if (!affectedKeys.length) return

      this.quotation.pending_calculation_items = [
        ...new Set([...(this.quotation.pending_calculation_items ?? []), ...affectedKeys]),
      ]
      this.quotation.calculation_dirty_reasons = [
        ...new Set([...(this.quotation.calculation_dirty_reasons ?? []), reason]),
      ]
      this.quotation.calculation_status = 'DIRTY'
      this.quotation.calculated_at = null
    },

    markItemRecalculated(itemOrKey) {
      const key =
        typeof itemOrKey === 'string' ? itemOrKey : this.calculationItemKey(itemOrKey)

      if (!key) return

      this.quotation.pending_calculation_items = (
        this.quotation.pending_calculation_items ?? []
      ).filter((pendingKey) => pendingKey !== key)

      if (!this.quotation.pending_calculation_items.length) {
        this.quotation.calculation_status = 'CURRENT'
        this.quotation.calculation_dirty_reasons = []
        this.quotation.calculated_at = new Date().toISOString()
      }
    },

    forgetPendingCalculation(itemOrKey) {
      this.markItemRecalculated(itemOrKey)
    },

    firstPendingCalculationItem() {
      const pending = new Set(this.quotation.pending_calculation_items ?? [])

      for (const itinerary of this.quotation.itineraries) {
        const item = (itinerary.items ?? []).find((current) =>
          pending.has(this.calculationItemKey(current)),
        )

        if (item) return { itinerary, item }
      }

      return null
    },

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

    /*
    |--------------------------------------------------------------------------
    | LOAD
    |--------------------------------------------------------------------------
    */

    async load(uuid) {
      this.loading = true

      try {
        const response = await QuotationService.show(uuid)

        this.quotation = response.data.data

        this.quotation.calculation_status = this.quotation.calculation_status ?? 'CURRENT'
        this.quotation.calculation_dirty_reasons =
          this.quotation.calculation_dirty_reasons ?? []
        this.quotation.pending_calculation_items =
          this.quotation.pending_calculation_items ?? []

        if (!this.quotation.passengers) {
          this.quotation.passengers = []
        }

        if (!this.quotation.itineraries) {
          this.quotation.itineraries = []
        }

        /*
        |--------------------------------------------------------------------------
        | Asegurar estructura
        |--------------------------------------------------------------------------
        */

        this.quotation.itineraries.forEach((itinerary) => {
          if (!itinerary.items) {
            itinerary.items = []
          }

          itinerary.subtotal = Number(itinerary.subtotal ?? 0)

          /*
          |--------------------------------------------------------------------------
          | Normalizar nuevos campos
          |--------------------------------------------------------------------------
          */

          itinerary.items.forEach((item) => {
            item.calculation_type = item.calculation_type ?? 'generic'

            item.group_uuid = item.group_uuid ?? null

            item.group_index = item.group_index ?? null

            item.duration = Number(item.duration ?? 1)
          })
        })

        if (this.quotation.itineraries.length > 0) {
          this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
        }

        this.syncValidUntilWithLastItinerary()

        this.sortItems()

        this.refreshCalculations()

        return this.quotation
      } finally {
        this.loading = false
      }
    },

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */

    async fetchQuotations(params = {}) {
      this.loading = true

      try {
        const response = await QuotationService.getAll(params)

        this.items = response.data.data ?? []
        this.listMeta = {
          ...this.listMeta,
          ...(response.data.meta ?? {}),
        }
      } finally {
        this.loading = false
      }
    },

    /*
    |--------------------------------------------------------------------------
    | SAVE QUOTATION
    |--------------------------------------------------------------------------
    */

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

        this.syncValidUntilWithLastItinerary()

        this.sortItems()

        this.refreshCalculations()

        return response
      } finally {
        this.saving = false
      }
    },

    async changeStatus(statusCode, reason = null) {
      if (this.isNew) {
        throw new Error('Guarde la cotización antes de cambiar su estado.')
      }

      const response = await QuotationService.changeStatus(
        this.quotation.uuid,
        statusCode,
        reason,
      )

      this.quotation = response.data.data

      if (!this.quotation.itineraries) this.quotation.itineraries = []
      if (!this.quotation.passengers) this.quotation.passengers = []

      return response
    },

    /*
    |--------------------------------------------------------------------------
    | DUPLICATE QUOTATION
    |--------------------------------------------------------------------------
    */

    duplicate() {
      const quotation = clonePlain(this.quotation)

      quotation.id = null

      quotation.uuid = null

      quotation.code = ''

      quotation.quotation_status_id = null

      quotation.status = { code: 'DRAFT', name: 'Borrador' }
      quotation.allowed_actions = {
        edit: true,
        recalculate: true,
        mark_ready: false,
        reopen: false,
        send: false,
        resend: false,
        confirm: false,
        reject: false,
        cancel: true,
        print: false,
        export_pdf: false,
      }
      quotation.status_changed_at = null
      quotation.sent_at = null
      quotation.confirmed_at = null
      quotation.rejected_at = null
      quotation.cancelled_at = null
      quotation.status_reason = null

      /*
      |--------------------------------------------------------------------------
      | Mapa para regenerar group_uuid
      |--------------------------------------------------------------------------
      */

      const groupMap = new Map()

      quotation.itineraries = (quotation.itineraries ?? []).map((itinerary) => {
        return {
          ...itinerary,

          id: null,

          uuid: crypto.randomUUID(),

          quotation_id: null,

          items: (itinerary.items ?? []).map((item) => {
            let groupUuid = null

            if (item.group_uuid) {
              if (!groupMap.has(item.group_uuid)) {
                groupMap.set(item.group_uuid, crypto.randomUUID())
              }

              groupUuid = groupMap.get(item.group_uuid)
            }

            return {
              ...item,

              id: null,

              uuid: crypto.randomUUID(),

              quotation_itinerary_id: null,

              group_uuid: groupUuid,
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

      this.quotation = quotation

      this.selectedItineraryUuid =
        quotation.itineraries.length > 0 ? quotation.itineraries[0].uuid : null

      this.refreshCalculations()

      return this.quotation
    },

    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */

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
    |--------------------------------------------------------------------------
    | ITINERARIES
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */

    addItinerary(data = {}) {
      const previousItinerary = this.quotation.itineraries.at(-1)
      const defaultTravelDate = previousItinerary?.travel_date
        ? addDays(previousItinerary.travel_date, 1)
        : this.quotation.travel_date || null

      const itinerary = {
        id: null,

        uuid: crypto.randomUUID(),

        quotation_id: this.quotation.id,

        day_number: this.quotation.itineraries.length + 1,

        travel_date: defaultTravelDate,

        title: '',

        description: '',

        sort_order: this.quotation.itineraries.length + 1,

        subtotal: 0,

        items: [],

        ...clonePlain(data),
      }

      this.quotation.itineraries.push(itinerary)

      this.selectedItineraryUuid = itinerary.uuid

      this.renumberItineraries()

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()

      return itinerary
    },

    applyTouristDestination(destination) {
      const startDate = this.quotation.travel_date
      const now = new Date().toISOString()

      this.quotation.tourist_destination_id = destination.id
      this.quotation.tourist_destination_name = destination.name

      if (destination.currency_id) {
        this.quotation.currency_id = destination.currency_id
        this.quotation.exchange_rate = 1
      }

      this.quotation.itineraries = (destination.days ?? []).map((day, dayIndex) => {
        const items = (day.items ?? [])
          .filter((item) => item.active !== false)
          .map((item, itemIndex) => {
            const quantity = Number(item.quantity ?? 1)
            const unitCost = Number(item.estimated_cost ?? 0)
            const unitPrice = Number(item.estimated_price ?? 0)

            return {
              id: null,
              uuid: crypto.randomUUID(),
              quotation_itinerary_id: null,
              service_id: null,
              service_variant_id: null,
              item_type: 'CUSTOM',
              calculation_type: 'generic',
              group_uuid: null,
              group_index: null,
              name: item.name,
              variant_name: null,
              description: item.description ?? '',
              duration: Number(item.duration ?? 1),
              quantity,
              price_id: null,
              price_list_id: null,
              price_list_item_id: null,
              base_cost: unitCost,
              base_price: unitPrice,
              unit_cost: unitCost,
              unit_price: unitPrice,
              subtotal: quantity * unitPrice,
              subtotal_cost: quantity * unitCost,
              subtotal_sale: quantity * unitPrice,
              sort_order: itemIndex + 1,
              notes: 'Importe aproximado importado desde una plantilla de destino.',
              active: true,
              calculated_at: now,
            }
          })

        return {
          id: null,
          uuid: crypto.randomUUID(),
          quotation_id: this.quotation.id,
          day_number: dayIndex + 1,
          travel_date: startDate ? addDays(startDate, dayIndex) : null,
          title: day.title,
          description: day.description ?? '',
          sort_order: dayIndex + 1,
          subtotal: items.reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0),
          items,
        }
      })

      this.selectedItineraryUuid = this.quotation.itineraries[0]?.uuid ?? null
      this.quotation.pending_calculation_items = []
      this.quotation.calculation_dirty_reasons = []
      this.quotation.calculation_status = 'CURRENT'
      this.quotation.calculated_at = now
      this.syncValidUntilWithLastItinerary()
      this.refreshCalculations()
    },

    updateItinerary(uuid, values) {
      const itinerary = this.getItinerary(uuid)

      if (!itinerary) {
        return
      }

      Object.assign(itinerary, values)

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()
    },

    updateItineraryTravelDate(uuid, travelDate, shiftFollowing = false) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index < 0 || !parseDate(travelDate)) {
        return { success: false, message: 'Seleccione una fecha válida.' }
      }

      const itinerary = this.quotation.itineraries[index]
      const previous = this.quotation.itineraries[index - 1]
      const next = this.quotation.itineraries[index + 1]

      if (previous?.travel_date && travelDate <= previous.travel_date) {
        return {
          success: false,
          message: `La fecha debe ser posterior a la del día ${previous.day_number}.`,
        }
      }

      if (!shiftFollowing && next?.travel_date && travelDate >= next.travel_date) {
        return {
          success: false,
          message: `La fecha debe ser anterior a la del día ${next.day_number}, o debe desplazar los días posteriores.`,
        }
      }

      const difference = differenceInDays(itinerary.travel_date, travelDate)

      if (difference !== 0) {
        this.markCalculationDirty('ITINERARY_DATE_CHANGED', uuid)

        if (shiftFollowing) {
          this.quotation.itineraries.slice(index + 1).forEach((followingItinerary) => {
            this.markCalculationDirty('ITINERARY_DATE_CHANGED', followingItinerary.uuid)
          })
        }
      }

      itinerary.travel_date = travelDate

      if (shiftFollowing && difference !== 0) {
        this.quotation.itineraries.slice(index + 1).forEach((followingItinerary) => {
          if (followingItinerary.travel_date) {
            followingItinerary.travel_date = addDays(followingItinerary.travel_date, difference)
          }
        })
      }

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()

      return { success: true }
    },

    removeItinerary(uuid) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index < 0) {
        return
      }

      const removed = this.quotation.itineraries[index]
      ;(removed.items ?? []).forEach((item) => this.forgetPendingCalculation(item))
      this.quotation.itineraries.splice(index, 1)

      this.renumberItineraries()

      if (this.quotation.itineraries.length) {
        this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
      } else {
        this.selectedItineraryUuid = null
      }

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()
    },

    /*
    |--------------------------------------------------------------------------
    | DUPLICATE ITINERARY
    |--------------------------------------------------------------------------
    */

    duplicateItinerary(uuid) {
      const itinerary = this.getItinerary(uuid)

      if (!itinerary) {
        return
      }

      const copy = clonePlain(toRaw(itinerary))

      copy.id = null

      copy.uuid = crypto.randomUUID()

      copy.travel_date = itinerary.travel_date ? addDays(itinerary.travel_date, 1) : null

      /*
      |--------------------------------------------------------------------------
      | Nuevos group_uuid dentro de la copia
      |--------------------------------------------------------------------------
      */

      const groupMap = new Map()

      copy.items = copy.items.map((item) => {
        let groupUuid = null

        if (item.group_uuid) {
          if (!groupMap.has(item.group_uuid)) {
            groupMap.set(item.group_uuid, crypto.randomUUID())
          }

          groupUuid = groupMap.get(item.group_uuid)
        }

        return {
          ...item,

          id: null,

          uuid: crypto.randomUUID(),

          quotation_itinerary_id: null,

          group_uuid: groupUuid,
        }
      })

      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      this.quotation.itineraries.slice(index + 1).forEach((followingItinerary) => {
        if (followingItinerary.travel_date) {
          followingItinerary.travel_date = addDays(followingItinerary.travel_date, 1)
        }
      })

      this.quotation.itineraries.splice(index + 1, 0, copy)

      this.renumberItineraries()

      this.selectedItineraryUuid = copy.uuid

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()

      return copy
    },

    selectItinerary(uuid) {
      this.selectedItineraryUuid = uuid
    },

    moveItineraryUp(uuid) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index <= 0) {
        return
      }

      const dateSlots = [
        this.quotation.itineraries[index - 1].travel_date,
        this.quotation.itineraries[index].travel_date,
      ]

      ;[this.quotation.itineraries[index - 1], this.quotation.itineraries[index]] = [
        this.quotation.itineraries[index],

        this.quotation.itineraries[index - 1],
      ]

      this.quotation.itineraries[index - 1].travel_date = dateSlots[0]
      this.quotation.itineraries[index].travel_date = dateSlots[1]

      this.renumberItineraries()

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()
    },

    moveItineraryDown(uuid) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index < 0 || index >= this.quotation.itineraries.length - 1) {
        return
      }

      const dateSlots = [
        this.quotation.itineraries[index].travel_date,
        this.quotation.itineraries[index + 1].travel_date,
      ]

      ;[this.quotation.itineraries[index], this.quotation.itineraries[index + 1]] = [
        this.quotation.itineraries[index + 1],

        this.quotation.itineraries[index],
      ]

      this.quotation.itineraries[index].travel_date = dateSlots[0]
      this.quotation.itineraries[index + 1].travel_date = dateSlots[1]

      this.renumberItineraries()

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()
    },

    renumberItineraries() {
      this.quotation.itineraries.forEach((itinerary, index) => {
        itinerary.day_number = index + 1

        itinerary.sort_order = index + 1
      })
    },

    syncValidUntilWithLastItinerary() {
      const lastItinerary = [...this.quotation.itineraries]
        .reverse()
        .find((itinerary) => itinerary.travel_date)

      this.quotation.valid_until = lastItinerary?.travel_date ?? this.quotation.travel_date ?? null
    },

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | ITEMS
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */
    ...itemActions,
    /*
    |--------------------------------------------------------------------------
    | Acciones importadas
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | PASSENGERS
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */
    ...passengerActions,

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */

    generateUuid() {
      return crypto.randomUUID()
    },

    /*
    |--------------------------------------------------------------------------
    | ITINERARY
    |--------------------------------------------------------------------------
    */

    getItinerary(uuid) {
      return this.quotation.itineraries.find((itinerary) => itinerary.uuid === uuid) ?? null
    },

    findItinerary(uuid) {
      return this.getItinerary(uuid)
    },

    /*
    |--------------------------------------------------------------------------
    | ITEM
    |--------------------------------------------------------------------------
    */

    findItem(uuid) {
      if (!this.selectedItinerary) {
        return null
      }

      return this.selectedItinerary.items.find((item) => item.uuid === uuid) ?? null
    },

    getItem(itineraryUuid, itemUuid) {
      const itinerary = this.getItinerary(itineraryUuid)

      if (!itinerary) {
        return null
      }

      return itinerary.items.find((item) => item.uuid === itemUuid) ?? null
    },

    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    refresh() {
      this.sortItineraries()

      this.sortItems()

      this.renumberItineraries()

      /*
      |--------------------------------------------------------------------------
      | Renumerar items por itinerario
      |--------------------------------------------------------------------------
      */

      this.quotation.itineraries.forEach((itinerary) => {
        const previous = this.selectedItineraryUuid

        this.selectedItineraryUuid = itinerary.uuid

        this.renumberItems()

        this.selectedItineraryUuid = previous
      })

      this.refreshCalculations()
    },

    clear() {
      this.reset()
    },

    /*
    |--------------------------------------------------------------------------
    | EXISTS
    |--------------------------------------------------------------------------
    */

    existsItinerary(uuid) {
      return this.getItinerary(uuid) !== null
    },

    /*
    |--------------------------------------------------------------------------
    | SELECTED ITINERARY
    |--------------------------------------------------------------------------
    */

    setSelectedItinerary(uuid) {
      if (!this.existsItinerary(uuid)) {
        return
      }

      this.selectedItineraryUuid = uuid
    },

    isSelectedItinerary(uuid) {
      return this.selectedItineraryUuid === uuid
    },

    /*
    |--------------------------------------------------------------------------
    | QUOTATION VALUES
    |--------------------------------------------------------------------------
    */

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
      if (Number(this.quotation.currency_id) !== Number(currencyId)) {
        this.markCalculationDirty('CURRENCY_CHANGED')
      }

      this.quotation.currency_id = currencyId
    },

    updateTravelDate(date) {
      if (!parseDate(date)) return false

      const previousDate = this.quotation.travel_date
      const difference = differenceInDays(previousDate, date)

      if (difference !== 0) {
        this.markCalculationDirty('TRAVEL_DATE_CHANGED')
      }

      this.quotation.travel_date = date

      if (difference !== 0) {
        this.quotation.itineraries.forEach((itinerary, index) => {
          itinerary.travel_date = itinerary.travel_date
            ? addDays(itinerary.travel_date, difference)
            : addDays(date, index)
        })
      } else {
        this.updateTravelDates()
      }

      this.syncValidUntilWithLastItinerary()

      this.refreshCalculations()

      return true
    },

    updateCustomer(customerId) {
      this.quotation.customer_id = customerId
    },

    updateStatus(statusId) {
      this.quotation.quotation_status_id = statusId
    },

    updateNotes(notes) {
      this.quotation.notes = notes
    },
  },
})
