<script setup>
import { activeOrders, isLoadingActiveOrders, activeOrdersError, loadActiveOrders }
   from '@/composables/orders/use-active-orders'

let refreshTimer = null

onMounted(() => {
   loadActiveOrders()
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

      <div v-if="isLoadingActiveOrders && !activeOrders.length"
           class="flex min-h-8 items-center justify-center">
         <Spinner class="size-7 text-primary" />
      </div>

      <div v-else-if="activeOrdersError"
           class="min-h-8 text-center text-sm text-destructive">
         {{ activeOrdersError }}
      </div>

      <div v-else-if="activeOrders.length"
           class="flex flex-col gap-3">
         <OrderCard v-for="order in activeOrders"
                    :key="order.id"
                    :order="order" />
      </div>

      <div v-else
           class=" min-h-8  text-center text-sm text-muted-foreground">
         Нет активных заказов
      </div>
   </section>
</template>