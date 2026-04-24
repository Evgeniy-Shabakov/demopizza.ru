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
              :class="{ 'btn-selecte--active': selectedOrderType.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID }"
              @click="selectedOrderType = ORDER_TYPE.DELIVERY_TO_ADDRESS">
         Доставка
      </button>

      <button v-if="pickUpAvailableInSelectedCity"
              class="btn-selecte"
              :class="{ 'btn-selecte--active': selectedOrderType.ID == ORDER_TYPE.PICK_UP_AT_COUNTER.ID }"
              @click="selectedOrderType = ORDER_TYPE.PICK_UP_AT_COUNTER">
         Самовывоз
      </button>

      <button v-if="restaurantAvailableInSelectedCity"
              class="btn-selecte"
              :class="{
               'btn-selecte--active': selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
                  selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID
            }"
              @click="selectedOrderType = ORDER_TYPE.AT_RESTAURANT_AT_COUNTER">
         В ресторане
      </button>

   </div>

</template>