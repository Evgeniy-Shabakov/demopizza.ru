<script setup>
import { authUser, activeOrdersForUser, lastOrderForUser, getLastOrderForUser }
   from '~/js/axios-helper.js'
import { currentOrder } from '~/js/client-helper.js'
import { intervalLoadActiveOrders, loadActiveOrdersForUserAndRestartInterval }
   from '~/js/user-panel.js'
import { LOADING_TYPE } from '~/js/data-types/loading-type'
import { repeatOrder } from '~/js/user-panel'
import { formatPhone } from '~/js/phone-helper'

const lastOrderLoadingType = ref(LOADING_TYPE.LOADING)

onMounted(() => {
   loadActiveOrdersForUserAndRestartInterval(authUser.value.id)

   if (lastOrderForUser.value) {
      lastOrderLoadingType.value = LOADING_TYPE.COMPLETE
   }
   else {
      getLastOrderForUser(authUser.value.id)
         .then(() => lastOrderLoadingType.value = LOADING_TYPE.COMPLETE)
         .catch(() => lastOrderLoadingType.value = LOADING_TYPE.ERROR)
   }
})

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - START
watch(authUser, () => {
   if (authUser.value == null)
      navigateTo('/login')
})
//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - END

onUnmounted(() => {
   clearInterval(intervalLoadActiveOrders)
})

function openOrderStatusPanel(order) {
   currentOrder.value = order
   navigateTo('/order-status')
}

</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center">
         <div class="font-semibold">Данные профиля</div>
         <div v-if="authUser"
              class="text-base">
            {{ formatPhone(authUser.phone) }}
         </div>
      </h1>

      <template v-if="authUser">

         <section class="flex items-center justify-between gap-1">
            <span>{{ authUser.name || 'Гость' }}</span>
            <BaseButton :isIcon="true"
                        :click="() => navigateTo('/user/edit')">
               <IconPenсil class="h-6 w-6 scale-85 -scale-x-85" />
            </BaseButton>
         </section>

         <BaseButton :isIcon="true"
                     :click="() => navigateTo('/user/adresses')">
            Адреса доставки
         </BaseButton>
         <BaseButton :isIcon="true"
                     :click="() => navigateTo('/user/profile-management')">
            Управление профилем
         </BaseButton>
         <BaseButton :isIcon="true"
                     :click="() => navigateTo('/user/orders-history')">
            История заказов
         </BaseButton>

         <section>
            <h2 class="text-xl text-center mb-2">Активные заказы</h2>
            <div v-if="activeOrdersForUser.length > 0"
                 class="space-y-2">

               <div v-for="order in activeOrdersForUser"
                    class="grid grid-cols-3 items-center gap">
                  <span class="text-xl">
                     №{{ order.number }}
                  </span>
                  <div class="">
                     <div class="text-center text-(--text-color-accent) font-semibold">
                        {{ order.order_status }}
                     </div>
                     <BaseLineLoader />
                  </div>
                  <BaseButton :isIcon="true"
                              :click="() => openOrderStatusPanel(order)"
                              class="justify-self-end">
                     <IconMagnifyingGlass class="h-6 w-6 scale-75 -scale-x-75" />
                  </BaseButton>
               </div>

            </div>
            <p v-else
               class="text-center">У Вас нет активных заказов</p>
         </section>

         <section>

            <h2 class="text-xl text-center mt-3 mb-2">Последний заказ</h2>

            <div v-if="lastOrderLoadingType == LOADING_TYPE.LOADING">
               <BaseSpinner />
            </div>

            <template v-else-if="lastOrderLoadingType == LOADING_TYPE.COMPLETE">

               <div v-if="lastOrderForUser"
                    class="grid grid-cols-[1fr_max-content_max-content] items-center gap-3
                    border border-(--brand-color) rounded-(--border-radius-main) p-2">

                  <template v-for="product in lastOrderForUser.products">

                     <div>
                        <div class="flex items-center gap-3">
                           <img class="w-9 h-9"
                                :src="product.image_url">
                           <span>{{ product.title }}</span>
                        </div>

                        <IngredientsMini v-if="product.user_config_id"
                                         :baseIngredients="product.user_config_base_ingredients"
                                         :additionalIngredients="product.user_config_additional_ingredients" />
                     </div>

                     <span class="justify-self-center"> {{ product.quantity }} </span>
                     <span> шт. </span>

                  </template>

               </div>

               <p v-else class="text-center">У Вас еще не было заказов</p>

            </template>

            <div v-else>Ошибка загрузки...</div>

         </section>

      </template>

      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="() => repeatOrder(lastOrderForUser)">
            Повторить последний заказ
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>