import { ORDER_TYPE } from '@/constants/orderType'
import { api } from '@/api/api'
import { cityId } from '@/composables/useCities'
import { atRest, orderTypeId, pickUpAtCounter } from '@/composables/useOrderType'

export const restaurants = ref(null)

export const restaurantId = useLocalStorage('restaurant_id', null)

export const currentRestaurant = computed(() =>
   restaurants.value?.find(rest => rest.id == restaurantId.value)
)

export async function loadRestaurants() {
   const response = await api.get('/restaurants')
   restaurants.value = response.data.data

   setRestaurant()
}

watch([cityId, orderTypeId], setRestaurant)

function setRestaurant() {
   const currentRestaurantIsInAvailableList =
      availableRestaurants.value.some(rest => rest.id == restaurantId.value)

   if (!currentRestaurantIsInAvailableList) {
      restaurantId.value = availableRestaurants.value.length ?
         availableRestaurants.value[0].id : null
   }
}

const cityRestaurants = computed(() => {
   if (!restaurants.value) return []
   if (!cityId.value) return []

   return restaurants.value.filter(rest => rest.cityId == cityId.value)
})

export const restaurantsForDeliveryToAddress = computed(() => {
   return cityRestaurants.value.filter(rest => rest.deliveryToAddressAvailable)
})

export const restaurantsForPickUpAtCounter = computed(() => {
   return cityRestaurants.value.filter(rest => rest.pickUpAtCounterAvailable)
})

export const restaurantsForAtRestaurant = computed(() => {
   return cityRestaurants.value.filter(rest =>
      rest.atRestaurantAtCounterAvailable || rest.atRestaurantToTableAvailable)
})

export const availableRestaurants = computed(() => {
   if (pickUpAtCounter.value) return restaurantsForPickUpAtCounter.value
   if (atRest.value) return restaurantsForAtRestaurant.value

   return cityRestaurants.value
})


// перенес сюда availableOrderTypeIds и watch из OrderTypeSelect, 
// чтобы смена типа заказа происходила при смене города из бургер меню
// нельзя в useOrderType т.к. будет циклическая зависимость 
const availableOrderTypeIds = computed(() => {
   const ids = []
   if (restaurantsForDeliveryToAddress.value.length) ids.push(ORDER_TYPE.DELIVERY_TO_ADDRESS.ID)
   if (restaurantsForPickUpAtCounter.value.length) ids.push(ORDER_TYPE.PICK_UP_AT_COUNTER.ID)
   if (restaurantsForAtRestaurant.value.length) {
      ids.push(ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID)
      ids.push(ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID)
   }
   return ids
})

//при смене города сменить тип заказа на первый доступный, если тип заказа не поддерживается
//смена города приводит к смене ресторанов
watch(availableOrderTypeIds, () => {
   if (availableOrderTypeIds.value.length && !availableOrderTypeIds.value.includes(orderTypeId.value)) {
      orderTypeId.value = availableOrderTypeIds.value[0]
   }
})