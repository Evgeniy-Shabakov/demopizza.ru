import { api } from '@/api/api'
import { normalizeProductImagePathForOrders } from '@/helpers/normalize-product-image-path'

export const ordersHistory = ref([])
export const isLoadingOrdersHistory = ref(false)
export const ordersHistoryError = ref(null)

export async function loadOrdersHistory() {
	if (isLoadingOrdersHistory.value) return

	isLoadingOrdersHistory.value = true
	ordersHistoryError.value = null

	try {
		const response = await api.get('/orders/history')
		ordersHistory.value = response.data.data

		normalizeProductImagePathForOrders(ordersHistory.value)
	} catch (error) {
		ordersHistoryError.value = error.response?.data?.message || 'Ошибка при загрузке истории заказов!'
	} finally {
		isLoadingOrdersHistory.value = false
	}
}
