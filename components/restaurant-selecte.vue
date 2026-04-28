<script setup>
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { restaurants } from '~/js/axios-helper.js'
import { selectedCity, selectedOrderType, selectedRestaurant } from '~/js/client-helper.js'

const restaurantsForSelecte = computed(() => {
   if (!restaurants.value) return []
   if (!selectedCity.value) return []

   let listForSelecte = restaurants.value.filter(rest => rest.city.id === selectedCity.value.id)

   if (selectedOrderType.value.ID == ORDER_TYPE.PICK_UP_AT_COUNTER.ID) {
      listForSelecte = listForSelecte.filter(rest => rest.pickUpAtCounterAvailable)
   }

   if (selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
      selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID) {
      listForSelecte = listForSelecte
         .filter(rest => rest.atRestaurantAtCounterAvailable || rest.atRestaurantToTableAvailable)
   }

   //при обновлении страницы selectedRestaurant.value не успевает инициализироваться
   // в client-initialize.js и selectedRestaurant.value сбрасывается
   const idsArray = listForSelecte.map(rest => rest.id)

   if (!selectedRestaurant.value || !idsArray.includes(selectedRestaurant.value.id)) {
      selectedRestaurant.value = listForSelecte[0]
   }

   return listForSelecte
})

</script>

<template>

   <select v-if="selectedCity"
           class="base-selecte"
           v-model="selectedRestaurant">
      <option v-for="restaurant in restaurantsForSelecte"
              :value="restaurant">

         {{ restaurant.street }} - {{ restaurant.house }}

      </option>
   </select>

</template>
