<script setup>
import { computed } from 'vue'
import { useCountryStore } from '@/modules/catalog/stores/country.store'

const model = defineModel()

const props = defineProps({
  countryIso: {
    type: String,
    default: '',
  },
})

const countryStore = useCountryStore()

const country = computed(() => countryStore.countries.find((c) => c.iso === props.countryIso))

const phoneCode = computed(() => country.value?.phone_code ?? '')

const localNumber = computed({
  get() {
    if (!model.value) return ''

    const prefix = `+${phoneCode.value}`

    return model.value.startsWith(prefix) ? model.value.replace(prefix, '') : model.value
  },

  set(value) {
    model.value = phoneCode.value ? `+${phoneCode.value}${value}` : value
  },
})
</script>

<template>
  <div class="flex">
    <div
      class="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
    >
      +{{ phoneCode }}
    </div>

    <input
      v-model="localNumber"
      type="tel"
      class="flex-1 rounded-r-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
      placeholder="Número de teléfono"
    />
  </div>
</template>
