import { restaurantId } from '@/composables/useRestaurants'

export function isProductInStopList(product) {
   if (!product?.productRestaurants?.length) return false
   return product.productRestaurants.some(productRestaurant =>
      productRestaurant.restaurantId == restaurantId.value && productRestaurant.isInStopList)
}