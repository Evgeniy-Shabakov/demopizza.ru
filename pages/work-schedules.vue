<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { selectedRestaurant } from '~/js/client-helper'
</script>

<template>
   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">
         <div>График работы</div>
         <div class="text-xs">({{ selectedCity?.name }})</div>
      </h1>

      <div v-if="selectedRestaurant && selectedRestaurant.restaurantSchedule"
      class="mx-auto">
         <!-- Понедельник -->
         <div>
            <span>пн: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.mondayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.mondayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.mondayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Вторник -->
         <div>
            <span>вт: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.tuesdayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.tuesdayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.tuesdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Среда -->
         <div>
            <span>ср: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.wednesdayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.wednesdayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.wednesdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Четверг -->
         <div>
            <span>чт: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.thursdayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.thursdayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.thursdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Пятница -->
         <div>
            <span>пт: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.fridayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.fridayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.fridayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Суббота -->
         <div>
            <span>сб: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.saturdayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.saturdayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.saturdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Воскресенье -->
         <div>
            <span>вс: </span>
            <span v-if="selectedRestaurant.restaurantSchedule.sundayIsOpen">
               {{ selectedRestaurant.restaurantSchedule.sundayOpenTime }} -
               {{ selectedRestaurant.restaurantSchedule.sundayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>
      </div>

      <template #actions>

         <BaseButton class="w-full"
                     :click="() => $router.back()">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>
</template>