<script setup>
import { BaseButton } from '#components';
import { currentOrder } from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'

if (currentOrder.value == null) {
   navigateTo('/')
}
</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="currentOrder"
          class="text-xl text-center">
         <div class="font-bold">{{ currentOrder.city.title }}</div>
         <div class="text-(--text-color-accent)">({{ currentOrder.order_type }})</div>
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
               {{ currentOrder.order_status }}
            </div>
         </div>

         <div>

            <div class="text-(--text-color-main)/60">данные заказа</div>

            <div>

               <div v-if="currentOrder.order_type == ORDER_TYPE.delivery">
                  <span>Адрес: </span>
                  <span v-if="currentOrder.user_address.title">
                     {{ currentOrder.user_address.title }} -
                  </span>
                  {{ currentOrder.user_address.street }}
                  {{ currentOrder.user_address.house_number }}
                  <span v-if="currentOrder.user_address.corps_number">
                     / {{ currentOrder.user_address.corps_number }}
                  </span>
                  <span v-if="currentOrder.user_address.apartment_number">
                     - {{
                        currentOrder.user_address.apartment_number }}
                  </span>
               </div>

               <div v-else>

                  <span>
                     Ресторан: {{ currentOrder.restaurant.title }}
                     ({{ currentOrder.restaurant.street }}
                     -
                     {{ currentOrder.restaurant.house_number }})
                     <!-- добавить корпус при условии -->
                  </span>

                  <div v-if="currentOrder.order_type == ORDER_TYPE.inRestaurant">
                     Тип подачи:
                     <template v-if="currentOrder.table_number">
                        Принести к столику № {{ currentOrder.table_number }}
                     </template>
                     <template v-else>
                        Заберу сам
                     </template>
                  </div>

               </div>

               <div>
                  <span> Стоимость: </span>
                  <span>{{ currentOrder.total_price }}р.</span>
               </div>

               <div>
                  <span v-if="currentOrder.is_payment"> Заказа оплачен. </span>
                  <span v-else> Заказ не оплачен. </span>
               </div>

               <div v-if="currentOrder.comment">
                  <span>Ваш комментарий к заказу: </span>
                  <span>{{ currentOrder.comment }}</span>
               </div>

            </div>
         </div>

         <div class="grid grid-cols-[1fr_max-content_max-content] gap-2 gap-x-4 items-center p-1
                     text-sm border border-(--brand-color) rounded-(--border-radius-main) mb-2">

            <template v-for="product in currentOrder.products">

               <div>

                  <div class="flex items-center gap-1.5">
                     <img class="w-8"
                          :src="product.image_url">
                     <span>{{ product.title }}</span>
                  </div>

                  <IngredientsMini v-if="product.user_config_id"
                                   :baseIngredients="product.user_config_base_ingredients"
                                   :additionalIngredients="product.user_config_additional_ingredients" />

               </div>

               <div class="justify-self-center whitespace-nowrap">
                  {{ product.quantity }} x {{ Number(product.price) }}р
               </div>
               <div class="justify-self-end">
                  {{ Number(product.quantity) * Number(product.price) }}р
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