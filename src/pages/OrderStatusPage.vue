<script setup>
import { currentOrder } from '@/composables/useOrder'
import { orderTypeShortName } from '@/composables/useOrderType'
import { ORDER_STATUS_NAME_BY_ID } from '@/constants/orderStatus'
import { ORDER_TYPE } from '@/constants/orderType'
import { PAYMENT_STATUS, PAYMENT_STATUS_NAME_BY_ID } from '@/constants/paymentStatus'

const address = computed(() => {
   if (currentOrder.value.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID) {
      return currentOrder.value.addressJson.addressAsString
   }
   else {
      return currentOrder.value.restaurant.address.addressAsString
   }
})

const paymentStatusClass = computed(() => {
   const status = currentOrder.value?.paymentStatusId
   if (status === PAYMENT_STATUS.PAID.ID) return 'text-primary font-semibold'
   if (status === PAYMENT_STATUS.NO_PAID.ID) return 'text-destructive font-semibold'
   return 'text-chart-4 font-semibold'
})

const serverUrl = import.meta.env.VITE_SERVER_BASE_URL
</script>

<template>
   <PageHeader>
      <div v-if="currentOrder">
         Ваш заказ оформлен! <br>
         Статус заказа можно отследить <br>
         в личном кабинете.
      </div>
      <div v-else>Статус заказа может отследить только зарегестрированный пользователь</div>
   </PageHeader>

   <div v-if="currentOrder"
        class="flex flex-col items-center gap-5">

      <div class="text-primary text-center">
         <div>{{ currentOrder.city.name }} - {{ orderTypeShortName }}</div>
         <div>{{ address }}</div>
         <div v-if="currentOrder.orderTypeId == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
            currentOrder.orderTypeId == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID"
              class="flex justify-center gap-1">

            <div v-if="currentOrder.tableNumber">
               Столик №{{ currentOrder.tableNumber }}
            </div>
            <div v-if="currentOrder.orderTypeId == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID">
               Заберу у бара
            </div>

            <div v-if="currentOrder.packTakeaway">
               (упаковать с собой)
            </div>
            <div v-else>
               (подать на месте)
            </div>
         </div>
      </div>

      <div>
         <Label class="text-center block">номер заказа</Label>
         <div class="text-4xl text-primary">
            {{ currentOrder.number }}
         </div>
      </div>

      <div>
         <Label class="text-center block">статус заказа</Label>
         <div class="text-2xl text-primary text-center">
            {{ ORDER_STATUS_NAME_BY_ID[currentOrder.orderStatusId] }}
         </div>
      </div>

      <div>
         <Label class="text-center block mb-1">статус оплаты</Label>

         <span :class="paymentStatusClass">
            {{ PAYMENT_STATUS_NAME_BY_ID[currentOrder.paymentStatusId] }}
         </span>

         <a v-if="currentOrder.payment?.paymentUrl"
            :href="currentOrder.payment.paymentUrl"
            class="text-blue-600 hover:underline">
            Ссылка на оплату
         </a>
      </div>

      <div class="w-full">
         <Label class="text-center block mb-3">Товары в заказе</Label>

         <Card class="p-3 gap-2 text-sm">
            <div class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
               <template v-for="orderProduct in currentOrder.orderProducts">

                  <img :src="serverUrl + '/' + orderProduct.product.imagePath.replace(/^storage\/public\/?/, '')"
                       class="size-8 aspect-square rounded-xl object-cover" />

                  <div>
                     {{ orderProduct.product.name }}
                  </div>

                  <div class="text-muted-foreground ml-auto">
                     {{ orderProduct.quantity }} шт. × {{ orderProduct.product.priceDefault }}
                  </div>

                  <div class="ml-auto">
                     {{ Number(orderProduct.quantity) * Number(orderProduct.product.priceDefault) }} ₽
                  </div>

               </template>
            </div>
         </Card>

         <div class="ml-auto block w-max mx-3 mt-2">
            <div class="grid grid-cols-[max-content_max-content] gap-x-2 text-sm">

               <template v-if="currentOrder.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID">

                  <span>Товары: </span>
                  <span class="text-right">{{ currentOrder.totalProductsPrice }} ₽</span>

                  <span>Доставка: </span>
                  <span class="text-right">{{ currentOrder.deliveryPrice }} ₽</span>

               </template>

               <span>Итого: </span>
               <span class="text-right">{{ currentOrder.totalPrice }} ₽</span>

            </div>
         </div>

      </div>

      <div v-if="currentOrder.userComment"
           class="w-full">
         <Label class="text-center block">комментарий к заказу</Label>
         <Card class="mt-2 p-4">{{ currentOrder.userComment }}</Card>
      </div>

   </div>

   <BottomBar>
      <ButtonLgWfull @click="$router.push('/')">
         На главную
      </ButtonLgWfull>
   </BottomBar>
</template>