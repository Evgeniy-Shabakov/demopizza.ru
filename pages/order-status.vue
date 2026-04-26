<script setup>
import { BaseButton } from '#components';
import { currentOrder } from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { serverUrl } from '~/env.js'
console.log(currentOrder.value)

if (currentOrder.value == null) {
   navigateTo('/')
}
</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="currentOrder"
          class="text-xl text-center">
         <div class="font-semibold">{{ currentOrder.city.name }}</div>
         <div class="text-(--text-color-accent)">{{ currentOrder.orderTypeName }}</div>
      </h1>

      <template v-if="currentOrder">

         <div class="text-center text-xl">
            Ваш заказ оформлен! <br>
            Статус заказа можно отследить <br>
            в личном кабинете.
         </div>

         <div class="text-center mb-2">
            <div class="text-(--text-color-main)/60">номер заказа</div>
            <div class="text-6xl text-(--text-color-accent)">
               {{ currentOrder.number }}
            </div>
         </div>

         <div class="text-center">
            <div class="text-(--text-color-main)/60">статус заказа</div>
            <div class="text-3xl text-(--text-color-accent) px-8">
               {{ currentOrder.orderStatus }}
            </div>
         </div>

         <div>

            <div class="text-(--text-color-main)/60">данные заказа</div>

            <div>

               <div v-if="currentOrder.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID">
                  <span>Адрес: </span>
                  <span v-if="currentOrder.userAddress.name">
                     {{ currentOrder.userAddress.name }} -
                  </span>
                  {{ currentOrder.userAddress.street }}
                  {{ currentOrder.userAddress.house }}
                  <span v-if="currentOrder.userAddress.corps">
                     / {{ currentOrder.userAddress.corps }}
                  </span>
                  <span v-if="currentOrder.userAddress.flat">
                     - {{
                        currentOrder.userAddress.flat }}
                  </span>
               </div>

               <div v-else>

                  <span>
                     Ресторан: {{ currentOrder.restaurant.name }}
                     ({{ currentOrder.restaurant.addressAsString }})
                  </span>

                  <div v-if="currentOrder.orderTypeId == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
                     currentOrder.orderTypeId == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID">
                     Тип подачи:
                     <template v-if="currentOrder.tableNumber">
                        Принести к столику № {{ currentOrder.tableNumber }}
                     </template>
                     <template v-else>
                        Заберу сам
                     </template>
                  </div>

               </div>

               <div>
                  <span> Итого: </span>
                  <span>{{ Number(currentOrder.totalPrice) }}р.</span>
               </div>

               <div>
                  <span> Статус оплаты: </span>
                  <span> {{ currentOrder.paymentStatus }} </span>
               </div>

               <div v-if="currentOrder.comment">
                  <span>Ваш комментарий к заказу: </span>
                  <span>{{ currentOrder.comment }}</span>
               </div>

            </div>
         </div>

         <div class="grid grid-cols-[1fr_max-content_max-content] gap-2 gap-x-4 items-center p-1
                     text-sm border border-(--brand-color) rounded-(--border-radius-main)">

            <template v-for="orderProduct in currentOrder.orderProducts">

               <div>

                  <div class="flex items-center gap-1.5">
                     <img class="w-8"
                          :src="serverUrl + '/' + orderProduct.product.imagePath.replace(/^storage\/public\/?/, '')">
                     <span>{{ orderProduct.product.name }}</span>
                  </div>

                  <!-- <IngredientsMini v-if="product.user_config_id"
                                   :baseIngredients="product.user_config_base_ingredients"
                                   :additionalIngredients="product.user_config_additional_ingredients" /> -->

               </div>

               <div class="justify-self-center whitespace-nowrap">
                  {{ orderProduct.quantity }} x {{ Number(orderProduct.product.priceDefault) }}р
               </div>
               <div class="justify-self-end">
                  {{ Number(orderProduct.quantity) * Number(orderProduct.product.priceDefault) }}р
               </div>

            </template>

         </div>

      </template>

      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="() => navigateTo('/user')">
            OK
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>