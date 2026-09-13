<script setup>
import { ordersHistory, isLoadingOrdersHistory, ordersHistoryError, loadOrdersHistory } from '@/composables/use-orders-history'

loadOrdersHistory()
</script>

<template>
   <PageHeader>История заказов</PageHeader>

   <SpinnerCenter v-if="isLoadingOrdersHistory" />

   <div v-else-if="ordersHistoryError"
        class="text-sm text-destructive text-center py-10">
      {{ ordersHistoryError }}
   </div>

   <div v-else-if="ordersHistory.length === 0"
        class="text-center py-10 text-muted-foreground text-sm">
      У вас пока нет заказов
   </div>

   <div v-else
        class="flex flex-col gap-3">
      <div v-for="order in ordersHistory"
           :key="order.id">
         <div class="text-sm text-muted-foreground text-center mb-1">
            {{ new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(order.createdAt)) }}
         </div>
         <OrderCard :order="order" />
      </div>
   </div>

   <BottomBar />
</template>
