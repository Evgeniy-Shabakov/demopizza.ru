<script setup>
import { selectedCity } from '~/js/client-helper.js'
</script>

<template>
   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">
         <div>Доставка и оплата</div>
         <div class="text-xs">({{ selectedCity?.name }})</div>
      </h1>

      <div>
         Доставка осуществляется в пределах <BaseLink to="/map">зон доставки (карта)</BaseLink>
      </div>

      <div class="grid grid-cols-4 gap-2 text-xs">
         <div>Зона доставки:</div>
         <div>Мин. сумма доставки:</div>
         <div>Цена доставки:</div>
         <div>Бесплатная доставка от:</div>

         <template v-for="deliveryZone in selectedCity?.deliveryZones">
            <div class="text-sm">{{ deliveryZone.name }}</div>
            <div class="text-sm">{{ deliveryZone.minOrderValueForDelivery }}</div>
            <div class="text-sm">{{ deliveryZone.deliveryPrice }}</div>
            <div class="text-sm">{{ deliveryZone.orderValueForFreeDelivery }}</div>
         </template>

         <div v-if="selectedCity?.deliveryZones.length == 0"
              class="text-sm text-red-500">не добавлены зоны доставки</div>
      </div>

      <template #actions>

         <BaseButton class="w-full"
                     :click="() => $router.back()">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>
</template>