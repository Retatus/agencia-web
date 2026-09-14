<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="cancel"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="isEdit ? 'Editar Servicio' : 'Agregar Servicio'"
            class="w-full max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar Servicio' : 'Agregar Servicio' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isEdit
                      ? 'Modifique la configuración del servicio del itinerario.'
                      : 'Seleccione un servicio del catálogo para agregarlo al itinerario.'
                  }}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="cancel"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="max-h-[80vh] overflow-y-auto p-5 sm:p-6">
              <!-- ERROR -->
              <div
                v-if="error"
                class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              >
                {{ error }}
                <button
                  type="button"
                  class="ml-2 rounded border border-red-300 px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                  @click="error = null"
                >
                  Cerrar
                </button>
              </div>

              <!-- FILTROS -->
              <div
                class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="grid gap-4 sm:grid-cols-12">
                  <!-- Buscar -->
                  <div class="sm:col-span-6">
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Buscar servicio
                    </label>
                    <input
                      v-model="filters.search"
                      type="text"
                      placeholder="Nombre, código o proveedor..."
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />
                  </div>

                  <!-- Categoría -->
                  <div class="sm:col-span-4">
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Categoría
                    </label>
                    <select
                      v-model="filters.category"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="">Todas las categorías</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Limpiar -->
                  <div class="sm:col-span-2 flex items-end">
                    <button
                      type="button"
                      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="clearFilters"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>

              <!-- LOADING SERVICIOS -->
              <div v-if="loading" class="py-8 text-center">
                <div
                  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
                ></div>
                <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Cargando servicios...
                </div>
              </div>

              <!-- CONTENIDO -->
              <div v-else class="grid gap-6 lg:grid-cols-12">
                <!-- LISTA DE SERVICIOS -->
                <div class="lg:col-span-7">
                  <div
                    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div
                      class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700"
                    >
                      <strong class="text-sm font-semibold text-slate-900 dark:text-white"
                        >Servicios</strong
                      >
                      <span
                        class="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {{ filteredServices.length }}
                      </span>
                    </div>

                    <div class="overflow-x-auto">
                      <table class="w-full text-sm">
                        <thead
                          class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                        >
                          <tr>
                            <th
                              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >
                              Servicio
                            </th>
                            <th
                              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >
                              Proveedor
                            </th>
                            <th
                              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >
                              Categoría
                            </th>
                            <th
                              class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >
                              Variantes
                            </th>
                            <th
                              class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            ></th>
                          </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                          <!-- Sin resultados -->
                          <tr v-if="!filteredServices.length">
                            <td
                              colspan="5"
                              class="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                            >
                              No se encontraron servicios.
                            </td>
                          </tr>

                          <!-- Servicios -->
                          <tr
                            v-for="service in filteredServices"
                            :key="service.uuid"
                            class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            :class="{
                              'bg-teal-50 dark:bg-teal-950/30':
                                selectedService?.uuid === service.uuid,
                            }"
                            @click="selectService(service)"
                          >
                            <!-- Servicio -->
                            <td class="px-3 py-2.5">
                              <div class="font-medium text-slate-900 dark:text-white">
                                {{ service.name }}
                              </div>
                              <div class="text-xs text-slate-500 dark:text-slate-400">
                                {{ service.code }}
                              </div>
                            </td>

                            <!-- Proveedor -->
                            <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                              {{ service.provider?.business_name ?? '-' }}
                            </td>

                            <!-- Categoría -->
                            <td class="px-3 py-2.5">
                              <span
                                class="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {{ service.service_category?.name ?? '-' }}
                              </span>
                            </td>

                            <!-- Variantes -->
                            <td class="px-3 py-2.5 text-center">
                              <span
                                class="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              >
                                {{ service.variants?.length ?? 0 }}
                              </span>
                            </td>

                            <!-- Seleccionar -->
                            <td class="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                class="inline-flex items-center rounded-lg border border-teal-300 px-3 py-1 text-xs font-medium text-teal-600 transition hover:bg-teal-50 disabled:opacity-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/30"
                                :disabled="loadingDetail && selectedService?.uuid === service.uuid"
                                @click.stop="selectService(service)"
                              >
                                <span
                                  v-if="loadingDetail && selectedService?.uuid === service.uuid"
                                  class="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
                                ></span>
                                <span v-else>
                                  {{
                                    isEdit &&
                                    Number(editBaseItem?.service_id) === Number(service.id)
                                      ? 'Seleccionado'
                                      : 'Seleccionar'
                                  }}
                                </span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- CONFIGURACIÓN -->
                <div class="lg:col-span-5">
                  <div
                    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                      <strong class="text-sm font-semibold text-slate-900 dark:text-white"
                        >Configuración del servicio</strong
                      >
                    </div>

                    <div class="p-4">
                      <!-- SIN SERVICIO -->
                      <div
                        v-if="!selectedService"
                        class="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        <div class="text-4xl mb-3">📦</div>
                        <p class="text-sm">Seleccione un servicio de la lista.</p>
                      </div>

                      <!-- LOADING DETALLE -->
                      <div v-else-if="loadingDetail" class="py-8 text-center">
                        <div
                          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
                        ></div>
                        <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Cargando información del servicio...
                        </div>
                      </div>

                      <!-- SERVICIO SELECCIONADO -->
                      <div v-else class="space-y-4">
                        <!-- Servicio -->
                        <div>
                          <label
                            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >Servicio</label
                          >
                          <div class="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                            <div class="font-medium text-slate-900 dark:text-white">
                              {{ selectedService.name }}
                            </div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">
                              {{ selectedService.provider?.business_name ?? '-' }}
                            </div>
                            <div class="mt-2">
                              <span
                                class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                                :class="calculationBadgeClass"
                              >
                                {{ calculationTypeLabel }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Categoría -->
                        <div>
                          <label
                            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >Categoría</label
                          >
                          <input
                            :value="selectedService.service_category?.name ?? ''"
                            class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                            disabled
                          />
                        </div>

                        <!-- SERVICIO GENÉRICO -->
                        <template v-if="!isRecommendationType">
                          <!-- Variante -->
                          <div>
                            <label
                              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >Variante *</label
                            >
                            <div
                              v-if="loadingVariants"
                              class="text-sm text-slate-500 dark:text-slate-400"
                            >
                              <span
                                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mr-2"
                              ></span>
                              Cargando variantes...
                            </div>
                            <select
                              v-else
                              v-model="form.service_variant_id"
                              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              :disabled="!variants.length"
                              @change="onVariantChange"
                            >
                              <option :value="null">
                                {{
                                  variants.length
                                    ? 'Seleccione una variante...'
                                    : 'No hay variantes disponibles'
                                }}
                              </option>
                              <option
                                v-for="variant in variants"
                                :key="variant.id"
                                :value="variant.id"
                              >
                                {{ variant.name }}
                              </option>
                            </select>
                          </div>

                          <!-- Información variante -->
                          <div
                            v-if="selectedVariant"
                            class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30"
                          >
                            <div class="font-medium text-sm text-blue-800 dark:text-blue-300 mb-1">
                              {{ selectedVariant.name }}
                            </div>
                            <div class="text-xs text-blue-700 dark:text-blue-400 space-y-0.5">
                              <div v-if="selectedVariant.code">
                                Código: {{ selectedVariant.code }}
                              </div>
                              <div
                                v-if="
                                  selectedVariant.min_capacity !== null &&
                                  selectedVariant.max_capacity !== null
                                "
                              >
                                Capacidad: {{ selectedVariant.min_capacity }} -
                                {{ selectedVariant.max_capacity }}
                              </div>
                              <div v-if="selectedVariant.unit_type">
                                Unidad: {{ selectedVariant.unit_type }}
                              </div>
                            </div>
                          </div>

                          <!-- Tarifa manual -->
                          <div v-if="selectedVariant && !isAutomaticGroupPricing">
                            <label
                              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >Tarifa *</label
                            >
                            <div
                              v-if="loadingPrices"
                              class="text-sm text-slate-500 dark:text-slate-400"
                            >
                              <span
                                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mr-2"
                              ></span>
                              Cargando tarifas...
                            </div>
                            <select
                              v-else
                              v-model="form.price_id"
                              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              :disabled="!prices.length"
                            >
                              <option :value="null">
                                {{
                                  prices.length
                                    ? 'Seleccione una tarifa...'
                                    : 'No hay tarifas disponibles'
                                }}
                              </option>
                              <option v-for="price in prices" :key="price.id" :value="price.id">
                                {{ price.name ?? 'Tarifa' }} - {{ price.sale_price }}
                                {{ price.currency?.code ?? '' }}
                              </option>
                            </select>
                          </div>

                          <!-- Precio seleccionado manualmente -->
                          <div
                            v-if="selectedPrice && !isAutomaticGroupPricing"
                            class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30"
                          >
                            <div class="font-medium text-sm text-green-800 dark:text-green-300">
                              Tarifa seleccionada
                            </div>
                            <div
                              class="text-xs text-green-700 dark:text-green-400 mt-1 space-y-0.5"
                            >
                              <div>
                                Precio: {{ selectedPrice.sale_price }}
                                {{ selectedPrice.currency?.code ?? '' }}
                              </div>
                              <div v-if="selectedPrice.name">Tarifa: {{ selectedPrice.name }}</div>
                            </div>
                          </div>

                          <!-- Cantidad manual -->
                          <div v-if="!isAutomaticGroupPricing">
                            <label
                              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >Cantidad *</label
                            >
                            <input
                              v-model.number="form.quantity"
                              type="number"
                              min="1"
                              step="1"
                              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </div>

                          <!-- Tarifa grupal resuelta por pasajeros -->
                          <div
                            v-else-if="selectedVariant"
                            class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30"
                          >
                            <div class="font-medium text-sm text-green-800 dark:text-green-300">
                              Tarifa grupal automática
                            </div>

                            <div
                              v-if="loadingAutomaticPrice"
                              class="mt-2 text-xs text-green-700 dark:text-green-400"
                            >
                              Resolviendo tarifa...
                            </div>

                            <div
                              v-else-if="resolvedGenericPrice"
                              class="mt-2 space-y-1 text-xs text-green-700 dark:text-green-400"
                            >
                              <div>Pasajeros: {{ props.passengers.length }}</div>
                              <div>
                                Pasajeros usados para la tarifa:
                                {{ resolvedGenericPrice.metadata.pricing_quantity }}
                              </div>
                              <div>Cantidad facturada: 1 grupo</div>
                              <div>
                                Precio: {{ money(resolvedGenericPrice.unit_price) }}
                              </div>
                            </div>
                          </div>
                        </template>

                        <!-- ALOJAMIENTO / TRANSPORTE -->
                        <template v-else>
                          <!-- Noches -->
                          <div v-if="calculationType === 'accommodation'">
                            <label
                              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >Noches *</label
                            >
                            <input
                              v-model.number="form.duration"
                              type="number"
                              min="1"
                              step="1"
                              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            />
                          </div>

                          <!-- Pasajeros -->
                          <div
                            class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                          >
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-slate-600 dark:text-slate-400"
                                >Pasajeros</span
                              >
                              <strong class="text-sm text-slate-900 dark:text-white">{{
                                props.passengers.length
                              }}</strong>
                            </div>
                            <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              El cálculo utiliza los pasajeros actuales de la cotización.
                            </div>
                          </div>

                          <!-- DISTRIBUCIÓN ACTUAL - EDICIÓN -->
                          <div v-if="isGroupEdit && !recommendations.length" class="space-y-3">
                            <label
                              class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                              >Distribución actual</label
                            >
                            <div
                              class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                            >
                              <div
                                v-for="item in currentGroupItems"
                                :key="item.uuid ?? item.id ?? item.group_index"
                                class="flex items-center justify-between py-1 text-sm"
                              >
                                <div>
                                  <strong>{{ item.quantity }} ×</strong>
                                  {{ item.variant_name }}
                                </div>
                                <div class="text-slate-500 dark:text-slate-400">
                                  {{ money(item.subtotal) }}
                                </div>
                              </div>
                              <hr class="my-2 border-slate-200 dark:border-slate-700" />
                              <div class="flex items-center justify-between text-xs">
                                <span class="text-slate-500 dark:text-slate-400"
                                  >Cantidad total</span
                                >
                                <strong class="text-slate-900 dark:text-white">{{
                                  currentGroupSummary.quantity
                                }}</strong>
                              </div>
                              <div class="flex items-center justify-between text-xs">
                                <span class="text-slate-500 dark:text-slate-400">Costo total</span>
                                <strong class="text-slate-900 dark:text-white">{{
                                  money(currentGroupSummary.total_cost)
                                }}</strong>
                              </div>
                              <div class="flex items-center justify-between text-sm">
                                <span class="text-slate-500 dark:text-slate-400">Venta total</span>
                                <strong class="text-slate-900 dark:text-white">{{
                                  money(currentGroupSummary.total_sale)
                                }}</strong>
                              </div>
                            </div>
                            <button
                              type="button"
                              class="w-full rounded-lg border border-teal-300 px-4 py-2.5 text-sm font-medium text-teal-600 transition hover:bg-teal-50 disabled:opacity-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/30"
                              :disabled="loadingRecommendations"
                              @click="loadRecommendations"
                            >
                              <span
                                v-if="loadingRecommendations"
                                class="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
                              ></span>
                              <span v-else>⟳</span>
                              Buscar nuevas recomendaciones
                            </button>
                          </div>

                          <!-- CREAR: CARGAR RECOMENDACIONES -->
                          <div
                            v-if="
                              !isGroupEdit && !recommendations.length && !loadingRecommendations
                            "
                            class="pt-2"
                          >
                            <button
                              type="button"
                              class="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
                              :disabled="!props.passengers.length"
                              @click="loadRecommendations"
                            >
                              ✨ Generar recomendaciones
                            </button>
                          </div>

                          <!-- Loading -->
                          <div v-if="loadingRecommendations" class="py-4 text-center">
                            <div
                              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
                            ></div>
                            <div class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                              Calculando recomendaciones...
                            </div>
                          </div>

                          <!-- Sin resultados -->
                          <div
                            v-else-if="recommendationsLoaded && !recommendations.length"
                            class="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300"
                          >
                            No se encontraron combinaciones disponibles para
                            {{ props.passengers.length }} pasajeros.
                          </div>

                          <!-- RECOMENDACIONES -->
                          <div v-if="recommendations.length" class="space-y-3">
                            <div class="flex items-center justify-between">
                              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {{
                                  calculationType === 'accommodation'
                                    ? 'Distribuciones de habitaciones'
                                    : 'Distribuciones de transporte'
                                }}
                              </label>
                              <button
                                type="button"
                                class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                @click="loadRecommendations"
                              >
                                ⟳
                              </button>
                            </div>

                            <div class="space-y-2">
                              <div
                                v-for="recommendation in recommendations"
                                :key="recommendation.rank"
                                class="cursor-pointer rounded-lg border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                :class="{
                                  'border-teal-500 bg-teal-50 dark:bg-teal-950/30':
                                    selectedRecommendation?.rank === recommendation.rank,
                                  'border-slate-200 dark:border-slate-700':
                                    selectedRecommendation?.rank !== recommendation.rank,
                                }"
                                @click="selectRecommendation(recommendation)"
                              >
                                <!-- Cabecera -->
                                <div class="mb-2 flex items-center justify-between">
                                  <div>
                                    <strong class="text-sm text-slate-900 dark:text-white"
                                      >Opción {{ recommendation.rank }}</strong
                                    >
                                    <span
                                      v-if="recommendation.recommended"
                                      class="ml-2 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                      Recomendada
                                    </span>
                                  </div>
                                  <input
                                    type="radio"
                                    :checked="selectedRecommendation?.rank === recommendation.rank"
                                    class="h-4 w-4 text-teal-600 accent-teal-600 focus:ring-teal-500"
                                    @change="selectRecommendation(recommendation)"
                                  />
                                </div>

                                <!-- Habitaciones -->
                                <template v-if="calculationType === 'accommodation'">
                                  <div
                                    v-for="room in recommendation.rooms"
                                    :key="room.service_variant_id"
                                    class="text-xs text-slate-700 dark:text-slate-300"
                                  >
                                    <strong>{{ room.quantity }} ×</strong>
                                    {{ room.name }}
                                    <span class="text-slate-500 dark:text-slate-400"
                                      >· capacidad {{ room.total_capacity }}</span
                                    >
                                  </div>
                                  <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {{ recommendation.total_rooms }} habitaciones · capacidad
                                    {{ recommendation.total_capacity }} · libres
                                    {{ recommendation.unused_capacity }}
                                  </div>
                                </template>

                                <!-- Vehículos -->
                                <template v-else>
                                  <div
                                    v-for="vehicle in recommendation.vehicles"
                                    :key="vehicle.service_variant_id"
                                    class="text-xs text-slate-700 dark:text-slate-300"
                                  >
                                    <strong>{{ vehicle.quantity }} ×</strong>
                                    {{ vehicle.name }}
                                    <span class="text-slate-500 dark:text-slate-400"
                                      >· capacidad {{ vehicle.total_capacity }}</span
                                    >
                                  </div>
                                  <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {{ recommendation.total_vehicles }} vehículos · capacidad
                                    {{ recommendation.total_capacity }} · libres
                                    {{ recommendation.unused_capacity }}
                                  </div>
                                </template>

                                <!-- Totales -->
                                <div
                                  class="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-xs dark:border-slate-700"
                                >
                                  <div>
                                    <span class="text-slate-500 dark:text-slate-400">Costo</span>
                                    <div class="font-semibold text-slate-900 dark:text-white">
                                      {{ money(recommendation.total_cost) }}
                                    </div>
                                  </div>
                                  <div>
                                    <span class="text-slate-500 dark:text-slate-400">Venta</span>
                                    <div class="font-semibold text-slate-900 dark:text-white">
                                      {{ money(recommendation.total_sale) }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>

                        <!-- NOTAS -->
                        <div>
                          <label
                            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >Observaciones</label
                          >
                          <textarea
                            v-model="form.notes"
                            rows="3"
                            class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <footer
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="cancel"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSave"
                @click="save"
              >
                <Pencil v-if="isEdit" class="mr-1 h-4 w-4" />
                <Plus v-else class="mr-1 h-4 w-4" />
                {{ isEdit ? 'Actualizar' : 'Agregar servicio' }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
//import { computed, onMounted, reactive, ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { Pencil, Plus, X } from 'lucide-vue-next'

import ServiceService from '../../catalog/services/services/service.service'

// ==========================================================================
// AJUSTAR LA RUTA SEGÚN TU ESTRUCTURA
// ==========================================================================
import { useQuotationCalculationStore } from '../stores/quotation-calculation.store'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
|
| item puede ser:
|
| ITEM NORMAL
|
| {
|   id,
|   uuid,
|   service_id,
|   ...
| }
|
| GRUPO
|
| {
|   group_uuid,
|   calculation_type,
|   items: [...]
| }
|
*/

const props = defineProps({
  currencyId: {
    type: [Number, String],
    required: true,
  },

  travelDate: {
    type: String,
    default: null,
  },

  itineraryDayNumber: {
    type: [Number, String],
    default: 1,
  },

  itineraryTravelDate: {
    type: String,
    default: null,
  },

  passengers: {
    type: Array,
    default: () => [],
  },

  item: {
    type: Object,
    default: null,
  },
})

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
|
| GENERIC:
|
| emit('save', item)
|
| AGRUPADO:
|
| emit('save', {
|   type: 'group',
|   group_uuid,
|   calculation_type,
|   items: [...]
| })
|
*/

const emit = defineEmits(['close', 'save'])

/*
|--------------------------------------------------------------------------
| STORES
|--------------------------------------------------------------------------
*/

const calculationStore = useQuotationCalculationStore()

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return !!props.item
})

const isGroupEdit = computed(() => {
  return Boolean(props.item?.group_uuid && Array.isArray(props.item?.items))
})

/*
|--------------------------------------------------------------------------
| EDIT BASE ITEM
|--------------------------------------------------------------------------
|
| Para grupos utilizamos el primer item para recuperar
| servicio, notas, duración, sort_order, etc.
|
*/

const editBaseItem = computed(() => {
  if (!props.item) {
    return null
  }

  if (isGroupEdit.value) {
    return props.item.items?.[0] ?? null
  }

  return props.item
})

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const loading = ref(false)

const loadingDetail = ref(false)

const loadingVariants = ref(false)

const loadingPrices = ref(false)

const loadingAutomaticPrice = ref(false)

const loadingRecommendations = ref(false)

const recommendationsLoaded = ref(false)

const error = ref(null)

const services = ref([])

const selectedService = ref(null)

const variants = ref([])

const prices = ref([])

const resolvedGenericPrice = ref(null)

const variantPrices = ref({})

const recommendations = ref([])

const selectedRecommendation = ref(null)

const currentGroupItems = ref([])

/*
|--------------------------------------------------------------------------
| FILTERS
|--------------------------------------------------------------------------
*/

const filters = reactive({
  search: '',
  category: '',
})

let searchTimeout = null
let serviceRequestSequence = 0

watch(
  () => filters.search,
  () => {
    window.clearTimeout(searchTimeout)

    searchTimeout = window.setTimeout(() => {
      loadServices()
    }, 300)
  },
)

onBeforeUnmount(() => {
  window.clearTimeout(searchTimeout)
})

/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
*/

const form = reactive({
  service_id: editBaseItem.value?.service_id ?? null,

  service_variant_id: editBaseItem.value?.service_variant_id ?? null,

  item_type: editBaseItem.value?.item_type ?? 'CATALOG',

  name: editBaseItem.value?.name ?? '',

  variant_name: editBaseItem.value?.variant_name ?? '',

  description: editBaseItem.value?.description ?? '',

  duration: editBaseItem.value?.duration ?? 1,

  quantity: editBaseItem.value?.quantity ?? 1,

  price_id: editBaseItem.value?.price_id ?? null,

  unit_cost: editBaseItem.value?.unit_cost ?? 0,

  unit_price: editBaseItem.value?.unit_price ?? 0,

  subtotal: editBaseItem.value?.subtotal ?? 0,

  sort_order: editBaseItem.value?.sort_order ?? 1,

  notes: editBaseItem.value?.notes ?? '',

  active: editBaseItem.value?.active ?? true,
})

/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

const categories = computed(() => {
  const map = new Map()

  services.value.forEach((service) => {
    const category = service.service_category

    if (!category) {
      return
    }

    if (!map.has(category.id)) {
      map.set(category.id, category)
    }
  })

  return Array.from(map.values())
})

/*
|--------------------------------------------------------------------------
| FILTERED SERVICES
|--------------------------------------------------------------------------
*/

const filteredServices = computed(() => {
  return services.value.filter((service) => {
    return !filters.category || Number(service.service_category?.id) === Number(filters.category)
  })
})

/*
|--------------------------------------------------------------------------
| CALCULATION TYPE
|--------------------------------------------------------------------------
|
| Idealmente después debe venir del backend.
|
*/

const calculationType = computed(() => {
  /*
  |--------------------------------------------------------------------------
  | En edición de grupo confiamos primero en lo persistido
  |--------------------------------------------------------------------------
  */

  if (isGroupEdit.value && props.item?.calculation_type) {
    return props.item.calculation_type
  }

  const category = selectedService.value?.service_category

  const code = category?.code?.toUpperCase()

  const name = category?.name?.toUpperCase()

  if (
    code === 'HOTEL' ||
    code === 'ACCOMMODATION' ||
    name?.includes('HOTEL') ||
    name?.includes('HABIT')
  ) {
    return 'accommodation'
  }

  if (code === 'TRANSPORT' || code === 'TRANSPORTATION' || name?.includes('TRANSPORT')) {
    return 'transport'
  }

  return 'generic'
})

const isRecommendationType = computed(() => {
  return ['accommodation', 'transport'].includes(calculationType.value)
})

const calculationTypeLabel = computed(() => {
  switch (calculationType.value) {
    case 'accommodation':
      return 'Alojamiento'

    case 'transport':
      return 'Transporte'

    default:
      return 'Servicio'
  }
})

const calculationBadgeClass = computed(() => {
  switch (calculationType.value) {
    case 'accommodation':
      return 'bg-info text-dark'

    case 'transport':
      return 'bg-warning text-dark'

    default:
      return 'bg-secondary'
  }
})

/*
|--------------------------------------------------------------------------
| SELECTED VARIANT
|--------------------------------------------------------------------------
*/

const selectedVariant = computed(() => {
  if (!form.service_variant_id) {
    return null
  }

  return (
    variants.value.find((variant) => Number(variant.id) === Number(form.service_variant_id)) ?? null
  )
})

/*
|--------------------------------------------------------------------------
| SELECTED PRICE
|--------------------------------------------------------------------------
*/

const selectedPrice = computed(() => {
  if (!form.price_id) {
    return null
  }

  return prices.value.find((price) => Number(price.id) === Number(form.price_id)) ?? null
})

const isAutomaticGroupPricing = computed(() => {
  if (!prices.value.length) {
    return false
  }

  return prices.value.every((price) => {
    return (
      price.price_type?.code === 'GROUP' &&
      price.price_type?.quantity_basis === 'PASSENGERS'
    )
  })
})

watch(
  [
    () => props.passengers.length,
    () => props.currencyId,
    () => props.travelDate,
    () => props.itineraryTravelDate,
  ],
  async () => {
    if (isAutomaticGroupPricing.value && selectedVariant.value) {
      await loadAutomaticGroupPrice()
    }
  },
)

/*
|--------------------------------------------------------------------------
| CURRENT GROUP SUMMARY
|--------------------------------------------------------------------------
*/

const currentGroupSummary = computed(() => {
  const items = currentGroupItems.value

  const quantity = items.reduce((total, item) => total + Number(item.quantity ?? 0), 0)

  const totalCost = items.reduce((total, item) => {
    const duration = calculationType.value === 'accommodation' ? Number(item.duration ?? 1) : 1

    return total + Number(item.quantity ?? 0) * Number(item.unit_cost ?? 0) * duration
  }, 0)

  const totalSale = items.reduce((total, item) => total + Number(item.subtotal ?? 0), 0)

  return {
    quantity,
    total_cost: totalCost,
    total_sale: totalSale,
  }
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  if (!selectedService.value) {
    return false
  }

  /*
  |--------------------------------------------------------------------------
  | Compuesto
  |--------------------------------------------------------------------------
  */

  if (isRecommendationType.value) {
    /*
    |--------------------------------------------------------------------------
    | Si se seleccionó nueva recomendación
    |--------------------------------------------------------------------------
    */

    if (selectedRecommendation.value) {
      return true
    }

    /*
    |--------------------------------------------------------------------------
    | Edición sin recalcular
    |--------------------------------------------------------------------------
    */

    if (isGroupEdit.value && currentGroupItems.value.length) {
      return true
    }

    return false
  }

  /*
  |--------------------------------------------------------------------------
  | Generic
  |--------------------------------------------------------------------------
  */

  if (isAutomaticGroupPricing.value) {
    return Boolean(selectedVariant.value && resolvedGenericPrice.value)
  }

  return Boolean(selectedVariant.value && selectedPrice.value && Number(form.quantity) > 0)
})

/*
|--------------------------------------------------------------------------
| LOAD SERVICES
|--------------------------------------------------------------------------
*/

async function loadServices() {
  const requestSequence = ++serviceRequestSequence

  loading.value = true
  error.value = null

  try {
    const response = await ServiceService.getAll({
      active: 1,
      search: filters.search.trim() || undefined,
      per_page: 50,
    })

    if (requestSequence === serviceRequestSequence) {
      services.value = response.data.data ?? []
    }
  } catch (err) {
    console.error('Error cargando servicios:', err)

    if (requestSequence === serviceRequestSequence) {
      error.value = 'No fue posible cargar los servicios.'
    }
  } finally {
    if (requestSequence === serviceRequestSequence) {
      loading.value = false
    }
  }
}

/*
|--------------------------------------------------------------------------
| SELECT SERVICE
|--------------------------------------------------------------------------
*/

async function selectService(service, options = {}) {
  const { autoRecommendations = true } = options

  if (loadingDetail.value && selectedService.value?.uuid === service.uuid) {
    return
  }

  loadingDetail.value = true

  error.value = null

  selectedService.value = null

  variants.value = []

  prices.value = []

  variantPrices.value = {}

  recommendations.value = []

  selectedRecommendation.value = null

  recommendationsLoaded.value = false

  form.service_id = null

  form.service_variant_id = null

  form.price_id = null

  try {
    /*
    |--------------------------------------------------------------------------
    | Servicio
    |--------------------------------------------------------------------------
    */

    const response = await ServiceService.get(service.uuid)

    selectedService.value = response.data.data

    form.service_id = selectedService.value.id

    /*
    |--------------------------------------------------------------------------
    | Variantes
    |--------------------------------------------------------------------------
    */

    await loadVariants()

    /*
    |--------------------------------------------------------------------------
    | Crear servicio compuesto
    |--------------------------------------------------------------------------
    |
    | Al crear podemos calcular automáticamente.
    |
    | En edición NO.
    |
    */

    if (isRecommendationType.value && autoRecommendations && !isGroupEdit.value) {
      await loadRecommendations()
    }
  } catch (err) {
    console.error('Error cargando detalle del servicio:', err)

    error.value = 'No fue posible cargar el servicio seleccionado.'

    selectedService.value = null
  } finally {
    loadingDetail.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD VARIANTS
|--------------------------------------------------------------------------
*/

async function loadVariants() {
  if (!selectedService.value) {
    return
  }

  loadingVariants.value = true

  try {
    const response = await ServiceService.getVariants(selectedService.value.uuid)

    variants.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando variantes:', err)

    variants.value = []

    error.value = 'No fue posible cargar las variantes del servicio.'
  } finally {
    loadingVariants.value = false
  }
}

/*
|--------------------------------------------------------------------------
| VARIANT CHANGE
|--------------------------------------------------------------------------
*/

async function onVariantChange() {
  form.price_id = null

  prices.value = []

  resolvedGenericPrice.value = null

  if (!selectedVariant.value) {
    return
  }

  await loadPrices()
}

/*
|--------------------------------------------------------------------------
| LOAD PRICES
|--------------------------------------------------------------------------
*/

async function loadPrices() {
  if (!selectedService.value || !selectedVariant.value) {
    return
  }

  loadingPrices.value = true

  error.value = null

  try {
    const response = await ServiceService.getPrices(
      selectedService.value.uuid,
      selectedVariant.value.id,
    )

    prices.value = response.data.data ?? []

    if (isAutomaticGroupPricing.value) {
      await loadAutomaticGroupPrice()
    }
  } catch (err) {
    console.error('Error cargando precios:', err)

    prices.value = []

    error.value = 'No fue posible cargar las tarifas disponibles.'
  } finally {
    loadingPrices.value = false
  }
}

async function loadAutomaticGroupPrice() {
  if (
    !selectedService.value ||
    !selectedVariant.value ||
    !isAutomaticGroupPricing.value
  ) {
    resolvedGenericPrice.value = null
    return
  }

  const serviceDate = props.itineraryTravelDate ?? props.travelDate

  if (!serviceDate) {
    resolvedGenericPrice.value = null
    error.value = 'Defina la fecha del servicio para resolver la tarifa grupal.'
    return
  }

  if (!props.passengers.length) {
    resolvedGenericPrice.value = null
    error.value = 'La cotización debe tener al menos un pasajero.'
    return
  }

  loadingAutomaticPrice.value = true
  resolvedGenericPrice.value = null
  error.value = null

  try {
    const result = await calculationStore.calculate({
      travel_date: serviceDate,
      currency_id: Number(props.currencyId),
      passengers: props.passengers,
      itineraries: [
        {
          day_number: Number(props.itineraryDayNumber ?? 1),
          travel_date: serviceDate,
          items: [
            {
              service_id: selectedService.value.id,
              service_variant_id: selectedVariant.value.id,
              item_type: 'CATALOG',
              calculation_type: 'generic',
              pricing_mode: 'AUTO_GROUP',
              name: selectedService.value.name,
              variant_name: selectedVariant.value.name,
              passengers: props.passengers,
            },
          ],
        },
      ],
    })

    resolvedGenericPrice.value = result.items?.[0] ?? null

    if (!resolvedGenericPrice.value) {
      error.value = 'No se obtuvo una tarifa para el número actual de pasajeros.'
    }
  } catch (err) {
    console.error('Error resolviendo tarifa grupal:', err)
    error.value =
      err.response?.data?.message ??
      'No existe una tarifa grupal aplicable al número actual de pasajeros.'
  } finally {
    loadingAutomaticPrice.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD ALL VARIANT PRICES
|--------------------------------------------------------------------------
*/

async function loadAllVariantPrices() {
  if (!selectedService.value) {
    return
  }

  variantPrices.value = {}

  const requests = variants.value.map(async (variant) => {
    try {
      const response = await ServiceService.getPrices(
        selectedService.value.uuid,
        variant.id,
      )

      const list = response.data.data ?? []

      /*
          |--------------------------------------------------------------------------
          | MVP
          |--------------------------------------------------------------------------
          |
          | Usamos la primera tarifa válida.
          |
          */

      variantPrices.value[variant.id] = list[0] ?? null
    } catch (err) {
      console.error(`Error cargando precio variante ${variant.id}:`, err)

      variantPrices.value[variant.id] = null
    }
  })

  await Promise.all(requests)
}

/*
|--------------------------------------------------------------------------
| BUILD VARIANT OPTIONS
|--------------------------------------------------------------------------
*/

function buildVariantOptions() {
  return variants.value.map((variant) => ({
    id: Number(variant.id),

    service_variant_id: Number(variant.id),

    name: variant.name,

    code: variant.code ?? null,

    min_capacity: Number(variant.min_capacity ?? 1),

    max_capacity: Number(variant.max_capacity ?? 1),

    optimal_capacity: Number(variant.optimal_capacity ?? variant.max_capacity ?? 1),

    unit_type: variant.unit_type ?? null,
  }))
}

/*
|--------------------------------------------------------------------------
| LOAD RECOMMENDATIONS
|--------------------------------------------------------------------------
*/

async function loadRecommendations() {
  if (!isRecommendationType.value) {
    return
  }

  recommendationsLoaded.value = false

  selectedRecommendation.value = null

  if (!props.passengers.length) {
    recommendations.value = []

    error.value = 'La cotización no tiene pasajeros.'

    return
  }

  loadingRecommendations.value = true

  error.value = null

  try {
    const options = buildVariantOptions()

    if (!options.length) {
      recommendations.value = []

      error.value = 'El servicio no tiene variantes disponibles.'

      return
    }

    /*
    |--------------------------------------------------------------------------
    | Item temporal
    |--------------------------------------------------------------------------
    */

    const item = {
      service_id: selectedService.value.id,

      name: selectedService.value.name,

      calculation_type: calculationType.value,

      duration: Number(form.duration ?? 1),

      passengers: props.passengers,
    }

    /*
    |--------------------------------------------------------------------------
    | Accommodation
    |--------------------------------------------------------------------------
    */

    if (calculationType.value === 'accommodation') {
      item.room_types = options
    }

    /*
    |--------------------------------------------------------------------------
    | Transport
    |--------------------------------------------------------------------------
    */

    if (calculationType.value === 'transport') {
      item.vehicle_types = options
    }

    /*
    |--------------------------------------------------------------------------
    | Motor
    |--------------------------------------------------------------------------
    */

    const result = await calculationStore.calculate({
      travel_date: props.itineraryTravelDate ?? props.travelDate,

      currency_id: Number(props.currencyId),

      pricing_currency_id: Number(props.currencyId),

      passengers: props.passengers,

      itineraries: [
        {
          day_number: Number(props.itineraryDayNumber ?? 1),

          travel_date: props.itineraryTravelDate ?? props.travelDate,

          items: [item],
        },
      ],
    })

    const calculatedItem = result.items?.[0]

    recommendations.value = calculatedItem?.metadata?.recommendations ?? []

    /*
    |--------------------------------------------------------------------------
    | Recomendación #1
    |--------------------------------------------------------------------------
    */

    selectedRecommendation.value = recommendations.value[0] ?? null
  } catch (err) {
    console.error('Error calculando recomendaciones:', err)

    recommendations.value = []

    selectedRecommendation.value = null

    error.value = 'No fue posible generar las recomendaciones.'
  } finally {
    recommendationsLoaded.value = true

    loadingRecommendations.value = false
  }
}

/*
|--------------------------------------------------------------------------
| SELECT RECOMMENDATION
|--------------------------------------------------------------------------
*/

function selectRecommendation(recommendation) {
  selectedRecommendation.value = recommendation
}

/*
|--------------------------------------------------------------------------
| FIND PRICE FOR VARIANT
|--------------------------------------------------------------------------
*/

function getVariantPrice(serviceVariantId) {
  return variantPrices.value[serviceVariantId] ?? null
}

/*
|--------------------------------------------------------------------------
| INITIALIZE EDIT
|--------------------------------------------------------------------------
*/

async function initializeEdit() {
  if (!props.item) {
    return
  }

  const baseItem = editBaseItem.value

  if (!baseItem?.service_id) {
    error.value = 'El item no tiene un servicio asociado.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Buscar servicio
  |--------------------------------------------------------------------------
  */

  const service = services.value.find(
    (service) => Number(service.id) === Number(baseItem.service_id),
  )

  if (!service) {
    error.value = 'No se encontró el servicio en el catálogo.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Grupo
  |--------------------------------------------------------------------------
  */

  if (isGroupEdit.value) {
    currentGroupItems.value = clonePlain(props.item.items ?? [])

    form.duration = baseItem.duration ?? 1

    form.notes = baseItem.notes ?? ''

    /*
    |--------------------------------------------------------------------------
    | Cargar servicio sin recalcular
    |--------------------------------------------------------------------------
    */

    await selectService(service, {
      autoRecommendations: false,
    })

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Item normal
  |--------------------------------------------------------------------------
  */

  await selectService(service, {
    autoRecommendations: false,
  })

  const variantExists = variants.value.some(
    (variant) => Number(variant.id) === Number(baseItem.service_variant_id),
  )

  if (!variantExists) {
    error.value = 'La variante del servicio ya no está disponible.'

    return
  }

  form.service_variant_id = baseItem.service_variant_id

  await loadPrices()

  const priceExists = prices.value.some((price) => Number(price.id) === Number(baseItem.price_id))

  if (baseItem.price_id && priceExists) {
    form.price_id = baseItem.price_id
  } else if (baseItem.price_id) {
    error.value = 'La tarifa utilizada anteriormente ya no está disponible.'
  }

  form.quantity = baseItem.quantity ?? 1

  form.notes = baseItem.notes ?? ''
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  if (!canSave.value) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | SERVICIO COMPUESTO
  |--------------------------------------------------------------------------
  */

  if (isRecommendationType.value) {
    /*
    |--------------------------------------------------------------------------
    | Si estamos editando y NO se seleccionó una nueva recomendación,
    | mantenemos la distribución actual.
    |--------------------------------------------------------------------------
    */

    if (isGroupEdit.value && !selectedRecommendation.value) {
      saveExistingGroup()

      return
    }

    /*
    |--------------------------------------------------------------------------
    | Nueva recomendación
    |--------------------------------------------------------------------------
    */

    saveRecommendedGroup()

    return
  }

  /*
  |--------------------------------------------------------------------------
  | GENERIC
  |--------------------------------------------------------------------------
  */

  saveGenericItem()
}

/*
|--------------------------------------------------------------------------
| SAVE GENERIC ITEM
|--------------------------------------------------------------------------
*/

function saveGenericItem() {
  const automaticItem = isAutomaticGroupPricing.value
    ? resolvedGenericPrice.value?.item
    : null

  const quantity = automaticItem
    ? Number(automaticItem.quantity)
    : Number(form.quantity)

  const unitCost = automaticItem
    ? Number(automaticItem.unit_cost)
    : Number(selectedPrice.value?.cost ?? 0)

  const unitPrice = automaticItem
    ? Number(automaticItem.unit_price)
    : Number(selectedPrice.value?.sale_price ?? 0)

  const item = {
    /*
    |--------------------------------------------------------------------------
    | Mantener identidad si estamos editando
    |--------------------------------------------------------------------------
    */

    id: editBaseItem.value?.id ?? undefined,

    uuid: editBaseItem.value?.uuid ?? undefined,

    service_id: selectedService.value.id,

    service_variant_id: selectedVariant.value.id,

    item_type: 'CATALOG',

    name: selectedService.value.name,

    variant_name: selectedVariant.value.name,

    description: selectedService.value.description ?? '',

    calculation_type: 'generic',

    group_uuid: null,

    group_index: null,

    duration: selectedVariant.value.duration ?? 1,

    quantity,

    price_id: automaticItem?.price_id ?? selectedPrice.value?.id ?? null,

    price_list_id: automaticItem?.price_list_id ?? null,

    price_list_item_id: automaticItem?.price_list_item_id ?? null,

    base_cost: Number(automaticItem?.base_cost ?? unitCost),

    base_price: Number(automaticItem?.base_price ?? unitPrice),

    unit_cost: unitCost,

    unit_price: unitPrice,

    subtotal: quantity * unitPrice,

    subtotal_cost: quantity * unitCost,

    subtotal_sale: quantity * unitPrice,

    pricing_mode: automaticItem ? 'AUTO_GROUP' : undefined,

    sort_order: editBaseItem.value?.sort_order ?? 1,

    notes: form.notes,

    active: editBaseItem.value?.active ?? true,
  }

  emit('save', item)

  close()
}

/*
|--------------------------------------------------------------------------
| SAVE EXISTING GROUP
|--------------------------------------------------------------------------
|
| El usuario abrió el grupo pero no solicitó
| una nueva combinación.
|
| Conservamos IDs/UUIDs reales.
|
*/

function saveExistingGroup() {
  const items = currentGroupItems.value.map((item, index) => ({
    ...clonePlain(item),

    group_uuid: props.item.group_uuid,

    group_index: index + 1,

    calculation_type: calculationType.value,

    duration: calculationType.value === 'accommodation' ? Number(form.duration ?? 1) : 1,

    notes: form.notes,
  }))

  emit('save', {
    type: 'group',

    group_uuid: props.item.group_uuid,

    calculation_type: calculationType.value,

    items,
  })

  close()
}

/*
|--------------------------------------------------------------------------
| SAVE RECOMMENDED GROUP
|--------------------------------------------------------------------------
*/

function saveRecommendedGroup() {
  const selected = selectedRecommendation.value

  /*
  |--------------------------------------------------------------------------
  | UUID
  |--------------------------------------------------------------------------
  |
  | Si editamos mantenemos group_uuid.
  |
  | Si creamos generamos uno nuevo.
  |
  */

  const groupUuid = isGroupEdit.value ? props.item.group_uuid : crypto.randomUUID()

  /*
  |--------------------------------------------------------------------------
  | Componentes elegidos
  |--------------------------------------------------------------------------
  */

  const selectedParts =
    calculationType.value === 'accommodation' ? (selected.rooms ?? []) : (selected.vehicles ?? [])

  /*
  |--------------------------------------------------------------------------
  | Items anteriores por service_variant_id
  |--------------------------------------------------------------------------
  |
  | Esto permite conservar id/uuid si una variante
  | continúa existiendo en la nueva distribución.
  |
  */

  const existingByVariant = new Map()

  if (isGroupEdit.value) {
    currentGroupItems.value.forEach((item) => {
      existingByVariant.set(Number(item.service_variant_id), item)
    })
  }

  /*
  |--------------------------------------------------------------------------
  | Construir N QuotationItem
  |--------------------------------------------------------------------------
  */

  const items = selectedParts.map((part, index) => {
    const variantId = Number(part.service_variant_id)

    const existing = existingByVariant.get(variantId)

    /*
        |--------------------------------------------------------------------------
        | Tarifa
        |--------------------------------------------------------------------------
        */

    const price = getVariantPrice(variantId)

    const quantity = Number(part.quantity ?? 0)

    const unitCost = Number(part.unit_cost ?? price?.cost ?? 0)

    const unitPrice = Number(part.unit_price ?? price?.sale_price ?? 0)

    const duration = calculationType.value === 'accommodation' ? Number(form.duration ?? 1) : 1

    /*
        |--------------------------------------------------------------------------
        | Cada fila guarda SU subtotal real.
        |--------------------------------------------------------------------------
        */

    const subtotal = quantity * unitPrice * duration

    return {
      /*
          |--------------------------------------------------------------------------
          | Identidad existente
          |--------------------------------------------------------------------------
          */

      id: existing?.id ?? undefined,

      uuid: existing?.uuid ?? undefined,

      /*
          |--------------------------------------------------------------------------
          | Agrupación
          |--------------------------------------------------------------------------
          */

      group_uuid: groupUuid,

      group_index: index + 1,

      calculation_type: calculationType.value,

      /*
          |--------------------------------------------------------------------------
          | Relaciones reales
          |--------------------------------------------------------------------------
          */

      service_id: selectedService.value.id,

      service_variant_id: variantId,

      price_id:
        part.price_id ??
        part.price_ids?.[0] ??
        price?.id ??
        existing?.price_id ??
        null,

      price_list_id:
        part.price_list_id ??
        part.price_list_ids?.find((id) => id != null) ??
        existing?.price_list_id ??
        null,

      price_list_item_id:
        part.price_list_item_id ??
        part.price_list_item_ids?.find((id) => id != null) ??
        existing?.price_list_item_id ??
        null,

      /*
          |--------------------------------------------------------------------------
          | Datos descriptivos
          |--------------------------------------------------------------------------
          */

      item_type: 'CATALOG',

      name: selectedService.value.name,

      variant_name: part.name,

      description: selectedService.value.description ?? '',

      /*
          |--------------------------------------------------------------------------
          | Economía
          |--------------------------------------------------------------------------
          */

      duration,

      quantity,

      base_cost: Number(part.base_cost ?? unitCost),

      base_price: Number(part.base_price ?? unitPrice),

      unit_cost: unitCost,

      unit_price: unitPrice,

      subtotal,

      /*
          |--------------------------------------------------------------------------
          | Todos comparten sort_order del servicio lógico.
          |--------------------------------------------------------------------------
          */

      sort_order: editBaseItem.value?.sort_order ?? 1,

      notes: form.notes,

      active: existing?.active ?? true,
    }
  })

  /*
  |--------------------------------------------------------------------------
  | Emitir grupo
  |--------------------------------------------------------------------------
  */

  emit('save', {
    type: 'group',

    group_uuid: groupUuid,

    calculation_type: calculationType.value,

    /*
      |--------------------------------------------------------------------------
      | Los items que desaparecieron NO vienen aquí.
      |
      | El update/backend podrá compararlos contra
      | los existentes del group_uuid y eliminarlos.
      |--------------------------------------------------------------------------
      */

    items,
  })

  close()
}

/*
|--------------------------------------------------------------------------
| CLONE PLAIN
|--------------------------------------------------------------------------
|
| Evitamos structuredClone sobre proxies Vue.
|
*/

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value))
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| CANCEL / CLOSE
|--------------------------------------------------------------------------
*/

function cancel() {
  close()
}

function close() {
  emit('close')
}

/*
|--------------------------------------------------------------------------
| CLEAR FILTERS
|--------------------------------------------------------------------------
*/

function clearFilters() {
  filters.search = ''

  filters.category = ''
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await loadServices()

  if (isEdit.value) {
    await initializeEdit()
  }
})
</script>
