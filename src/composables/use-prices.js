import { currentDeliveryZone } from "./use-delivery-zones"
import { deliveryToAddress } from "./use-order-type"
import { productsInCart } from "./use-cart"

export const totalProductPrice = computed(() => {
   let total = 0
   productsInCart.value.forEach(element => {
      total += element.quantity * element.priceDefault
   })
   return Number(total)
})

export const deliveryPrice = computed(() => {
   if (!deliveryToAddress.value)
      return 0

   if (totalProductPrice.value >= currentDeliveryZone.value?.orderValueForFreeDelivery)
      return 0

   if (currentDeliveryZone.value) {
      return Number(currentDeliveryZone.value?.deliveryPrice)
   }
   else return 0 //лучше посчитать минимальную стоимость доставки по городу
})

export const totalPrice = computed(() => {
   return Number(totalProductPrice.value + deliveryPrice.value)
})