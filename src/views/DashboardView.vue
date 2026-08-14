<script setup>
import { FileText, Users, BriefcaseBusiness, BadgeDollarSign } from 'lucide-vue-next'

const indicators = [
  { label: 'Cotizaciones activas', value: '24', note: '+3 esta semana', icon: FileText },
  { label: 'Ventas del mes', value: '$ 18,450', note: '+12% vs. mes anterior', icon: BadgeDollarSign },
  { label: 'Clientes', value: '186', note: '+8 nuevos', icon: Users },
  { label: 'Servicios activos', value: '72', note: '6 categorías', icon: BriefcaseBusiness },
]

const quotations = [
  { code: 'COT-00241', customer: 'Laura Méndez', destination: 'Cusco · 5 días', amount: '$ 2,840.00', status: 'Confirmada', statusClass: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
  { code: 'COT-00240', customer: 'Daniel Torres', destination: 'Lima · 3 días', amount: '$ 1,320.00', status: 'Pendiente', statusClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { code: 'COT-00239', customer: 'Sofía Reyes', destination: 'Arequipa · 4 días', amount: '$ 1,980.00', status: 'Borrador', statusClass: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
]
</script>

<template>
  <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div><h2 class="text-2xl font-bold tracking-tight">Buenos días, Renato</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Aquí tienes el resumen de hoy.</p></div>
    <button type="button" class="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">+ Nueva cotización</button>
  </div>

  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <article v-for="item in indicators" :key="item.label" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between"><p class="text-sm text-slate-500 dark:text-slate-400">{{ item.label }}</p><span class="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><component :is="item.icon" class="h-5 w-5" /></span></div>
      <p class="mt-3 text-2xl font-bold">{{ item.value }}</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.note }}</p>
    </article>
  </section>

  <section class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800"><div><h3 class="font-semibold">Cotizaciones recientes</h3><p class="text-xs text-slate-500 dark:text-slate-400">Últimos movimientos registrados</p></div><button class="text-sm font-medium text-teal-700 dark:text-teal-300">Ver todas</button></div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400"><tr><th v-for="heading in ['Código', 'Cliente', 'Destino', 'Total', 'Estado', '']" :key="heading" class="px-5 py-3 font-medium">{{ heading }}</th></tr></thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="quotation in quotations" :key="quotation.code" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50"><td class="px-5 py-4 font-medium text-teal-700 dark:text-teal-300">{{ quotation.code }}</td><td class="px-5 py-4">{{ quotation.customer }}</td><td class="px-5 py-4 text-slate-500 dark:text-slate-400">{{ quotation.destination }}</td><td class="px-5 py-4 font-medium">{{ quotation.amount }}</td><td class="px-5 py-4"><span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="quotation.statusClass">{{ quotation.status }}</span></td><td class="px-5 py-4 text-right"><button type="button" class="rounded px-2 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">•••</button></td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

