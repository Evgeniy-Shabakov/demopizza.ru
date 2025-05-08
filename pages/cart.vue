<script setup>
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice,
   deliveryAvailableInSelectedCity, pickUpAvailableInSelectedCity, restaurantAvailableInSelectedCity,
   selectedOrderType
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'

</script>

<template>

   <PopupPageWrapper>

      <CitySelecte />

      <OrderTypeSettings></OrderTypeSettings>

      <template #actions>
         sdsfa
      </template>

   </PopupPageWrapper>

</template>

<style scoped></style>