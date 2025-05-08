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
              class="btn-order-type"
              :class="{ 'btn-order-type--active': selectedOrderType == ORDER_TYPE.delivery }"
              @click="selectedOrderType = ORDER_TYPE.delivery">
         Доставка
      </button>

      <button v-if="pickUpAvailableInSelectedCity"
              class="btn-order-type"
              :class="{ 'btn-order-type--active': selectedOrderType == ORDER_TYPE.pickUp }"
              @click="selectedOrderType = ORDER_TYPE.pickUp">
         Самовывоз
      </button>

      <button v-if="restaurantAvailableInSelectedCity"
              class="btn-order-type"
              :class="{ 'btn-order-type--active': selectedOrderType == ORDER_TYPE.inRestaurant }"
              @click="selectedOrderType = ORDER_TYPE.inRestaurant">
         В ресторане
      </button>

   </div>

</template>

<style scoped>
.btn-order-type {
   border: 1px solid var(--border-color-order-settings);
   border-radius: var(--border-radius-main);
   background-color: var(--background-page-main-color);
   padding: 2px 6px;
   text-wrap: nowrap;
   cursor: pointer;
}

.btn-order-type--active {
   background-color: var(--brand-color);
   color: var(--text-color-on-brand-color);
}
</style>