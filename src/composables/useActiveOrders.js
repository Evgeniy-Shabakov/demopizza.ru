import { api } from '@/api/api'

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

      const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
      activeOrders.value.forEach(order => {
         order.orderProducts?.forEach(orderProduct => {
            if (orderProduct.product?.imagePath) {
               orderProduct.product.imagePath = `${baseUrl}/${orderProduct.product.imagePath.replace(/^\//, '').replace(/^storage\/public\/?/, '')}`
            }
         })
      })
   } catch (error) {
      activeOrdersError.value = error.response?.data?.message || 'Ошибка при загрузке активных заказов!'
   } finally {
      isLoadingActiveOrders.value = false
   }
}