<script setup>
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, selectedOrderType
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'

</script>

<template>

   <PopupPageWrapper >

      <template v-if="selectedCity">

         <CitySelecte />

         <OrderTypeSettings></OrderTypeSettings>

         <div v-if="productsInCart.length > 0"
              class="mt-2 flex flex-col gap-4">
            <CartItem v-for="product in productsInCart"
                      :key="product.userConfigID || product.id"
                      :productOrUserConfig="product" />

            <div v-if="selectedOrderType == ORDER_TYPE.delivery"
                 class="grid grid-cols-[100px_1fr_1fr] 
                     text-sm minxs:text-base
                     gap-1 minxs:gap-3 xs:gap-4 items-center
                     mt-5">
               <IconTrack class="justify-self-center text-(--brand-color-active)" />
               <div>Доставка</div>
               <div class=" justify-self-end">{{ deliveryPrice }}р</div>
            </div>
         </div>

         <div v-else class="flex-1 flex items-center justify-center">
            Корзина пока пуста (((
         </div>

      </template>

      <template #actions
                v-if="selectedCity">

         <div class="flex items-center justify-between gap-2 w-full">

            <TotalBlock />

            <div v-if="selectedOrderType == ORDER_TYPE.delivery"
                 class="text-xs text-center">
               <div v-if="totalProductPrice < selectedCity.min_order_value_for_delivery_by_default">
                  Минимальная сумма товаров для заказа {{ Number(selectedCity.min_order_value_for_delivery_by_default) }}р.
               </div>
               <div v-else-if="totalProductPrice < selectedCity.order_value_for_free_delivery_by_default">
                  Бесплатная доставка от {{ Number(selectedCity.order_value_for_free_delivery_by_default) }}р.
               </div>
               <div v-else-if="totalProductPrice >= selectedCity.order_value_for_free_delivery_by_default"
                    class="text-sm font-bold text-(--text-color-accent)">
                  Бесплатная доставка!!!
               </div>
            </div>

            <BaseButton :active="totalProductPrice > 0 &&
               (selectedOrderType !== ORDER_TYPE.delivery ||
                  totalProductPrice > selectedCity.min_order_value_for_delivery_by_default)"
                        class="w-1/4"
                        :click="() => navigateTo('/order-panel')">
               Далее
            </BaseButton>

         </div>

      </template>

   </PopupPageWrapper>

</template>