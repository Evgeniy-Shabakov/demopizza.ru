<script setup>
import { Plus, MapPinPlus } from '@lucide/vue'
import { userAddresses, currentUserAddress } from '@/composables/use-user-addresses'
import { currentCity } from '@/composables/use-cities'
import { currentDeliveryZone } from '@/composables/use-delivery-zones'

const userAddressesForSelectedCity = computed(() =>
   userAddresses.value.filter(a => a.cityId == currentCity.value?.id)
)
</script>

<template>
   <div>

      <div v-if="userAddressesForSelectedCity.length == 0"
           class="h-14 flex justify-center items-center">
         <ButtonLg as-child>
            <RouterLink to="/create-address">
               <MapPinPlus class="size-5" />
               Добавить адрес доставки
            </RouterLink>
         </ButtonLg>
      </div>

      <div v-else>

         <Label class="mb-1.5">Выбирите адрес или добавьте новый</Label>

         <div class="flex items-end justify-between gap-2">

            <NativeSelect v-model="currentUserAddress">
               <NativeSelectOption v-for="address in userAddressesForSelectedCity"
                                   :key="address.id"
                                   :value="address">
                  {{ address.addressAsString }}
               </NativeSelectOption>
            </NativeSelect>

            <ButtonIcon as-child>
               <RouterLink to="/create-address">
                  <Plus />
               </RouterLink>
            </ButtonIcon>

         </div>

         <div v-if="currentUserAddress && !currentDeliveryZone"
              class="text-sm text-accent">
            Не входит в зону доставки
         </div>

      </div>

   </div>
</template>