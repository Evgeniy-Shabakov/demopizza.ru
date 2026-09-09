<script setup>
import { activeOrders, isLoadingActiveOrders, activeOrdersError, loadActiveOrders } from '@/composables/useActiveOrders'

onMounted(loadActiveOrders)
</script>

<template>
   <section>
      <h2 class="mb-3 text-center text-muted-foreground">
         Активные заказы
      </h2>

      <div v-if="isLoadingActiveOrders && !activeOrders.length"
           class="py-10">
         <SpinnerCenter />
      </div>

      <div v-else-if="activeOrdersError"
           class="py-6 text-center text-sm text-destructive">
         {{ activeOrdersError }}
      </div>

      <div v-else-if="activeOrders.length"
           class="flex flex-col gap-3">
         <OrderCardMini v-for="order in activeOrders"
                    :key="order.id"
                    :order="order" />
      </div>

      <div v-else
           class="text-center text-sm text-muted-foreground">
         Нет активных заказов
      </div>
   </section>
</template>