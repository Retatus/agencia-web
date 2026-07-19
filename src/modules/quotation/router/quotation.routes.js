import QuotationListPage from '../pages/QuotationListPage.vue'
import QuotationFormPage from '../pages/QuotationFormPage.vue'

export default [
  {
    path: '/quotations',
    name: 'quotations.index',
    component: QuotationListPage,
    meta: {
      title: 'Cotizaciones',
    },
  },

  {
    path: '/quotations/create',
    name: 'quotations.create',
    component: QuotationFormPage,
    meta: {
      title: 'Nueva Cotización',
    },
  },

  {
    path: '/quotations/:uuid/edit',
    name: 'quotations.edit',
    component: QuotationFormPage,
    props: true,
    meta: {
      title: 'Editar Cotización',
    },
  },
]
