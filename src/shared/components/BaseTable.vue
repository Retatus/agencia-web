<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- Tabla responsive -->

    <div class="overflow-x-auto">
      <table
        class="w-full min-w-[750px] text-left text-sm [&_th]:whitespace-nowrap [&_th]:px-5 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-slate-500 dark:[&_th]:text-slate-400 [&_td]:px-5 [&_td]:py-4"
      >
        <!-- Encabezado -->

        <thead
          class="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50"
        >
          <slot name="header" />
        </thead>

        <!-- Cargando -->

        <tbody v-if="loading">
          <tr>
            <td
              :colspan="columns"
              class="px-5! py-14! text-center"
            >
              <div class="flex flex-col items-center justify-center">
                <span
                  class="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600 dark:border-slate-700 dark:border-t-teal-400"
                />

                <p class="text-sm text-slate-500 dark:text-slate-400"> Cargando información... </p>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Registros -->

        <tbody
          v-else-if="items.length"
          class="divide-y divide-slate-100 dark:divide-slate-800 [&>tr]:transition-colors [&>tr:hover]:bg-slate-50/70 dark:[&>tr:hover]:bg-slate-800/50 [&_td]:text-slate-600 dark:[&_td]:text-slate-300"
        >
          <slot
            name="body"
            :items="items"
          />
        </tbody>

        <!-- Sin registros -->

        <tbody v-else>
          <tr>
            <td
              :colspan="columns"
              class="px-5! py-14! text-center"
            >
              <div class="flex flex-col items-center justify-center">
                <div
                  class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                >
                  <svg
                    aria-hidden="true"
                    class="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                </div>

                <p class="font-medium text-slate-700 dark:text-slate-300">
                  {{ emptyText }}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pie de tabla -->

    <div
      v-if="$slots.footer"
      class="border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },

  columns: {
    type: Number,
    required: true,
  },

  emptyText: {
    type: String,
    default: 'No existen registros.',
  },
})
</script>
