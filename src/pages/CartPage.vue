<script setup>
import { productsInCart } from '@/composables/useCart'
import { deliveryToAddress } from '@/composables/useOrderType'
</script>

<template>
   <CitySelect />
   <OrderTypeSelect class="mt-4" />

   <div class="mt-4">
      <DeliveryAddressSelect v-if="deliveryToAddress" />

      <RestaurantSelect v-else />
   </div>


   <div class="mt-4">

      <div v-if="productsInCart.length"
           class="space-y-3">
         <CartItem v-for="item in productsInCart"
                   :key="item.productId"
                   :product="item" />

         <CartDeliveryItem v-if="deliveryToAddress">
            Доставка
         </CartDeliveryItem>
      </div>

      <div v-else
           class="text-center mt-32">
         Корзина пока пуста(((
      </div>

   </div>

   <CartBottomBar />
</template>
