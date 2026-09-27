import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Component,
  FileText,
  LayoutDashboard,
  ListChecks,
  MapPinned,
  Tags,
  ArrowRightLeft,
  Users,
} from 'lucide-vue-next'

export const navigationItems = [
  {
    label: 'Resumen',
    route: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Cotizaciones',
    route: 'quotations',
    icon: FileText,
  },
  {
    label: 'Clientes',
    route: 'crm.customers',
    icon: Users,
  },
  {
    label: 'Servicios',
    route: 'services',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Proveedores',
    route: 'providers',
    icon: Building2,
  },
  {
    label: 'Precios',
    route: 'pricing.prices',
    icon: BadgeDollarSign,
  },
  {
    label: 'Gestión de precios',
    route: 'pricing.management',
    icon: ListChecks,
  },
  {
    label: 'Temporadas y promociones',
    route: 'pricing.commercial',
    icon: Tags,
  },
  {
    label: 'Destinos turísticos',
    route: 'tourist-destinations',
    icon: MapPinned,
  },
  {
    label: 'Tipos de cambio',
    route: 'pricing.exchange-rates',
    icon: ArrowRightLeft,
  },
  {
    label: 'Componentes UI',
    route: 'ui.components',
    icon: Component,
  },
]
