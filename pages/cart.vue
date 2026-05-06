<script setup>
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, selectedOrderType, selectedAddressForDelivery
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { addressesInSelectedCity } from '~/js/address-index.js'
import { currentDeliveryZone } from '~/js/delivery-zone-helper'

</script>

<template>

   <PopupPageWrapper>

      <template v-if="selectedCity">

         <CitySelecte />

         <OrderTypeSettings></OrderTypeSettings>

         <template v-if="selectedOrderType.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID">

            <div v-if="addressesInSelectedCity.length > 0"
                 class="min-h-[62px]">
               <BaseLabel class="mb-2">Выбирите адрес или добавьте новый</BaseLabel>
               <div class="flex items-center gap-3.5">

                  <select v-model="selectedAddressForDelivery"
                          class="base-selecte">
                     <option v-for="address in addressesInSelectedCity"
                             :value="address">
                        {{ address.addressAsString }}
                     </option>
                  </select>

                  <NuxtLink to="/user/adresses/create">
                     <BaseButton :isIcon="true">
                        <IconPlus class="h-6 w-6" />
                     </BaseButton>
                  </NuxtLink>

               </div>
               <BaseInvalidateText v-if="!currentDeliveryZone"
                                   class="ml-1 absolute">
                  не входит в зону доставки
               </BaseInvalidateText>
            </div>

            <div v-else
                 class="min-h-[62px] flex items-center justify-center">
               <NuxtLink to="/user/adresses/create">
                  <BaseButton>
                     Добавить адрес доставки
                  </BaseButton>
               </NuxtLink>
            </div>

         </template>

         <div v-else
              class="min-h-[62px]">

            <BaseLabel v-if="selectedOrderType.ID == ORDER_TYPE.PICK_UP_AT_COUNTER.ID"
                       class="mb-2">
               Выберите точку самовывоза
            </BaseLabel>
            <BaseLabel v-else-if="selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
               selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID"
                       class="mb-2">
               Выберите ресторан
            </BaseLabel>
            <RestaurantSelecte />

         </div>

         <div v-if="productsInCart.length > 0"
              class="mt-2 flex flex-col gap-4">
            <CartItem v-for="product in productsInCart"
                      :key="product.userConfigID || product.id"
                      :productOrUserConfig="product" />

            <div v-if="selectedOrderType.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID"
                 class="grid grid-cols-[100px_1fr_1fr] 
                     text-sm minxs:text-base
                     gap-1 minxs:gap-3 xs:gap-4 items-center
                     mt-5">
               <IconTrack class="justify-self-center text-(--brand-color-active)" />
               <div>
                  <div>Доставка</div>
                  <div class="text-xs">
                     {{ currentDeliveryZone?.name }}
                  </div>
               </div>
               <div class=" justify-self-end">{{ deliveryPrice }}р</div>
            </div>
         </div>

         <div v-else
              class="flex-1 flex items-center justify-center">
            Корзина пока пуста (((
         </div>

      </template>

      <template #actions
                v-if="selectedCity">

         <div class="flex items-center justify-between gap-2 w-full">

            <TotalBlock />

            <div v-if="selectedOrderType.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID"
                 class="text-xs text-center">
               <div v-if="totalProductPrice < currentDeliveryZone?.minOrderValueForDelivery">
                  Минимальная сумма товаров для заказа
                  {{ Number(currentDeliveryZone?.minOrderValueForDelivery) }}р.
               </div>
               <div v-else-if="totalProductPrice < currentDeliveryZone?.orderValueForFreeDelivery">
                  Бесплатная доставка от {{ Number(currentDeliveryZone?.orderValueForFreeDelivery)
                  }}р.
               </div>
               <div v-else-if="totalProductPrice >= currentDeliveryZone?.orderValueForFreeDelivery"
                    class="text-sm font-bold text-(--text-color-accent)">
                  Бесплатная доставка!!!
               </div>
            </div>

            <BaseButton :active="totalProductPrice > 0 &&
               (selectedOrderType.ID !== ORDER_TYPE.DELIVERY_TO_ADDRESS.ID ||
                  totalProductPrice > currentDeliveryZone?.minOrderValueForDelivery)"
                        class="w-1/4"
                        :click="() => navigateTo('/order-panel')">
               Далее
            </BaseButton>

         </div>

      </template>

   </PopupPageWrapper>

</template>