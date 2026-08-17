import {
  Component,
  LayoutDashboard,
  FileText,
  Users,
  BriefcaseBusiness,
  Building2,
  BadgeDollarSign,
  ListChecks,
} from 'lucide-vue-next'

export const navigationItems = [
  { label: 'Resumen', route: 'dashboard', icon: LayoutDashboard },
  { label: 'Cotizaciones', route: 'quotations', icon: FileText },
  { label: 'Clientes', route: 'crm.customers', icon: Users },
  { label: 'Servicios', route: 'services', icon: BriefcaseBusiness },
  { label: 'Proveedores', route: 'providers', icon: Building2 },
  { label: 'Precios', route: 'pricing.prices', icon: BadgeDollarSign },
  { label: 'Precios base', route: 'pricing.base-prices', icon: BadgeDollarSign },
  {
    label: 'Reglas de precios',
    route: 'pricing.price-list-items',
    icon: ListChecks,
  },

  {
    label: 'Componentes UI',
    route: 'ui.components',
    icon: Component,
  },
]
