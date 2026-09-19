<script setup>
import {
   activeOrders, isLoadingActiveOrders, activeOrdersError,
   isActiveOrdersFirstLoaded, isOrderCreatedForActiveOrders, loadActiveOrders
}
   from '@/composables/orders/use-active-orders'

let refreshTimer = null

onMounted(() => {
   if (!isActiveOrdersFirstLoaded.value || isOrderCreatedForActiveOrders.value
      || activeOrders.value.length > 0) {
      isActiveOrdersFirstLoaded.value = true
      isOrderCreatedForActiveOrders.value = false
      loadActiveOrders()
   }
   refreshTimer = setInterval(loadActiveOrders, 30000)
})

onBeforeUnmount(() => {
   clearInterval(refreshTimer)
})
</script>

<template>
   <section>
      <h2 class="mb-3 text-center text-muted-foreground">
         Активные заказы
      </h2>

      <template v-if="isLoadingActiveOrders && !activeOrders.length">
         <SpinnerCenter />
         <div class="text-center text-sm text-muted-foreground">
            Загружаем активные заказы...
         </div>
      </template>

      <div v-else-if="activeOrdersError"
           class="text-center text-sm text-destructive">
         {{ activeOrdersError }}
      </div>

      <div v-else-if="activeOrders.length"
           class="flex flex-col gap-3">
         <OrderCard v-for="order in activeOrders"
                    :key="order.id"
                    :order="order" />
      </div>

      <div v-else
           class="text-center text-sm text-muted-foreground">
         Нет активных заказов
      </div>

   </section>
</template>