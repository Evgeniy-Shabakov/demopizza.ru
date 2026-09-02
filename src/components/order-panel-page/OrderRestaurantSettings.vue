<script setup>
import { PaperBag, HandPlatter, Soup, LaptopMinimalCheck } from '@lucide/vue'
import { ORDER_TYPE } from '@/constants/orderType'
import { orderTypeId, atRestToTable, atRestAtCounter, atRest } from '@/composables/useOrderType'
import { currentRestaurant } from '@/composables/useRestaurants'
import { tableNumber, packTakeaway } from '@/composables/useOrderRestaurantSettings'
</script>

<template>
   <div v-if="atRest"
        class="flex justify-between">
      <ButtonSelect :variant="atRestToTable ? '' : 'secondary'"
                    :disabled="!currentRestaurant?.atRestaurantToTableAvailable"
                    @click="orderTypeId = ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID">
         <HandPlatter />
         <div class="flex flex-col gap-0">
            Принести к столику
            <span class="text-xs"
                  v-if="!currentRestaurant?.atRestaurantToTableAvailable">
               (не доступно)
            </span>
         </div>

      </ButtonSelect>
      <ButtonSelect :variant="atRestAtCounter ? '' : 'secondary'"
                    :disabled="!currentRestaurant?.atRestaurantAtCounterAvailable"
                    @click="orderTypeId = ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID">
         <LaptopMinimalCheck />
         <div class="flex flex-col gap-0">
            Заберу у бара
            <span class="text-xs"
                  v-if="!currentRestaurant?.atRestaurantAtCounterAvailable">
               (не доступно)
            </span>
         </div>
      </ButtonSelect>
   </div>

   <div v-if="atRestToTable"
        class="flex flex-col items-center">

      <Label class="mb-2">Введите номер столика</Label>
      <Input type="number"
             class="text-center w-24 h-12"
             style="font-size: 1.5rem;"
             v-model="tableNumber" />
   </div>

   <div class="flex justify-between"
        v-if="atRest">
      <ButtonSelect :variant="packTakeaway === false ? '' : 'secondary'"
                    @click="packTakeaway = false">
         <Soup />
         Подать на месте
      </ButtonSelect>
      <ButtonSelect :variant="packTakeaway === true ? '' : 'secondary'"
                    @click="packTakeaway = true">
         <PaperBag />
         Упаковать с собой
      </ButtonSelect>
   </div>
</template>