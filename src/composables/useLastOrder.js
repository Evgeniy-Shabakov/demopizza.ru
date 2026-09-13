import { api } from '@/api/api'

export const lastOrder = ref(null)
export const isLoadingLastOrder = ref(false)
export const lastOrderError = ref(null)

export async function loadLastOrder() {
   if (isLoadingLastOrder.value) return

   isLoadingLastOrder.value = true
   lastOrderError.value = null

   try {
      const response = await api.get('/orders/last')
      lastOrder.value = response.data.data

      const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
      lastOrder.value?.orderProducts?.forEach(orderProduct => {
         if (orderProduct.product?.imagePath) {
            orderProduct.product.imagePath = `${baseUrl}/${orderProduct.product.imagePath.replace(/^\//, '').replace(/^storage\/public\/?/, '')}`
         }
      })
   } catch (error) {
      lastOrderError.value = error.response?.data?.message || 'Ошибка при загрузке последнего заказа!'
   } finally {
      isLoadingLastOrder.value = false
   }
}