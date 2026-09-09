<script setup>
import { ORDER_STATUS_NAME_BY_ID } from '@/constants/orderStatus'
import { ORDER_TYPE, ORDER_TYPE_NAME_BY_ID } from '@/constants/orderType'
import { PAYMENT_STATUS, PAYMENT_STATUS_NAME_BY_ID } from '@/constants/paymentStatus'

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

const products = computed(() => props.order.orderProducts ?? [])

const orderAddress = computed(() => {
   if (props.order.orderTypeId == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID) {
      return props.order.addressJson?.addressAsString
   }
   return props.order.restaurant?.address?.addressAsString
})
</script>

<template>
   <Card class="gap-2 p-4 text-sm">
      <div class="flex items-center justify-between gap-2">
         <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-primary">
               {{ order.number }}
            </span>
            <span class="text-muted-foreground">
               {{ ORDER_TYPE_NAME_BY_ID[order.orderTypeId] }}
            </span>
         </div>
         <span class="font-semibold">
            {{ ORDER_STATUS_NAME_BY_ID[order.orderStatusId] }}
         </span>
      </div>

      <div class="flex items-center justify-between gap-2 text-muted-foreground">
         <span class="min-w-0 truncate">
            {{ orderAddress }}
         </span>
      </div>

      <div class="flex flex-col gap-1">
         <div v-for="orderProduct in products"
              :key="orderProduct.product.id"
              class="flex items-center gap-2">
            <img :src="orderProduct.product.imagePath"
                 :alt="orderProduct.product.name"
                 class="size-8 shrink-0 aspect-square rounded-xl object-cover" />

            <div class="min-w-0 truncate">
               {{ orderProduct.product.name }}
            </div>

            <div class="ml-auto text-muted-foreground">
               {{ orderProduct.quantity }} шт.
            </div>
         </div>
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
               Оплатить
            </a>
         </div>

         <span class="font-semibold">
            {{ order.totalPrice }} ₽
         </span>
      </div>
   </Card>
</template>