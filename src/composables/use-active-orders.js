import { api } from '@/api/api'
import { normalizeProductImagePathForOrders } from '@/helpers/normalize-product-image-path'

export const activeOrders = ref([])
export const isLoadingActiveOrders = ref(false)
export const activeOrdersError = ref(null)

export async function loadActiveOrders() {
   if (isLoadingActiveOrders.value) return

   isLoadingActiveOrders.value = true
   activeOrdersError.value = null

   try {
      const response = await api.get('/orders/active')
      activeOrders.value = response.data.data ?? []

      normalizeProductImagePathForOrders(activeOrders.value)
   } catch (error) {
      activeOrdersError.value = error.response?.data?.message || 'Ошибка при загрузке активных заказов!'
   } finally {
      isLoadingActiveOrders.value = false
   }
}