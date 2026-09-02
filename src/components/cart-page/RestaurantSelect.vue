<script setup>
import { atRest, pickUpAtCounter } from '@/composables/useOrderType'
import { restaurantId, availableRestaurants } from '@/composables/useRestaurants'
import { ORDER_TYPE } from '@/constants/orderType'
</script>

<template>
   <div>
      <Label v-if="pickUpAtCounter"
             class="mb-1.5">
         Выберите точку самовывоза
      </Label>
      <Label v-else-if="atRest"
             class="mb-1.5">
         Выберите ресторан
      </Label>

      <NativeSelect v-model="restaurantId">
         <NativeSelectOption v-for="rest in availableRestaurants"
                             :key="rest.id"
                             :value="rest.id">
            {{ rest.address.addressAsString }}
         </NativeSelectOption>
      </NativeSelect>
   </div>
</template>