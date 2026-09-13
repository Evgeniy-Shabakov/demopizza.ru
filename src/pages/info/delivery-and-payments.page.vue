<script setup>
import { currentCity } from '@/composables/useCities'

</script>

<template>
   <PageHeader>
      <div>
         Доставка и оплата
      </div>
      <div class="text-sm font-semibold">
         ({{ currentCity?.name }})
      </div>
   </PageHeader>

   <div>
      Доставка осуществляется в пределах <BaseLink to="/map">зон доставки (карта)</BaseLink>
   </div>

   <div class="grid grid-cols-4 gap-2 text-xs mt-4">
      <div>Зона доставки:</div>
      <div>Мин. сумма доставки:</div>
      <div>Цена доставки:</div>
      <div>Бесплатная доставка от:</div>

      <template v-for="deliveryZone in currentCity?.deliveryZones">
         <div class="text-xs sm:text-sm wrap-break-words">{{ deliveryZone.name }}</div>
         <div class="text-xs sm:text-sm">{{ deliveryZone.minOrderValueForDelivery }}</div>
         <div class="text-xs sm:text-sm">{{ deliveryZone.deliveryPrice }}</div>
         <div class="text-xs sm:text-sm">{{ deliveryZone.orderValueForFreeDelivery }}</div>
      </template>

      <div v-if="currentCity?.deliveryZones.length == 0"
           class="text-sm text-red-500">не добавлены зоны доставки</div>
   </div>

   <BottomBar />
</template>
