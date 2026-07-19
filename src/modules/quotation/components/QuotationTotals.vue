<template>
  <div class="card shadow-sm mt-4">
    <div class="card-header">
      <h5 class="mb-0"> Resumen de la Cotización </h5>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-lg-6 ms-auto">
          <table class="table table-borderless align-middle mb-0">
            <tbody>
              <tr>
                <td class="fw-semibold"> Subtotal </td>

                <td class="text-end">
                  {{ currency }}
                </td>

                <td class="text-end fw-semibold">
                  {{ money(quotation.subtotal) }}
                </td>
              </tr>

              <tr>
                <td> Descuento </td>

                <td></td>

                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control text-end"
                    v-model.number="quotation.discount"
                    @input="calculate"
                  />
                </td>
              </tr>

              <tr>
                <td> Impuesto </td>

                <td></td>

                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control text-end"
                    v-model.number="quotation.tax"
                    @input="calculate"
                  />
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr class="border-top">
                <th class="fs-5"> TOTAL </th>

                <th class="text-end fs-5">
                  {{ currency }}
                </th>

                <th class="text-end fs-4 text-primary">
                  {{ money(quotation.total) }}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  quotation: {
    type: Object,

    required: true,
  },

  currencies: {
    type: Array,

    default: () => [],
  },
})

const emit = defineEmits(['recalculate'])

const currency = computed(() => {
  const item = props.currencies.find((c) => c.id === props.quotation.currency_id)

  return item?.code ?? ''
})

function calculate() {
  props.quotation.total =
    Number(props.quotation.subtotal || 0) -
    Number(props.quotation.discount || 0) +
    Number(props.quotation.tax || 0)

  emit('recalculate')
}

function money(value) {
  return Number(value || 0).toLocaleString(
    undefined,

    {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    },
  )
}
</script>
