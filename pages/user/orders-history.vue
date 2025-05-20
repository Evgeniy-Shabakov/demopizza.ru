<script setup>
import { allOrdersForUser, getAllOrdersForUser, authUser }
   from '~/js/axios-helper.js'
import { repeatOrder } from '~/js/user-panel'
import { LOADING_TYPE } from '~/js/data-types/loading-type'

const orderHistoryLoadingType = ref(LOADING_TYPE.LOADING)

if (authUser.value) { // проверка нужна при заходе на страницу при обновлении
   getAllOrdersForUser(authUser.value.id)
      .then(() => orderHistoryLoadingType.value = LOADING_TYPE.COMPLETE)
      .catch(() => orderHistoryLoadingType.value = LOADING_TYPE.ERROR)
}
else {
   watch(authUser, () => {
      getAllOrdersForUser(authUser.value.id)
         .then(() => orderHistoryLoadingType.value = LOADING_TYPE.COMPLETE)
         .catch(() => orderHistoryLoadingType.value = LOADING_TYPE.ERROR)
   })
}
</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">История заказов</h1>

      <BaseSpinner v-if="orderHistoryLoadingType == LOADING_TYPE.LOADING" />

      <template v-else-if="orderHistoryLoadingType == LOADING_TYPE.COMPLETE">

         <div v-if="allOrdersForUser.length > 0"
              class="flex flex-col gap-5">
            <div v-for="order in allOrdersForUser">

               <p class="text-center text-sm text-(--text-color-main)/60">
                  {{ new Date(order.created_at).toLocaleDateString() }} -
                  {{ new Date(order.created_at).toLocaleTimeString() }}
               </p>
               <p class="text-center text-sm text-(--text-color-main)/60 mb-2">
                  ({{ order.order_status }})
               </p>

               <div class="grid grid-cols-[1fr_max-content_max-content] items-center gap-3
                           border border-(--brand-color) rounded-(--border-radius-main) p-2 mb-2">

                  <template v-for="product in order.products">

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

                     <span class="user-panel__last-order-section-count-price"> {{ product.quantity }} </span>
                     <span> шт. </span>

                  </template>

               </div>

               <BaseButton class="w-full"
                           :isIcon="true"
                           :click="() => repeatOrder(order)">
                  Повторить заказ
               </BaseButton>

            </div>
         </div>
         <p v-else>У вас еще не было заказов</p>

      </template>

      <div v-else>Ошибка загрузки...</div>


      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="() => navigateTo('/user')">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>