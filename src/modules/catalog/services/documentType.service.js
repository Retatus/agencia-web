import api from '@/services/api'

class DocumentTypeService {
  index(params = {}) {
    return api.get('/document-types/select', {
      params,
    })
  }
}

export default new DocumentTypeService()
