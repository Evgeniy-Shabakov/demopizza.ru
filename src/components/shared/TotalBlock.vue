<script setup>
import { deliveryToAddress } from '@/composables/use-order-type'
import { deliveryPrice, totalPrice, totalProductPrice } from '@/composables/use-prices'
</script>

<template>

   <div class="grid grid-cols-[max-content_max-content] gap-x-2 text-sm">

      <template v-if="deliveryToAddress">

         <span>Товары: </span>
         <span class="text-right">{{ totalProductPrice }} ₽</span>

         <span>Доставка: </span>
         <span class="text-right">{{ deliveryPrice }} ₽</span>

      </template>

      <span>Итого: </span>
      <span class="text-right">{{ totalPrice }} ₽</span>

   </div>

</template>