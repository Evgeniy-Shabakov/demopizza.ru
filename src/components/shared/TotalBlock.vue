<script setup>
import { deliveryToAddress } from '@/composables/useOrderType'
import { deliveryPrice, totalPrice, totalProductPrice } from '@/composables/usePrices'
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