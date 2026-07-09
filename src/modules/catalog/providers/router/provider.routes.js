import ProviderListPage from '../pages/ProviderListPage.vue'
import ProviderFormPage from '../pages/ProviderFormPage.vue'

export default [
  {
    path: '/providers',
    name: 'providers.index',
    component: ProviderListPage,
  },
  {
    path: '/providers/create',
    name: 'providers.create',
    component: ProviderFormPage,
  },
  {
    path: '/providers/:uuid/edit',
    name: 'providers.edit',
    component: ProviderFormPage,
    props: true,
  },
]
