import api from '@/services/api'

const QuotationPassengerService = {
  /*
  |--------------------------------------------------------------------------
  | LIST
  |--------------------------------------------------------------------------
  */

  getAll(quotationUuid) {
    return api.get(`/quotations/${quotationUuid}/passengers`)
  },

  /*
  |--------------------------------------------------------------------------
  | GENERATE
  |--------------------------------------------------------------------------
  */

  generate(quotationUuid, data) {
    return api.post(`/quotations/${quotationUuid}/passengers/generate`, data)
  },

  /*
  |--------------------------------------------------------------------------
  | BULK UPDATE
  |--------------------------------------------------------------------------
  */

  bulkUpdate(quotationUuid, passengers) {
    return api.patch(`/quotations/${quotationUuid}/passengers/bulk`, {
      passengers,
    })
  },
}

export default QuotationPassengerService
