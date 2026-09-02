<script setup>
import { Truck } from '@lucide/vue'
import { currentDeliveryZone } from '@/composables/useDeliveryZones'
import { deliveryPrice } from '@/composables/usePrices';
</script>

<template>
   <Card class="flex-row gap-3.5 p-2 sm:p-3 lg:p-4">

      <div class="w-1/5 xs:w-30 flex justify-center items-center">
         <Truck class="size-8 text-primary" />
      </div>
      <div class="flex gap-2 flex-1 min-w-0 justify-between items-center">
         <div class=" space-y-1">
            <CardTitle>Доставка</CardTitle>
            <CardDescription v-if="currentDeliveryZone">
               {{ currentDeliveryZone.name }}
            </CardDescription>
            <CardDescription v-else class="text-xs">
               Стоимость зависит от суммы и зоны доставки
            </CardDescription>
         </div>
         <div class="whitespace-nowrap">
            {{ deliveryPrice }} ₽
         </div>
      </div>
   </Card>
</template>
