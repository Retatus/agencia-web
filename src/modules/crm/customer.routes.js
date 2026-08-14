import CustomerListPage from '@/modules/crm/pages/CustomerListPage.vue'
import CustomerFormPage from '@/modules/crm/pages/CustomerFormPage.vue'

export default [
  {
    path: 'crm/customers',
    name: 'crm.customers',
    component: CustomerListPage,
  },
  {
    path: 'crm/customers/create',
    name: 'crm.customers.create',
    component: CustomerFormPage,
  },
  {
    path: 'crm/customers/:uuid/edit',
    name: 'crm.customers.edit',
    component: CustomerFormPage,
    props: true,
  },
]
