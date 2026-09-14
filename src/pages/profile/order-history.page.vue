<script setup>
import { ordersHistory, isLoadingOrdersHistory, ordersHistoryError, loadOrdersHistory } from '@/composables/orders/use-orders-history'
import { repeatOrder } from '@/composables/use-cart'
import { ShoppingCartPlus } from '@lucide/vue'

const router = useRouter()

loadOrdersHistory()

function repeatOrderFromHistory(order) {
   repeatOrder(order)
   router.push('/cart')
}
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
        class="flex flex-col gap-8">
      <div v-for="order in ordersHistory"
           :key="order.id">
         <div class="text-sm text-muted-foreground text-center mb-1">
            {{ new Intl.DateTimeFormat('ru-RU', {
               day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            }).format(new Date(order.createdAt)) }}
         </div>
         <OrderCard :order="order" />

         <ButtonLgWfull class="mt-2"
                        @click="repeatOrderFromHistory(order)">
            <ShoppingCartPlus class="size-5" />
            Повторить заказ
         </ButtonLgWfull>
      </div>
   </div>

   <BottomBar />
</template>
