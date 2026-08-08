import {
  LayoutDashboard,
  FileText,
  Users,
  BriefcaseBusiness,
  Building2,
  BadgeDollarSign,
} from 'lucide-vue-next'

export const navigationItems = [
  { label: 'Resumen', route: 'dashboard', icon: LayoutDashboard },
  { label: 'Cotizaciones', route: 'quotations', icon: FileText },
  { label: 'Clientes', route: 'crm.customers', icon: Users },
  { label: 'Servicios', route: 'services', icon: BriefcaseBusiness },
  { label: 'Proveedores', route: 'providers', icon: Building2 },
  // { label: 'Precios', route: 'prices.index', icon: BadgeDollarSign },
]
