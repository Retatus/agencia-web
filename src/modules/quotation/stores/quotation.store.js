import { defineStore } from 'pinia'
import { toRaw } from 'vue'

import QuotationService from '../services/quotation.service'

/*
|--------------------------------------------------------------------------
| HELPERS LOCALES
|--------------------------------------------------------------------------
*/

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value))
}

/*
|--------------------------------------------------------------------------
| CREATE QUOTATION
|--------------------------------------------------------------------------
*/

function createQuotation() {
  return {
    id: null,
    uuid: null,

    code: 'COT-000003', // code: '',

    customer_id: 3, // customer_id: null,

    price_list_id: 1, // price_list_id: null,

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
  },

  /*
    |--------------------------------------------------------------------------
    | ACTIONS
    |--------------------------------------------------------------------------
    */

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

    async fetchQuotations() {
      this.loading = true

      try {
        const response = await QuotationService.getAll()

        this.items = response.data.data
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

        this.sortItems()

        this.refreshCalculations()

        return response
      } finally {
        this.saving = false
      }
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

        ...clonePlain(data),
      }

      this.quotation.itineraries.push(itinerary)

      this.selectedItineraryUuid = itinerary.uuid

      this.renumberItineraries()

      this.refreshCalculations()

      return itinerary
    },

    updateItinerary(uuid, values) {
      const itinerary = this.getItinerary(uuid)

      if (!itinerary) {
        return
      }

      Object.assign(itinerary, values)

      this.refreshCalculations()
    },

    removeItinerary(uuid) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index < 0) {
        return
      }

      this.quotation.itineraries.splice(index, 1)

      this.renumberItineraries()

      if (this.quotation.itineraries.length) {
        this.selectedItineraryUuid = this.quotation.itineraries[0].uuid
      } else {
        this.selectedItineraryUuid = null
      }

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
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index <= 0) {
        return
      }

      ;[this.quotation.itineraries[index - 1], this.quotation.itineraries[index]] = [
        this.quotation.itineraries[index],

        this.quotation.itineraries[index - 1],
      ]

      this.renumberItineraries()

      this.refreshCalculations()
    },

    moveItineraryDown(uuid) {
      const index = this.quotation.itineraries.findIndex((itinerary) => itinerary.uuid === uuid)

      if (index < 0 || index >= this.quotation.itineraries.length - 1) {
        return
      }

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
      |--------------------------------------------------------------------------
      | ITEMS
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      */

    /*
      |--------------------------------------------------------------------------
      | ADD ITEM NORMAL
      |--------------------------------------------------------------------------
      */

    addItem(item = {}) {
      if (!this.selectedItinerary) {
        return null
      }

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

        /*
          |--------------------------------------------------------------------------
          | Cálculo
          |--------------------------------------------------------------------------
          */

        calculation_type: 'generic',

        /*
          |--------------------------------------------------------------------------
          | Sin grupo
          |--------------------------------------------------------------------------
          */

        group_uuid: null,

        group_index: null,

        duration: 1,

        quantity: 1,

        price_id: null,

        unit_cost: 0,

        unit_price: 0,

        subtotal: 0,

        sort_order: this.getNextLogicalSortOrder(),

        notes: '',

        active: true,

        ...clonePlain(item),
      }

      this.calculateItem(newItem)

      this.selectedItinerary.items.push(newItem)

      this.renumberItems()

      this.refreshCalculations()

      return newItem
    },

    /*
      |--------------------------------------------------------------------------
      | ADD ITEM GROUP
      |--------------------------------------------------------------------------
      |
      | Entrada:
      |
      | {
      |   type: 'group',
      |   group_uuid: '...',
      |   calculation_type: 'accommodation',
      |   items: [...]
      | }
      |
      */

    addItemGroup(group = {}) {
      if (!this.selectedItinerary) {
        return []
      }

      const items = group.items ?? []

      if (!items.length) {
        return []
      }

      const groupUuid = group.group_uuid ?? crypto.randomUUID()

      /*
        |--------------------------------------------------------------------------
        | Una sola posición lógica
        |--------------------------------------------------------------------------
        */

      const sortOrder = this.getNextLogicalSortOrder()

      const createdItems = items.map((item, index) => {
        const newItem = {
          id: item.id ?? null,

          uuid: item.uuid ?? crypto.randomUUID(),

          quotation_itinerary_id: this.selectedItinerary.id,

          service_id: item.service_id ?? null,

          service_variant_id: item.service_variant_id ?? null,

          item_type: item.item_type ?? 'CATALOG',

          name: item.name ?? '',

          variant_name: item.variant_name ?? '',

          description: item.description ?? '',

          /*
                |--------------------------------------------------------------------------
                | Agrupación
                |--------------------------------------------------------------------------
                */

          calculation_type: group.calculation_type ?? item.calculation_type ?? 'generic',

          group_uuid: groupUuid,

          group_index: index + 1,

          /*
                |--------------------------------------------------------------------------
                | Valores
                |--------------------------------------------------------------------------
                */

          duration: Number(item.duration ?? 1),

          quantity: Number(item.quantity ?? 1),

          price_id: item.price_id ?? null,

          unit_cost: Number(item.unit_cost ?? 0),

          unit_price: Number(item.unit_price ?? 0),

          subtotal: Number(item.subtotal ?? 0),

          /*
                |--------------------------------------------------------------------------
                | Todo el grupo comparte sort_order
                |--------------------------------------------------------------------------
                */

          sort_order: sortOrder,

          notes: item.notes ?? '',

          active: item.active ?? true,
        }

        this.calculateItem(newItem)

        return newItem
      })

      this.selectedItinerary.items.push(...createdItems)

      this.renumberItems()

      this.refreshCalculations()

      return createdItems
    },

    /*
      |--------------------------------------------------------------------------
      | UPDATE ITEM NORMAL
      |--------------------------------------------------------------------------
      */

    updateItem(uuid, values) {
      const item = this.findItem(uuid)

      if (!item) {
        return
      }

      Object.assign(item, clonePlain(values))

      this.calculateItem(item)

      this.refreshCalculations()
    },

    /*
      |--------------------------------------------------------------------------
      | UPDATE ITEM GROUP
      |--------------------------------------------------------------------------
      |
      | Sustituye la representación frontend del grupo.
      |
      | Los items que mantienen id/uuid conservarán identidad.
      |
      | Los que desaparecen dejan de existir en el payload.
      |
      */

    updateItemGroup(group = {}) {
      if (!this.selectedItinerary) {
        return []
      }

      if (!group.group_uuid) {
        return []
      }

      const incomingItems = group.items ?? []

      if (!incomingItems.length) {
        return []
      }

      /*
        |--------------------------------------------------------------------------
        | Grupo actual
        |--------------------------------------------------------------------------
        */

      const currentItems = this.findItemGroup(group.group_uuid)

      if (!currentItems.length) {
        return this.addItemGroup(group)
      }

      const sortOrder = Number(currentItems[0]?.sort_order ?? 1)

      /*
        |--------------------------------------------------------------------------
        | Posición física donde estaba el grupo
        |--------------------------------------------------------------------------
        */

      const firstIndex = this.selectedItems.findIndex(
        (item) => item.group_uuid === group.group_uuid,
      )

      /*
        |--------------------------------------------------------------------------
        | Quitar grupo actual
        |--------------------------------------------------------------------------
        */

      this.selectedItinerary.items = this.selectedItems.filter(
        (item) => item.group_uuid !== group.group_uuid,
      )

      /*
        |--------------------------------------------------------------------------
        | Reconstruir
        |--------------------------------------------------------------------------
        */

      const newItems = incomingItems.map((item, index) => {
        const newItem = {
          ...clonePlain(item),

          id: item.id ?? null,

          uuid: item.uuid ?? crypto.randomUUID(),

          quotation_itinerary_id: this.selectedItinerary.id,

          group_uuid: group.group_uuid,

          group_index: index + 1,

          calculation_type: group.calculation_type ?? item.calculation_type ?? 'generic',

          sort_order: sortOrder,

          duration: Number(item.duration ?? 1),

          quantity: Number(item.quantity ?? 1),

          unit_cost: Number(item.unit_cost ?? 0),

          unit_price: Number(item.unit_price ?? 0),
        }

        this.calculateItem(newItem)

        return newItem
      })

      /*
        |--------------------------------------------------------------------------
        | Insertar en la posición anterior
        |--------------------------------------------------------------------------
        */

      this.selectedItinerary.items.splice(
        firstIndex >= 0 ? firstIndex : this.selectedItinerary.items.length,

        0,

        ...newItems,
      )

      this.renumberItems()

      this.refreshCalculations()

      return newItems
    },

    /*
      |--------------------------------------------------------------------------
      | REMOVE ITEM NORMAL
      |--------------------------------------------------------------------------
      */

    removeItem(uuid) {
      if (!this.selectedItinerary) {
        return
      }

      const index = this.selectedItems.findIndex((item) => item.uuid === uuid)

      if (index < 0) {
        return
      }

      this.selectedItinerary.items.splice(index, 1)

      this.renumberItems()

      this.refreshCalculations()
    },

    /*
      |--------------------------------------------------------------------------
      | REMOVE ITEM GROUP
      |--------------------------------------------------------------------------
      */

    removeItemGroup(groupUuid) {
      if (!this.selectedItinerary) {
        return
      }

      this.selectedItinerary.items = this.selectedItems.filter(
        (item) => item.group_uuid !== groupUuid,
      )

      this.renumberItems()

      this.refreshCalculations()
    },

    /*
      |--------------------------------------------------------------------------
      | DUPLICATE ITEM NORMAL
      |--------------------------------------------------------------------------
      */

    duplicateItem(uuid) {
      const item = this.findItem(uuid)

      if (!item) {
        return
      }

      /*
        |--------------------------------------------------------------------------
        | Si pertenece a grupo, duplicar grupo completo
        |--------------------------------------------------------------------------
        */

      if (item.group_uuid) {
        return this.duplicateItemGroup(item.group_uuid)
      }

      const copy = clonePlain(toRaw(item))

      copy.id = null

      copy.uuid = crypto.randomUUID()

      copy.group_uuid = null

      copy.group_index = null

      const index = this.selectedItems.findIndex((current) => current.uuid === uuid)

      this.selectedItinerary.items.splice(index + 1, 0, copy)

      this.renumberItems()

      this.refreshCalculations()

      return copy
    },

    /*
      |--------------------------------------------------------------------------
      | DUPLICATE ITEM GROUP
      |--------------------------------------------------------------------------
      */

    duplicateItemGroup(groupUuid) {
      if (!this.selectedItinerary) {
        return []
      }

      const group = this.findItemGroup(groupUuid)

      if (!group.length) {
        return []
      }

      const newGroupUuid = crypto.randomUUID()

      const copies = group.map((item, index) => ({
        ...clonePlain(item),

        id: null,

        uuid: crypto.randomUUID(),

        group_uuid: newGroupUuid,

        group_index: index + 1,
      }))

      /*
        |--------------------------------------------------------------------------
        | Insertar justo después del grupo original
        |--------------------------------------------------------------------------
        */

      const lastOriginalIndex = Math.max(
        ...group.map((item) =>
          this.selectedItems.findIndex((current) => current.uuid === item.uuid),
        ),
      )

      this.selectedItinerary.items.splice(
        lastOriginalIndex + 1,

        0,

        ...copies,
      )

      this.renumberItems()

      this.refreshCalculations()

      return copies
    },

    /*
      |--------------------------------------------------------------------------
      | TOGGLE ITEM
      |--------------------------------------------------------------------------
      */

    toggleItem(uuid) {
      const item = this.findItem(uuid)

      if (!item) {
        return
      }

      /*
        |--------------------------------------------------------------------------
        | Si pertenece a grupo cambia todo el grupo
        |--------------------------------------------------------------------------
        */

      if (item.group_uuid) {
        const active = !item.active

        this.findItemGroup(item.group_uuid).forEach((groupItem) => {
          groupItem.active = active
        })
      } else {
        item.active = !item.active
      }

      this.refreshCalculations()
    },

    /*
      |--------------------------------------------------------------------------
      | MOVE ITEM UP
      |--------------------------------------------------------------------------
      |
      | Ahora mueve unidades lógicas.
      |
      | Si el item pertenece a un grupo,
      | mueve todo el grupo.
      |
      */

    moveItemUp(uuid) {
      if (!this.selectedItinerary) {
        return
      }

      const item = this.findItem(uuid)

      if (!item) {
        return
      }

      const blocks = this.getLogicalItemBlocks()

      const key = this.getItemBlockKey(item)

      const index = blocks.findIndex((block) => block.key === key)

      if (index <= 0) {
        return
      }

      ;[blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]]

      this.applyLogicalBlocks(blocks)
    },

    /*
      |--------------------------------------------------------------------------
      | MOVE ITEM DOWN
      |--------------------------------------------------------------------------
      */

    moveItemDown(uuid) {
      if (!this.selectedItinerary) {
        return
      }

      const item = this.findItem(uuid)

      if (!item) {
        return
      }

      const blocks = this.getLogicalItemBlocks()

      const key = this.getItemBlockKey(item)

      const index = blocks.findIndex((block) => block.key === key)

      if (index < 0 || index >= blocks.length - 1) {
        return
      }

      ;[blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]]

      this.applyLogicalBlocks(blocks)
    },

    /*
      |--------------------------------------------------------------------------
      | RENUMBER ITEMS
      |--------------------------------------------------------------------------
      |
      | Ejemplo:
      |
      | City Tour        sort_order 1
      |
      | Hotel            sort_order 2
      |   Simple         group_index 1
      |   Doble          group_index 2
      |   Triple         group_index 3
      |
      | Cena             sort_order 3
      |
      */

    renumberItems() {
      if (!this.selectedItinerary) {
        return
      }

      let logicalOrder = 1

      const processedGroups = new Set()

      this.selectedItems.forEach((item) => {
        /*
            |--------------------------------------------------------------------------
            | Item normal
            |--------------------------------------------------------------------------
            */

        if (!item.group_uuid) {
          item.sort_order = logicalOrder

          item.group_index = null

          logicalOrder++

          return
        }

        /*
            |--------------------------------------------------------------------------
            | Grupo ya procesado
            |--------------------------------------------------------------------------
            */

        if (processedGroups.has(item.group_uuid)) {
          return
        }

        /*
            |--------------------------------------------------------------------------
            | Obtener miembros conservando orden físico
            |--------------------------------------------------------------------------
            */

        const groupItems = this.selectedItems.filter(
          (groupItem) => groupItem.group_uuid === item.group_uuid,
        )

        groupItems.forEach((groupItem, index) => {
          groupItem.sort_order = logicalOrder

          groupItem.group_index = index + 1
        })

        processedGroups.add(item.group_uuid)

        logicalOrder++
      })
    },

    /*
      |--------------------------------------------------------------------------
      | GET NEXT LOGICAL SORT ORDER
      |--------------------------------------------------------------------------
      */

    getNextLogicalSortOrder() {
      if (!this.selectedItems.length) {
        return 1
      }

      return Math.max(...this.selectedItems.map((item) => Number(item.sort_order ?? 0))) + 1
    },

    /*
      |--------------------------------------------------------------------------
      | GROUP HELPERS
      |--------------------------------------------------------------------------
      */

    findItemGroup(groupUuid) {
      if (!this.selectedItinerary || !groupUuid) {
        return []
      }

      return this.selectedItems
        .filter((item) => item.group_uuid === groupUuid)
        .sort((a, b) => Number(a.group_index ?? 0) - Number(b.group_index ?? 0))
    },

    getItemBlockKey(item) {
      return item.group_uuid ?? item.uuid
    },

    /*
      |--------------------------------------------------------------------------
      | Unidades lógicas del itinerario
      |--------------------------------------------------------------------------
      */

    getLogicalItemBlocks() {
      if (!this.selectedItinerary) {
        return []
      }

      const blocks = []

      const map = new Map()

      this.selectedItems.forEach((item) => {
        const key = this.getItemBlockKey(item)

        if (!map.has(key)) {
          const block = {
            key,

            group_uuid: item.group_uuid ?? null,

            items: [],
          }

          map.set(key, block)

          blocks.push(block)
        }

        map.get(key).items.push(item)
      })

      /*
        |--------------------------------------------------------------------------
        | Orden interno de grupos
        |--------------------------------------------------------------------------
        */

      blocks.forEach((block) => {
        block.items.sort((a, b) => {
          if (!block.group_uuid) {
            return 0
          }

          return Number(a.group_index ?? 0) - Number(b.group_index ?? 0)
        })
      })

      return blocks
    },

    /*
      |--------------------------------------------------------------------------
      | Aplicar bloques después de mover
      |--------------------------------------------------------------------------
      */

    applyLogicalBlocks(blocks) {
      if (!this.selectedItinerary) {
        return
      }

      this.selectedItinerary.items = blocks.flatMap((block) => block.items)

      this.renumberItems()

      this.refreshCalculations()
    },

    /*
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      | CALCULATIONS
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      */

    calculateItem(item) {
      item.quantity = Number(item.quantity ?? 0)

      item.duration = Number(item.duration ?? 1)

      item.unit_cost = Number(item.unit_cost ?? 0)

      item.unit_price = Number(item.unit_price ?? 0)

      /*
        |--------------------------------------------------------------------------
        | Inactivo
        |--------------------------------------------------------------------------
        */

      if (!item.active) {
        item.subtotal = 0

        return 0
      }

      /*
        |--------------------------------------------------------------------------
        | Accommodation
        |--------------------------------------------------------------------------
        |
        | cantidad habitaciones
        | × tarifa habitación
        | × noches
        |
        */

      if (item.calculation_type === 'accommodation') {
        item.subtotal = item.quantity * item.unit_price * item.duration

        return item.subtotal
      }

      /*
        |--------------------------------------------------------------------------
        | Generic / Transport
        |--------------------------------------------------------------------------
        */

      item.subtotal = item.quantity * item.unit_price

      return item.subtotal
    },

    /*
      |--------------------------------------------------------------------------
      | CALCULATE ITINERARY
      |--------------------------------------------------------------------------
      */

    calculateItinerary(itinerary) {
      itinerary.subtotal = 0
      ;(itinerary.items ?? []).forEach((item) => {
        itinerary.subtotal += this.calculateItem(item)
      })

      return itinerary.subtotal
    },

    /*
      |--------------------------------------------------------------------------
      | CALCULATE QUOTATION
      |--------------------------------------------------------------------------
      */

    calculateQuotation() {
      let subtotal = 0

      this.quotation.itineraries.forEach((itinerary) => {
        subtotal += Number(itinerary.subtotal ?? 0)
      })

      this.quotation.subtotal = subtotal

      this.quotation.discount = Number(this.quotation.discount ?? 0)

      this.quotation.tax = Number(this.quotation.tax ?? 0)

      this.quotation.total = subtotal - this.quotation.discount + this.quotation.tax

      return this.quotation.total
    },

    /*
      |--------------------------------------------------------------------------
      | REFRESH CALCULATIONS
      |--------------------------------------------------------------------------
      */

    refreshCalculations() {
      this.quotation.itineraries.forEach((itinerary) => {
        this.calculateItinerary(itinerary)
      })

      this.calculateQuotation()
    },

    /*
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      | DATES
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      */

    updateTravelDates() {
      if (!this.quotation.travel_date) {
        return
      }

      const start = new Date(this.quotation.travel_date)

      this.quotation.itineraries.forEach((itinerary, index) => {
        const date = new Date(start)

        date.setDate(start.getDate() + index)

        itinerary.travel_date = date.toISOString().substring(0, 10)
      })
    },

    /*
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      | SORT
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      */

    sortItineraries() {
      this.quotation.itineraries.sort(
        (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
      )
    },

    /*
      |--------------------------------------------------------------------------
      | SORT ITEMS
      |--------------------------------------------------------------------------
      |
      | Primero posición lógica.
      |
      | Después group_index.
      |
      */

    sortItems() {
      this.quotation.itineraries.forEach((itinerary) => {
        itinerary.items?.sort((a, b) => {
          const sortDiff = Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)

          if (sortDiff !== 0) {
            return sortDiff
          }

          return Number(a.group_index ?? 0) - Number(b.group_index ?? 0)
        })
      })
    },

    /*
      |--------------------------------------------------------------------------
      |--------------------------------------------------------------------------
      | PASSENGERS
      |--------------------------------------------------------------------------
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

        ...clonePlain(data),
      }

      this.quotation.passengers.push(passenger)

      this.renumberPassengers()

      return passenger
    },

    updatePassenger(uuid, values) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) {
        return
      }

      Object.assign(passenger, clonePlain(values))
    },

    removePassenger(uuid) {
      const index = this.quotation.passengers.findIndex((passenger) => passenger.uuid === uuid)

      if (index < 0) {
        return
      }

      this.quotation.passengers.splice(index, 1)

      this.renumberPassengers()
    },

    duplicatePassenger(uuid) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) {
        return
      }

      const copy = clonePlain(toRaw(passenger))

      copy.id = null

      copy.uuid = crypto.randomUUID()

      const index = this.quotation.passengers.findIndex((current) => current.uuid === uuid)

      this.quotation.passengers.splice(index + 1, 0, copy)

      this.renumberPassengers()

      return copy
    },

    togglePassenger(uuid) {
      const passenger = this.findPassenger(uuid)

      if (!passenger) {
        return
      }

      passenger.active = !passenger.active
    },

    movePassengerUp(uuid) {
      const index = this.quotation.passengers.findIndex((passenger) => passenger.uuid === uuid)

      if (index <= 0) {
        return
      }

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

    existsItem(uuid) {
      return this.findItem(uuid) !== null
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

    /*
      |--------------------------------------------------------------------------
      | PASSENGER HELPERS
      |--------------------------------------------------------------------------
      */

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
