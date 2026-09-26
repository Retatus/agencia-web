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
    label: 'Destinos turísticos',
    route: 'tourist-destinations',
    icon: MapPinned,
  },
  {
    label: 'Temporadas y promociones',
    route: 'pricing.commercial',
    icon: Tags,
  },
  {
    label: 'Componentes UI',
    route: 'ui.components',
    icon: Component,
  },
]
