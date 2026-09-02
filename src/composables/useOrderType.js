import { ORDER_TYPE } from "@/constants/orderType"

export const orderTypeId = useLocalStorage('order_type_id', ORDER_TYPE.DELIVERY_TO_ADDRESS.ID)

export const deliveryToAddress = computed(() => {
   return orderTypeId.value == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID
})

export const pickUpAtCounter = computed(() => {
   return orderTypeId.value == ORDER_TYPE.PICK_UP_AT_COUNTER.ID
})

export const atRestToTable = computed(() => {
   return orderTypeId.value == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID
})

export const atRestAtCounter = computed(() => {
   return orderTypeId.value == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID
})

export const atRest = computed(() => {
   return atRestToTable.value || atRestAtCounter.value
})


export const orderTypeShortName = computed(() => {
   if (deliveryToAddress.value) return 'доставка'
   if (pickUpAtCounter.value) return 'самовывоз'
   if (atRest.value) return 'в ресторане'
})