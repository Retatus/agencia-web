import api from '@/services/api'
const RESOURCE_HISTORY = '/audit/history'

const QuotationHistoryService = {
  /**
   * Obtener el historial de una cotización.
   *
   * El backend debe resolver el historial utilizando
   * root_entity_uuid como identificador raíz.
   */
  async getByQuotation(uuid, params = {}) {
    const response = await api.get(`${RESOURCE_HISTORY}/${uuid}/view`, { params })
    return response.data
  },
}

export default QuotationHistoryService
