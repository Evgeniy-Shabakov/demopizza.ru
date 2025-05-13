<script setup>
import {
   deliveryAvailableInSelectedCity, pickUpAvailableInSelectedCity, restaurantAvailableInSelectedCity,
   selectedOrderType
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'

</script>

<template>

   <div class="flex justify-between gap-2">

      <button v-if="deliveryAvailableInSelectedCity"
              class="btn-selecte"
              :class="{ 'btn-selecte--active': selectedOrderType == ORDER_TYPE.delivery }"
              @click="selectedOrderType = ORDER_TYPE.delivery">
         Доставка
      </button>

      <button v-if="pickUpAvailableInSelectedCity"
              class="btn-selecte"
              :class="{ 'btn-selecte--active': selectedOrderType == ORDER_TYPE.pickUp }"
              @click="selectedOrderType = ORDER_TYPE.pickUp">
         Самовывоз
      </button>

      <button v-if="restaurantAvailableInSelectedCity"
              class="btn-selecte"
              :class="{ 'btn-selecte--active': selectedOrderType == ORDER_TYPE.inRestaurant }"
              @click="selectedOrderType = ORDER_TYPE.inRestaurant">
         В ресторане
      </button>

   </div>

</template>