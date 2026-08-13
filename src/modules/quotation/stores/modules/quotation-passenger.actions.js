import QuotationPassengerService from '../../services/quotation-passenger.service'

// quotation-passenger.actions.js

/*
|--------------------------------------------------------------------------
| HELPERS LOCALES
|--------------------------------------------------------------------------
*/

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value))
}

export const passengerActions = {
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

  /*
  |--------------------------------------------------------------------------
  | PASSENGER HELPERS
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | GENERATE
  |--------------------------------------------------------------------------
  */

  async generatePassengers(groups, nationality = null) {
    /*
  |--------------------------------------------------------------------------
  | COTIZACIÓN NUEVA
  |--------------------------------------------------------------------------
  |
  | Todavía no existe quotation.uuid.
  | Generamos pasajeros localmente.
  |
  */

    if (!this.quotation.uuid) {
      const generated = []

      groups.forEach((group) => {
        const quantity = Number(group.quantity ?? 0)

        for (let index = 0; index < quantity; index++) {
          const passenger = this.addPassenger({
            passenger_type_id: Number(group.passenger_type_id),

            first_name: 'Pendiente',

            last_name: String(this.quotation.passengers.length + 1).padStart(2, '0'),

            nationality: nationality ?? '',

            active: true,
          })

          generated.push(passenger)
        }
      })

      return generated
    }

    /*
  |--------------------------------------------------------------------------
  | COTIZACIÓN EXISTENTE
  |--------------------------------------------------------------------------
  |
  | Ya tiene UUID y está persistida.
  | Generamos mediante API.
  |
  */

    const response = await QuotationPassengerService.generate(this.quotation.uuid, {
      groups,
      nationality,
    })

    const passengers = response.data.data ?? []

    this.quotation.passengers.push(...passengers)

    return passengers
  },

  /*
  |--------------------------------------------------------------------------
  | MARK CHANGED
  |--------------------------------------------------------------------------
  */

  markPassengerChanged(passenger, field, value) {
    if (!passenger?.uuid) {
      return
    }

    /*
    |--------------------------------------------------------------------------
    | Actualizar UI
    |--------------------------------------------------------------------------
    */

    passenger[field] = value

    /*
    |--------------------------------------------------------------------------
    | Obtener cambio existente
    |--------------------------------------------------------------------------
    */

    const current = this.changedPassengers.get(passenger.uuid) ?? {
      uuid: passenger.uuid,
    }

    current[field] = value

    this.changedPassengers.set(passenger.uuid, current)
  },

  /*
  |--------------------------------------------------------------------------
  | BULK UPDATE
  |--------------------------------------------------------------------------
  */

  async bulkUpdatePassengers() {
    if (!this.changedPassengers.size) {
      return []
    }

    if (!this.quotation.uuid) {
      throw new Error('La cotización debe estar guardada.')
    }

    const payload = Array.from(this.changedPassengers.values())

    const response = await QuotationPassengerService.bulkUpdate(this.quotation.uuid, payload)

    const updatedPassengers = response.data.data ?? []

    /*
    |--------------------------------------------------------------------------
    | Sincronizar
    |--------------------------------------------------------------------------
    */

    updatedPassengers.forEach((updated) => {
      const index = this.quotation.passengers.findIndex(
        (passenger) => passenger.uuid === updated.uuid,
      )

      if (index >= 0) {
        this.quotation.passengers[index] = updated
      }
    })

    this.changedPassengers.clear()

    return updatedPassengers
  },

  /*
  |--------------------------------------------------------------------------
  | CLEAR CHANGES
  |--------------------------------------------------------------------------
  */

  clearPassengerChanges() {
    this.changedPassengers.clear()
  },
}
