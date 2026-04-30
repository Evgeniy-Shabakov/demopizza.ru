import { categories, restaurants, logout, lastOrderForUser } from '~/js/axios-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type.js'
import { COOKIE_NAME } from '~/js/strings/cookie-name.js'
import { checkProductAvailabilityForCart } from '~/js/models/product'
import { currentDeliveryZone } from '~/js/delivery-zone-helper'
import { isProductInStopListForSelectedCity, isProductInStopListForSelectedRestaurant } from '~/js/models/product'

export const selectedCity = ref()
export const selectedRestaurant = ref()
export const selectedOrderType = ref()
export const selectedAddressForDelivery = ref(null)
export const productsInCart = ref([])
export const currentOrder = ref()

export let restaurantsInSelectedCity = []

export function defineRestaurantsInSelectedCity() {
   if (!restaurants.value) {
      console.log('Невозможно определить рестораны для выбранного города')
      return
   }

   restaurantsInSelectedCity = restaurants.value.filter(el =>
      el.city.id === selectedCity.value.id && el.isActive)
}

export function setStopListForProducts() {
   categories.value.forEach(category => {
      category.products.forEach(product => {
         product.isInStopListForSelectedCity = isProductInStopListForSelectedCity(product)
         product.isInStopListForSelectedRestaurant = isProductInStopListForSelectedRestaurant(product)
      })
   })

   productsInCart.value.forEach(product => {
      if (product.isInStopListForSelectedCity) product.countInCart = 0
      if (product.isInStopListForSelectedRestaurant &&
         selectedOrderType.value.ID != ORDER_TYPE.DELIVERY_TO_ADDRESS.ID) {
         product.countInCart = 0
      }
   })

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

watch(selectedCity, () => {
   localStorage.setItem(COOKIE_NAME.CITY_ID, selectedCity.value.id)

   if (restaurants.value) {
      defineRestaurantsInSelectedCity()

      let listForSelecte = restaurants.value.filter(rest => rest.city.id === selectedCity.value.id)

      if (selectedOrderType.value.ID == ORDER_TYPE.PICK_UP_AT_COUNTER.ID) {
         listForSelecte = listForSelecte.filter(rest => rest.pickUpAtCounterAvailable)
      }

      if (selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
         selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID) {
         listForSelecte = listForSelecte
            .filter(rest => rest.atRestaurantAtCounterAvailable || rest.atRestaurantToTableAvailable)
      }

      //при обновлении страницы selectedRestaurant.value не успевает инициализироваться
      // в client-initialize.js и selectedRestaurant.value сбрасывается
      const idsArray = listForSelecte.map(rest => rest.id)

      if (!selectedRestaurant.value || !idsArray.includes(selectedRestaurant.value.id)) {
         selectedRestaurant.value = listForSelecte[0]
      }

      setStopListForProducts()
   }
})

watch(selectedRestaurant, () => {
   localStorage.setItem(COOKIE_NAME.RESTAURANT_ID, selectedRestaurant.value.id)

   if (restaurantsInSelectedCity.length > 0)
      setStopListForProducts()
})

watch(selectedOrderType, () => {
   localStorage.setItem(COOKIE_NAME.ORDER_TYPE_ID, selectedOrderType.value.ID)
})

watch(selectedAddressForDelivery, () => {
   // не перезаписывать куки, когда не удалость установть адрес
   // установка адреса происходит в order-panel.vue
   if (selectedAddressForDelivery.value == null) return

   localStorage.setItem(COOKIE_NAME.ADDRESS_DELIVERY_ID, selectedAddressForDelivery.value.id)
})

export function logoutClient() {
   logout()

   lastOrderForUser.value = null

   removeAllProductsFromCart()
   localStorage.removeItem(COOKIE_NAME.ADDRESS_DELIVERY_ID)
   localStorage.removeItem(COOKIE_NAME.CART)
}

export const deliveryAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.id === selectedCity.value.id) {
         if (restaurants.value[i].deliveryToAddressAvailable)
            return true
      }
   }
   return false
})

export const pickUpAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.id === selectedCity.value.id) {
         if (restaurants.value[i].pickUpAtCounterAvailable ||
            restaurants.value[i].pickUpAtCarWindowAvailable)
            return true
      }
   }
   return false
})

