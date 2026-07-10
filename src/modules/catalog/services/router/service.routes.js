import ServiceListPage from '../pages/ServiceListPage.vue'
import ServiceFormPage from '../pages/ServiceFormPage.vue'

export default [
  {
    path: '/services',
    name: 'services.index',
    component: ServiceListPage,
    meta: {
      title: 'Servicios',
    },
  },

  {
    path: '/services/create',
    name: 'services.create',
    component: ServiceFormPage,
    meta: {
      title: 'Nuevo Servicio',
    },
  },

  {
    path: '/services/:uuid/edit',
    name: 'services.edit',
    component: ServiceFormPage,
    props: true,
    meta: {
      title: 'Editar Servicio',
    },
  },
]
