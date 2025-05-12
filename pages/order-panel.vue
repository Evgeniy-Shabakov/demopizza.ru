<script setup>
import axios from 'axios'

import { authUser, lastOrderForUser } from '~/js/axios-helper.js'
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, currentOrder,
   selectedOrderType, selectedAddressForDelivery, totalCountInCart, removeAllProductsFromCart,
   selectedRestaurant, selectedOrderInRestaurantType
} from '~/js/client-helper.js'
import { loginForOrder } from '~/js/login-panel-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { ORDER_IN_RESTAURANT_TYPE } from '~/js/data-types/order-in-restaurant-type'
import { PAYMENT_TYPE } from '~/js/data-types/payment-type'
import { setAddressForDelivery } from '~/js/order-panel-helper.js'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { userAddresses } from '~/js/address-index.js'
import { checkOperatingModeAndActivateDialog } from '~/js/open-close-time'

const orderData = reactive({})

const productsInOrder = ref([])

const addressesInSelectedCity = ref([])

const validationErrors = ref({})
const otherErrors = ref()

const { isRequestRunning, controlClick } = useBlockBtnForAsyncRequest()

if (authUser.value == null) {
   loginForOrder.value = true
   navigateTo('/login')
}
else {
   productsInOrder.value = productsInCart.value
      .filter(product => product.countInCart > 0)

   addressesInSelectedCity.value = userAddresses.value
      .filter(address => address.city.id === selectedCity.value.id)

   setAddressForDelivery()

   orderData.user_id = authUser.value.id
   orderData.city_id = selectedCity.value.id
   orderData.restaurant_id = selectedRestaurant.value ? selectedRestaurant.value.id : null
   orderData.user_address_id = selectedAddressForDelivery.value ? selectedAddressForDelivery.value.id : null
   orderData.order_type = selectedOrderType.value
   orderData.order_in_restaurant_type = selectedOrderInRestaurantType.value
   orderData.table_number = null
   orderData.car_number = null
   orderData.pack_takeaway = true
   orderData.total_products_price = totalProductPrice.value
   orderData.delivery_price = deliveryPrice.value
   orderData.total_price = totalPrice.value
   orderData.payment_type = PAYMENT_TYPE.cardOffline
   orderData.banknote_for_change = null
   orderData.is_payment = false
   orderData.comment = null
   orderData.products_in_order = productsInOrder.value
}

watch(selectedAddressForDelivery, () => { //v-model это selectedAddressForDelivery, чтобы сохранить изменения
   orderData.user_address_id = selectedAddressForDelivery.value.id
})

watch(selectedOrderInRestaurantType, () => { //v-model это selectedOrderInRestaurantType, чтобы сохранить изменения
   orderData.order_in_restaurant_type = selectedOrderInRestaurantType.value
})

watch(selectedRestaurant, () => {
   orderData.restaurant_id = selectedRestaurant.value.id
   setOrderInRestaurantType()
})

function setOrderInRestaurantType() {
   if (selectedOrderInRestaurantType.value == ORDER_IN_RESTAURANT_TYPE.COUNTER) {
      if (selectedRestaurant.value.pick_up_at_counter_available)
         return
      else
         selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.TABLE
   }

   if (selectedOrderInRestaurantType.value == ORDER_IN_RESTAURANT_TYPE.TABLE) {
      if (selectedRestaurant.value.at_restaurant_to_table_available)
         return
      else
         selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.COUNTER
   }
}

async function sendOrder() {
   if (!checkOperatingModeAndActivateDialog()) return

   if (selectedOrderType.value == ORDER_TYPE.delivery) {
      orderData.restaurant_id = null
   }

   if (selectedOrderType.value != ORDER_TYPE.inRestaurant) {
      orderData.order_in_restaurant_type = null
   }

   validationErrors.value = {}
   otherErrors.value = null

   try {
      const res = await axios.post(`/orders`, orderData)
      currentOrder.value = res.data.data

      lastOrderForUser.value = res.data.data

      removeAllProductsFromCart()
      router.push({ name: 'client.menu.popup.order-status-panel' })
   } catch (error) {
      console.log(error)

      if (error.response.status === 422) {
         validationErrors.value = error.response.data.errors
         transformValidateErrorsForUI(validationErrors.value)
      } else {
         otherErrors.value = 'что то пошло не так, попробуйте еще раз';
      }
   }
}
</script>

<template>

   <PopupPageWrapper>

      order-panel
      <template #actions>



      </template>

   </PopupPageWrapper>

</template>

<style scoped></style>