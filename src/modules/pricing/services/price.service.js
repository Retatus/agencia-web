import api from '@/services/api'

/*
|--------------------------------------------------------------------------
| BASE URLS
|--------------------------------------------------------------------------
*/

const BASE_URL = '/pricing/prices'

const SERVICE_BASE_URL = '/services'

/*
|--------------------------------------------------------------------------
| VALIDACIONES LOCALES
|--------------------------------------------------------------------------
*/

function requireValue(value, message) {
  if (value === null || value === undefined || value === '') {
    return Promise.reject(new Error(message))
  }

  return null
}

/*
|--------------------------------------------------------------------------
| PRICE SERVICE
|--------------------------------------------------------------------------
*/

const PriceService = {
  /*
  |--------------------------------------------------------------------------
  | LISTAR PRECIOS
  |--------------------------------------------------------------------------
  |
  | Ejemplo:
  |
  | getAll({
  |   price_list_id: 7,
  |   service_variant_id: 18,
  |   price_type_id: 3,
  |   passenger_type_id: null,
  |   active: 1,
  |   page: 1,
  |   per_page: 50,
  | })
  |
  */

  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  /*
  |--------------------------------------------------------------------------
  | OBTENER PRECIO
  |--------------------------------------------------------------------------
  |
  | Price utiliza ID numérico.
  |
  */

  get(id) {
    const validation = requireValue(id, 'El ID del precio es obligatorio.')

    if (validation) {
      return validation
    }

    return api.get(`${BASE_URL}/${id}`)
  },

  /*
  |--------------------------------------------------------------------------
  | LISTAR PRECIOS DE UNA VARIANTE
  |--------------------------------------------------------------------------
  |
  | GET /services/{service}/variants/{variant_id}/prices
  |
  | El servicio se identifica mediante UUID.
  | La variante se identifica mediante ID numérico.
  |
  */

  getByVariant(serviceUuid, variantId, params = {}) {
    const serviceValidation = requireValue(serviceUuid, 'El UUID del servicio es obligatorio.')

    if (serviceValidation) {
      return serviceValidation
    }

    const variantValidation = requireValue(variantId, 'El ID de la variante es obligatorio.')

    if (variantValidation) {
      return variantValidation
    }

    return api.get(`${SERVICE_BASE_URL}/${serviceUuid}/variants/${variantId}/prices`, {
      params,
    })
  },

  /*
  |--------------------------------------------------------------------------
  | CREAR PRECIO
  |--------------------------------------------------------------------------
  */

  create(payload) {
    return api.post(BASE_URL, payload)
  },

  /*
  |--------------------------------------------------------------------------
  | ACTUALIZAR PRECIO
  |--------------------------------------------------------------------------
  |
  | PATCH /pricing/prices/{id}
  |
  */

  update(id, payload) {
    const validation = requireValue(id, 'El ID del precio es obligatorio.')

    if (validation) {
      return validation
    }

    return api.patch(`${BASE_URL}/${id}`, payload)
  },

  /*
  |--------------------------------------------------------------------------
  | ACTUALIZACIÓN MASIVA
  |--------------------------------------------------------------------------
  |
  | El backend espera:
  |
  | {
  |   prices: [
  |     {
  |       id: 1,
  |       cost: 50,
  |       sale_price: 70,
  |       min_quantity: 1,
  |       max_quantity: 10,
  |       active: true
  |     }
  |   ]
  | }
  |
  */

  bulkUpdate(prices) {
    if (!Array.isArray(prices) || prices.length === 0) {
      return Promise.reject(new Error('Debe proporcionar al menos un precio para actualizar.'))
    }

    return api.patch(`${BASE_URL}/bulk`, {
      prices,
    })
  },

  /*
  |--------------------------------------------------------------------------
  | ELIMINAR PRECIO
  |--------------------------------------------------------------------------
  */

  destroy(id) {
    const validation = requireValue(id, 'El ID del precio es obligatorio.')

    if (validation) {
      return validation
    }

    return api.delete(`${BASE_URL}/${id}`)
  },
}

export default PriceService
