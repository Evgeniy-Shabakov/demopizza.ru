<script setup>
import { lastOrder, isLoadingLastOrder, lastOrderError, loadLastOrder }
   from '@/composables/useLastOrder'

if(!lastOrder.value) loadLastOrder()

</script>

<template>
   <section v-if="isLoadingLastOrder || lastOrderError || lastOrder">
      <h2 class="mb-3 text-center text-muted-foreground">
         Последний заказ
      </h2>

      <SpinnerCenter v-if="isLoadingLastOrder" />

      <div v-else-if="lastOrderError"
           class="text-center text-sm text-destructive">
         {{ lastOrderError }}
      </div>

      <OrderCard v-else-if="lastOrder"
                 :order="lastOrder" />
   </section>
</template>