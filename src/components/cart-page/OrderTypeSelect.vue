<script setup>
import { atRest, deliveryToAddress, orderTypeId, pickUpAtCounter }
   from '@/composables/useOrderType'
import {
   restaurantsForAtRestaurant,
   restaurantsForDeliveryToAddress,
   restaurantsForPickUpAtCounter
}
   from '@/composables/useRestaurants'
import { ORDER_TYPE } from '@/constants/orderType'
</script>

<template>

   <div class="flex justify-between gap-2">

      <ButtonSelect v-if="restaurantsForDeliveryToAddress.length"
                    :variant="deliveryToAddress ? '' : 'secondary'"
                    @click="orderTypeId = ORDER_TYPE.DELIVERY_TO_ADDRESS.ID">
         Доставка
      </ButtonSelect>

      <ButtonSelect v-if="restaurantsForPickUpAtCounter.length"
                    :variant="pickUpAtCounter ? '' : 'secondary'"
                    @click="orderTypeId = ORDER_TYPE.PICK_UP_AT_COUNTER.ID">
         Самовывоз
      </ButtonSelect>

      <ButtonSelect v-if="restaurantsForAtRestaurant.length"
                    :variant="atRest ? '' : 'secondary'"
                    @click="orderTypeId = ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID">
         В ресторане
      </ButtonSelect>

   </div>

</template>