<script setup>
import { totalProductPrice, deliveryPrice, totalPrice, selectedOrderType } from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
</script>

<template>

   <div class="grid grid-cols-[max-content_max-content] gap-x-2 text-sm">

      <template v-if="selectedOrderType.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID">

         <span>Товары: </span>
         <span class="text-right">{{ totalProductPrice }}р.</span>

         <span>Доставка: </span>
         <span class="text-right">{{ deliveryPrice }}р.</span>

      </template>

      <span>Итого: </span>
      <span class="text-right">{{ totalPrice }}р.</span>

   </div>

</template>