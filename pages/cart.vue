<script setup>
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, selectedOrderType, selectedAddressForDelivery
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { addressesInSelectedCity } from '~/js/address-index.js'




</script>

<template>

   <PopupPageWrapper>

      <template v-if="selectedCity">

         <CitySelecte />

         <OrderTypeSettings></OrderTypeSettings>

         <template v-if="selectedOrderType == ORDER_TYPE.delivery">

            <div v-if="addressesInSelectedCity.length > 0">
               <BaseLabel class="mb-2">Выбирите адрес или добавьте новый</BaseLabel>
               <div class="flex items-center gap-3.5">

                  <select v-model="selectedAddressForDelivery"
                          class="base-selecte">
                     <option v-for="address in addressesInSelectedCity"
                             :value="address">

                        <span v-if="address.title">{{ address.title }} -</span>
                        {{ address.street }}
                        {{ address.house_number }}
                        <span v-if="address.corps_number">/ {{ address.corps_number }}</span>
                        <span v-if="address.apartment_number"> - {{ address.apartment_number }}</span>

                     </option>
                  </select>

                  <NuxtLink to="/user/adresses/create">
                     <BaseButton :isIcon="true">
                        <IconPlus class="h-6 w-6" />
                     </BaseButton>
                  </NuxtLink>

               </div>
               
            </div>

            <div v-else
                 class="h-[62px] flex items-center justify-center">
               <NuxtLink to="/user/adresses/create">
                  <BaseButton>
                     Добавить адрес доставки
                  </BaseButton>
               </NuxtLink>
            </div>

         </template>

         <div v-else class="h-[62px]">

            <BaseLabel v-if="selectedOrderType == ORDER_TYPE.pickUp"
                       class="mb-2">
               Выберите точку самовывоза
            </BaseLabel>
            <BaseLabel v-else-if="selectedOrderType == ORDER_TYPE.inRestaurant"
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

         <div v-else
              class="flex-1 flex items-center justify-center">
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
                  Минимальная сумма товаров для заказа {{ Number(selectedCity.min_order_value_for_delivery_by_default)
                  }}р.
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