export const restaurantAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.id === selectedCity.value.id) {
         if (restaurants.value[i].atRestaurantAtCounterAvailable ||
            restaurants.value[i].atRestaurantToTableAvailable ||
            restaurants.value[i].deliveryToRestaurantParkingAvailable
         )
            return true
      }
   }
   return false
})

//при смене города сменить способ доставки на первый доступный
watch([selectedCity, pickUpAvailableInSelectedCity, deliveryAvailableInSelectedCity, restaurantAvailableInSelectedCity], () => {
   if (selectedOrderType.value) {
      //если способ доставки выбран и не поддерживается в новом городе, то сменить на первый доступный
      if (selectedOrderType.value == ORDER_TYPE.DELIVERY_TO_ADDRESS && deliveryAvailableInSelectedCity.value == false ||
         selectedOrderType.value == ORDER_TYPE.PICK_UP_AT_COUNTER && pickUpAvailableInSelectedCity.value == false ||
         selectedOrderType.value == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER && restaurantAvailableInSelectedCity.value == false ||
         selectedOrderType.value == ORDER_TYPE.AT_RESTAURANT_TO_TABLE && restaurantAvailableInSelectedCity.value == false
      ) {
         if (deliveryAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.DELIVERY_TO_ADDRESS.ID
         }
         else if (pickUpAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.PICK_UP_AT_COUNTER.ID
         }
         else if (restaurantAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID
         }
      }
   }
   else {
      if (deliveryAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.DELIVERY_TO_ADDRESS.ID
      }
      else if (pickUpAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.PICK_UP_AT_COUNTER.ID
      }
      else if (restaurantAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID
      }
   }
})

export const totalCountInCart = computed(() => {
   let total = 0
   productsInCart.value.forEach(element => {
      total += element.countInCart
   })
   return total
})

export const totalProductPrice = computed(() => {
   let total = 0
   productsInCart.value.forEach(element => {
      total += element.countInCart * element.priceDefault
   })
   return Number(total)
})

export const deliveryPrice = computed(() => {
   if (selectedOrderType.value != ORDER_TYPE.delivery)
      return 0;

   if (totalProductPrice.value >= currentDeliveryZone.value?.deliveryPrices.orderValueForFreeDelivery)
      return 0;

   if (currentDeliveryZone.value) {
      return Number(currentDeliveryZone.value?.deliveryPrices.deliveryPrice)
   }
   else return 0 //лучше посчитать минимальную стоимость доставки по городу
})

export const totalPrice = computed(() => {
   return Number(totalProductPrice.value + deliveryPrice.value)
})

export function plusProductToCart(product, userConfig, quantity = 1) {
   if (!checkProductAvailabilityForCart(product)) return

   if (userConfig) {
      if (productsInCart.value.includes(userConfig)) {
         userConfig.countInCart += quantity
      }
      else {
         userConfig.countInCart = quantity

         userConfig.id = product.id //для передачи на бэк и инициализации

         userConfig.title = product.title
         userConfig.image_url = product.image_url

         productsInCart.value.push(userConfig)
      }
   }
   else {
      if (productsInCart.value.includes(product)) {
         product.countInCart += quantity
      }
      else {
         product.countInCart = quantity
         productsInCart.value.push(product)
      }
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function minusProductInCartForCartPanel(product, userConfig) {
   if (userConfig) {
      if (userConfig.countInCart == 0) return
      userConfig.countInCart--
   }
   else {
      if (product.countInCart == 0) return
      product.countInCart--
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function minusProductInCartForMenuPage(product, userConfig) {
   if (userConfig) {
      userConfig.countInCart--

      if (userConfig.countInCart <= 0) removeProductFromCart(product, userConfig)
   }
   else {
      product.countInCart--

      if (product.countInCart <= 0) removeProductFromCart(product)
   }


   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function removeProductFromCart(product, userConfig) {
   if (userConfig) {
      userConfig.countInCart = 0;
      let index = productsInCart.value.indexOf(userConfig)
      if (index !== -1) productsInCart.value.splice(index, 1);
   }
   else {
      product.countInCart = 0;
      let index = productsInCart.value.indexOf(product)
      if (index !== -1) productsInCart.value.splice(index, 1);
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function removeAllProductsFromCart() {
   productsInCart.value.forEach(el => el.countInCart = 0)

   productsInCart.value.length = 0
   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

