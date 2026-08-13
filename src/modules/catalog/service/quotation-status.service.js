import api from '@/services/api'

const BASE_URL = '/quotation/statuses'

const QuotationStatusService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },
}

export default QuotationStatusService
