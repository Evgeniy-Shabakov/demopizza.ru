<script setup>
import { deliveryToAddress } from '@/composables/useOrderType'
import { ORDER_TYPE } from '@/constants/orderType'
import { totalProductPrice } from '@/composables/usePrices'
import { currentDeliveryZone } from '@/composables/useDeliveryZones'
import { currentUserAddress } from '@/composables/useUserAddresses'
import { authUser } from '@/composables/useAuthUser'

const isButtonNextActive = computed(() => {
   if (totalProductPrice.value <= 0) return false

   if (deliveryToAddress.value) {
      if (!currentUserAddress.value) return false
      if (!currentDeliveryZone.value) return false

      if (totalProductPrice.value < currentDeliveryZone.value?.minOrderValueForDelivery)
         return false
   }

   return true
})
</script>

<template>
   <BottomBar>

      <div class="flex items-center justify-between gap-2 w-full">

         <TotalBlock></TotalBlock>

         <div v-if="deliveryToAddress"
              class="text-xs text-center">
            <div v-if="!currentUserAddress">
               Дбавьте адрес доставки
            </div>
            <div v-else-if="!currentDeliveryZone">
               Адрес не входит в зону доставки
            </div>
            <div v-else-if="totalProductPrice < currentDeliveryZone?.minOrderValueForDelivery">
               Минимальная сумма товаров для заказа
               {{ Number(currentDeliveryZone?.minOrderValueForDelivery) }} ₽
            </div>
            <div v-else-if="totalProductPrice < currentDeliveryZone?.orderValueForFreeDelivery">
               Бесплатная доставка от {{ Number(currentDeliveryZone?.orderValueForFreeDelivery) }} ₽
            </div>
            <div v-else-if="totalProductPrice >= currentDeliveryZone?.orderValueForFreeDelivery"
                 class="text-sm font-bold text-primary">
               Бесплатная доставка!!!
            </div>
         </div>

         <ButtonLg v-if="authUser"
                   :disabled="!isButtonNextActive"
                   @click="$router.push('/order-panel')">
            Далее
         </ButtonLg>

         <Dialog v-else>
            <DialogTrigger as-child>
               <ButtonLg :disabled="!isButtonNextActive">
                  Далее
               </ButtonLg>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Выбирите действие</DialogTitle>
                  <DialogDescription>
                     Авторизуйтесь для сохранения истории или продолжите как гость
                  </DialogDescription>
               </DialogHeader>

               <ButtonLg @click="$router.push('/profile')">
                  Войти в личный кабинет
               </ButtonLg>
               <ButtonLg @click="$router.push('/phone')">
                  Продолжить без входа
               </ButtonLg>
            </DialogContent>
         </Dialog>
      </div>

   </BottomBar>
</template>
