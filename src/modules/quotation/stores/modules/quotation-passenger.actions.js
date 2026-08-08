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
}
