import api from '@/services/api'

class ServiceCategoryService {
  index(params = {}) {
    return api.get('/service-categories/select', {
      params,
    })
  }
}

export default new ServiceCategoryService()
