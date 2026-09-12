<script setup>
import { computed, onMounted } from 'vue'
import { useCountryStore } from '@/modules/catalog/stores/country.store'

const model = defineModel()

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Seleccione un país',
  },
})

const countryStore = useCountryStore()

onMounted(async () => {
  await countryStore.getCountries()
})

const countries = computed(() => countryStore.countries)
</script>

<template>
  <select
    v-model="model"
    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
  >
    <option value="">
      {{ placeholder }}
    </option>

    <option v-for="country in countries" :key="country.id" :value="country.iso">
      <!-- {{ country.flag }} -->
      {{ country.name }}
      <!-- (+{{ country.phone_code }}) -->
    </option>
  </select>
</template>
