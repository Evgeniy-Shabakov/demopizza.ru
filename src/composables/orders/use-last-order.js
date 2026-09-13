import { api } from '@/api/api'
import { normalizeProductImagePathForOrder } from '@/helpers/normalize-product-image-path'

export const lastOrder = ref(null)
export const isLoadingLastOrder = ref(false)
export const lastOrderError = ref(null)
export const isLastOrderLoaded = ref(false)

export async function loadLastOrder() {
   if (isLoadingLastOrder.value) return

   isLoadingLastOrder.value = true
   lastOrderError.value = null

   try {
      const response = await api.get('/orders/last')
      lastOrder.value = response.data.data

      normalizeProductImagePathForOrder(lastOrder.value)
   } catch (error) {
      lastOrderError.value = error.response?.data?.message || 'Ошибка при загрузке последнего заказа!'
   } finally {
      isLoadingLastOrder.value = false
   }
}