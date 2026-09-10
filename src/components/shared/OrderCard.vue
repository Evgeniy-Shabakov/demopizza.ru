<script setup>
import { ORDER_STATUS_NAME_BY_ID } from '@/constants/orderStatus'
import { ORDER_TYPE } from '@/constants/orderType'
import { PAYMENT_STATUS, PAYMENT_STATUS_NAME_BY_ID } from '@/constants/paymentStatus'

const ORDER_TYPE_SHORT_NAME_BY_ID = {
   [ORDER_TYPE.DELIVERY_TO_ADDRESS.ID]: 'доставка',
   [ORDER_TYPE.PICK_UP_AT_COUNTER.ID]: 'самовывоз',
   [ORDER_TYPE.PICK_UP_AT_CAR_WINDOW.ID]: 'самовывоз (авто)',
   [ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID]: 'в ресторане',
   [ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID]: 'в ресторане (столик)',
   [ORDER_TYPE.DELIVERY_TO_RESTAURANT_PARKING.ID]: 'доставка к машине',
}

const props = defineProps({
   order: { type: Object, required: true },
})

const paymentStatusClass = computed(() => {
   const status = props.order?.paymentStatusId
   if (status === PAYMENT_STATUS.PAID.ID) return 'text-primary font-semibold'
   if (status === PAYMENT_STATUS.NO_PAID.ID) return 'text-destructive font-semibold'
   if (status === PAYMENT_STATUS.FAILED.ID) return 'text-destructive font-semibold'
   return 'text-chart-4 font-semibold'
})

const isDelivery = computed(() => props.order.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID)

const orderAddress = computed(() => {
   if (props.order.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID) {
      return props.order.addressJson?.addressAsString
   }
   return props.order.restaurant?.address?.addressAsString
})
</script>

<template>
   <Card class="gap-2 p-3 text-sm">
      <div class="flex items-center justify-between gap-2">
         <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-primary">
               {{ order.number }}
            </span>
            <Badge variant="outline"
                   class="font-semibold">
               {{ ORDER_TYPE_SHORT_NAME_BY_ID[order.orderTypeId] }}
            </Badge>
         </div>
         <Badge class="font-semibold">
            {{ ORDER_STATUS_NAME_BY_ID[order.orderStatusId] }}
         </Badge>
      </div>

      <div class="flex items-center gap-1.5 text-muted-foreground min-w-0">
         <span class="truncate">
            {{ orderAddress }}
         </span>
         <template v-if="order.orderTypeId == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID && order.tableNumber">
            <span class="shrink-0">·</span>
            <span class="shrink-0">Столик №{{ order.tableNumber }}</span>
         </template>
      </div>

      <div class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-1">
         <template v-for="orderProduct in order.orderProducts"
                   :key="orderProduct.product.id">

            <img :src="orderProduct.product.imagePath"
                 :alt="orderProduct.product.name"
                 class="size-8 aspect-square rounded-xl object-cover" />

            <div class="min-w-0 truncate">
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

      <div class="flex items-center justify-between gap-2 mt-1">
         <div class="flex items-center gap-2">
            <Badge variant="outline"
                   :class="paymentStatusClass">
               {{ PAYMENT_STATUS_NAME_BY_ID[order.paymentStatusId] }}
            </Badge>
            <a v-if="order.payment?.paymentUrl"
               :href="order.payment.paymentUrl"
               class="text-blue-600 hover:underline">
               Ссылка на оплату
            </a>
         </div>

         <div class="grid grid-cols-[max-content_max-content] gap-x-2 ml-auto">
            <template v-if="isDelivery">
               <span>Товары: </span>
               <span class="text-right">{{ order.totalProductsPrice }} ₽</span>
            </template>

            <template v-if="isDelivery">
               <span>Доставка: </span>
               <span class="text-right">{{ order.deliveryPrice }} ₽</span>
            </template>

            <span>Итого: </span>
            <span class="text-right font-semibold">{{ order.totalPrice }} ₽</span>
         </div>
      </div>

      <Card v-if="order.userComment"
            class="p-2 ">
         {{ order.userComment }}
      </Card>

   </Card>
</template>