<script setup>
import { lastOrder, isLoadingLastOrder, lastOrderError, loadLastOrder, isLastOrderLoaded }
   from '@/composables/orders/use-last-order'

if (!isLastOrderLoaded.value) {
   loadLastOrder()
   isLastOrderLoaded.value = true
}

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

      <LastOrderCard v-else-if="lastOrder"
                     :order="lastOrder" />
   </section>
</template>