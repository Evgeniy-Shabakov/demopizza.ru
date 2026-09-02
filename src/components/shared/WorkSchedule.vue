<script setup>
import { currentRestaurant } from '@/composables/useRestaurants'
</script>

<template>
   <Card v-if="currentRestaurant && currentRestaurant.restaurantSchedule"
         class="p-2 text-center gap-2">
      <CardTitle class="text-sm">График работы</CardTitle>
      <CardDescription>
         <!-- Понедельник -->
         <div>
            <span>пн: </span>
            <span v-if="currentRestaurant.restaurantSchedule.mondayIsOpen">
               {{ currentRestaurant.restaurantSchedule.mondayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.mondayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Вторник -->
         <div>
            <span>вт: </span>
            <span v-if="currentRestaurant.restaurantSchedule.tuesdayIsOpen">
               {{ currentRestaurant.restaurantSchedule.tuesdayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.tuesdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Среда -->
         <div>
            <span>ср: </span>
            <span v-if="currentRestaurant.restaurantSchedule.wednesdayIsOpen">
               {{ currentRestaurant.restaurantSchedule.wednesdayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.wednesdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Четверг -->
         <div>
            <span>чт: </span>
            <span v-if="currentRestaurant.restaurantSchedule.thursdayIsOpen">
               {{ currentRestaurant.restaurantSchedule.thursdayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.thursdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Пятница -->
         <div>
            <span>пт: </span>
            <span v-if="currentRestaurant.restaurantSchedule.fridayIsOpen">
               {{ currentRestaurant.restaurantSchedule.fridayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.fridayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Суббота -->
         <div>
            <span>сб: </span>
            <span v-if="currentRestaurant.restaurantSchedule.saturdayIsOpen">
               {{ currentRestaurant.restaurantSchedule.saturdayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.saturdayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>

         <!-- Воскресенье -->
         <div>
            <span>вс: </span>
            <span v-if="currentRestaurant.restaurantSchedule.sundayIsOpen">
               {{ currentRestaurant.restaurantSchedule.sundayOpenTime }} -
               {{ currentRestaurant.restaurantSchedule.sundayCloseTime }}
            </span>
            <span v-else>выходной</span>
         </div>
      </CardDescription>
   </Card>
</template>
