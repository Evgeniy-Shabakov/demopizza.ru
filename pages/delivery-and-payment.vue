<script setup>
import { selectedCity } from '~/js/client-helper.js'
</script>

<template>
   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">Доставка и оплата</h1>

      <div>
         Доставка осуществляется в пределах <BaseLink to="/map">зон доставки</BaseLink>
      </div>

      <div class="grid grid-cols-4 gap-2 text-xs">
         <div>Зона доставки:</div>
         <div>Мин. сумма доставки:</div>
         <div>Цена доставки:</div>
         <div>Бесплатная доставка от:</div>

         <template v-for="feature in selectedCity?.geojson?.features">
            <template v-if="feature.geometry.type == 'Polygon'">
               <div class="text-sm">{{ feature.properties.description }}</div>
               <div class="text-sm">{{ Number(feature.deliveryPrices.min_order_value_for_delivery) }}</div>
               <div class="text-sm">{{ Number(feature.deliveryPrices.delivery_price) }}</div>
               <div class="text-sm">{{ Number(feature.deliveryPrices.order_value_for_free_delivery) }}</div>
            </template>
         </template>

         <div v-if="!selectedCity?.geojson"
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

<style scoped></style>