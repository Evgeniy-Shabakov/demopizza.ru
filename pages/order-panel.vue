<script setup>
import axios from 'axios'
import { authUser, lastOrderForUser } from '~/js/axios-helper.js'
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, currentOrder,
   selectedOrderType, selectedAddressForDelivery, totalCountInCart, removeAllProductsFromCart,
   selectedRestaurant
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { PAYMENT_TYPE } from '~/js/data-types/payment-type'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { userAddresses } from '~/js/address-index.js'
import { checkOperatingModeAndActivateDialog } from '~/js/open-close-time'
import { currentDeliveryZone } from '~/js/delivery-zone-helper'
import { serverUrl } from '~/env.js'

const orderData = reactive({})

const productsInOrder = ref([])

const addressesInSelectedCity = ref([])

const validationErrors = ref({})
const otherErrors = ref()

productsInOrder.value = productsInCart.value
   .filter(product => product.countInCart > 0)

addressesInSelectedCity.value = userAddresses.value
   .filter(address => address.cityId === selectedCity.value.id)

orderData.userId = authUser.value.id
orderData.cityId = selectedCity.value.id

orderData.restaurantId =
   selectedOrderType.value.ID != ORDER_TYPE.DELIVERY_TO_ADDRESS.ID && selectedRestaurant.value ?
      selectedRestaurant.value.id :
      null

orderData.userAddressId =
   selectedOrderType.value.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID && selectedAddressForDelivery.value ?
      selectedAddressForDelivery.value.id :
      null

orderData.orderTypeId = selectedOrderType.value.ID
orderData.tableNumber = null
orderData.carNumber = null
orderData.packTakeaway = selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
   selectedOrderType.value.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE ?
   false : true
orderData.totalProductsPrice = totalProductPrice.value
orderData.deliveryPrice = deliveryPrice.value
orderData.totalPrice = totalPrice.value
orderData.paymentType = PAYMENT_TYPE.CARD_OFFLINE
orderData.banknoteForChange = null
orderData.userComment = null
orderData.deliveryZoneId = selectedOrderType.value.ID == ORDER_TYPE.DELIVERY_TO_ADDRESS.ID ?
   currentDeliveryZone.value.id : null

orderData.orderProducts = productsInOrder.value.map(el => {
   return {
      productId: el.id,
      quantity: el.countInCart,
      price: el.priceDefault
   }
})

watch(selectedAddressForDelivery, () => { //v-model это selectedAddressForDelivery, чтобы сохранить изменения
   orderData.userAddressId = selectedAddressForDelivery.value.id
})

watch(selectedRestaurant, () => {
   orderData.restaurantId = selectedRestaurant.value.id
})

async function sendOrder() {
   if (!checkOperatingModeAndActivateDialog()) return

   validationErrors.value = {}
   otherErrors.value = null

   if (orderData.orderTypeId == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID && !orderData.tableNumber) {
      validationErrors.value.tableNumber = 'Введите номер столика'
      return
   }

   try {
      const res = await axios.post(`/orders/user`, orderData)
      currentOrder.value = res.data.data

      lastOrderForUser.value = res.data.data

      removeAllProductsFromCart()
      navigateTo('/order-status')
   } catch (error) {
      console.log(error.response)

      if (error.response.status === 401) {
         otherErrors.value = 'сначала нужно войти в профиль';
      }
      else if (error.response.status === 422) {
         // validationErrors.value = error.response.details.issues
         // transformValidateErrorsForUI(validationErrors.value)
         otherErrors.value = 'ошибка при проверке данных';
      } else {
         otherErrors.value = 'что то пошло не так, попробуйте еще раз';
      }
   }
}

function handlePickupAtCounter() {
   selectedOrderType.value = ORDER_TYPE.AT_RESTAURANT_AT_COUNTER
   orderData.orderTypeId = selectedOrderType.value.ID
}
function handleDeliveryToTable() {
   selectedOrderType.value = ORDER_TYPE.AT_RESTAURANT_TO_TABLE
   orderData.orderTypeId = selectedOrderType.value.ID
}
</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="selectedCity"
          class="text-xl text-center">
         <div>
            <div class="font-semibold">
               {{ selectedCity.name }} - {{ selectedOrderType.SHORT_NAME_FOR_ORDER_PANEL }}
            </div>
         </div>
         <div class="text-sm font-normal">(оформление заказа)</div>

         <div v-if="selectedOrderType.ID != ORDER_TYPE.DELIVERY_TO_ADDRESS.ID"
              class="text-sm text-(--text-color-accent)">
            {{ selectedRestaurant.street }} д. {{ selectedRestaurant.house }}
         </div>
         <div v-else
              class="text-sm text-(--text-color-accent)">
            {{ selectedAddressForDelivery.addressAsString }}
         </div>

         <BaseInvalidateText>{{ otherErrors }}</BaseInvalidateText>
      </h1>

      <div v-if="selectedCity"
           class="flex flex-col gap-5">

         <div v-if="selectedRestaurant &&
            (selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
               selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID)"
              class="flex justify-between gap-3.5">

            <button class="btn-selecte"
                    :class="{ 'btn-selecte--active': selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID }"
                    @click="handlePickupAtCounter"
                    :disabled="!selectedRestaurant.atRestaurantAtCounterAvailable">
               Заберу у бара
               <template v-if="!selectedRestaurant.atRestaurantAtCounterAvailable">
                  <br>(не доступно)
               </template>
            </button>

            <button class="btn-selecte"
                    :class="{ 'btn-selecte--active': selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID }"
                    @click="handleDeliveryToTable"
                    :disabled="!selectedRestaurant.atRestaurantToTableAvailable">
               Принести к столику
               <template v-if="!selectedRestaurant.atRestaurantToTableAvailable">
                  <br>(не доступно)
               </template>
            </button>

         </div>

         <div v-if="selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID"
              class="flex flex-col items-center">

            <BaseLabel class="mb-2">Введите номер столика</BaseLabel>
            <input type="text"
                   class="text-center text-2xl p-2.5 rounded-lg w-32 border border-(--brand-color)"
                   v-model="orderData.tableNumber"
                   @click.prevent="validationErrors.tableNumber = ''">
            <BaseInvalidateText>{{ validationErrors.tableNumber }}</BaseInvalidateText>
            <!-- <BaseInvalidateText>{{ validationErrors.table_number }}</BaseInvalidateText> -->
         </div>

          <div v-if="selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_AT_COUNTER.ID ||
             selectedOrderType.ID == ORDER_TYPE.AT_RESTAURANT_TO_TABLE.ID"
             class="flex items-center justify-between">
             <span class="text-sm font-medium">Упаковать с собой</span>
             <button
                @click="orderData.packTakeaway = !orderData.packTakeaway"
                type="button"
                role="switch"
                :aria-checked="orderData.packTakeaway"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:ring-offset-2"
                :class="orderData.packTakeaway ? 'bg-(--brand-color)' : 'bg-gray-300'">
                <span
                   class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
                   :class="orderData.packTakeaway ? 'translate-x-6' : 'translate-x-1'" />
             </button>
          </div>

         <div>
            <BaseLabel class="mb-2">Способ оплаты</BaseLabel>
            <select v-model="orderData.paymentType"
                    class="base-selecte">
               <option :value="PAYMENT_TYPE.ONLINE"> {{ PAYMENT_TYPE.ONLINE }}</option>
               <option :value="PAYMENT_TYPE.CARD_OFFLINE"> {{ PAYMENT_TYPE.CARD_OFFLINE }}</option>
               <option :value="PAYMENT_TYPE.CASH"> {{ PAYMENT_TYPE.CASH }}</option>
            </select>
            <!-- <BaseInvalidateText>{{ validationErrors.paymentType }}</BaseInvalidateText> -->
         </div>

         <div>

            <BaseLabel class="mb-2">Товары ({{ totalCountInCart }}шт.)</BaseLabel>

            <div class="grid grid-cols-[1fr_max-content_max-content] gap-2 gap-x-4 items-center p-1
                        text-sm border border-(--brand-color) rounded-(--border-radius-main) mb-2">

               <template v-for="(product, index) in productsInOrder">

                  <div>

                     <div class="flex items-center gap-1.5">
                        <img class="w-8"
                             :src="serverUrl + '/' + product.imagePath.replace(/^storage\/public\/?/, '')">
                        <span>{{ product.name }}</span>
                     </div>

                     <!-- <IngredientsMini v-if="product.userConfigID"
                                      :baseIngredients="product.baseIngredients"
                                      :additionalIngredients="product.additionalIngredients" /> -->

                     <!-- <BaseInvalidateText>
                        {{ validationErrors[`products_in_order.${index}.id`] }}
                     </BaseInvalidateText> -->

                  </div>

                  <div class="justify-self-center whitespace-nowrap">
                     {{ product.countInCart }} x {{ Number(product.priceDefault) }}р
                  </div>
                  <div class="justify-self-end">
                     {{ Number(product.countInCart) * Number(product.priceDefault) }}р
                  </div>

               </template>

            </div>
            <!-- <BaseInvalidateText>{{ validationErrors.products_in_order }}</BaseInvalidateText> -->

            <TotalBlock class="justify-end" />

         </div>

         <div>
            <BaseLabel class="mb-2">Комментарий к заказу</BaseLabel>
            <BaseTextarea v-model="orderData.comment" />
            <!-- <BaseInvalidateText>{{ validationErrors.comment }}</BaseInvalidateText> -->
         </div>

      </div>

      <template #actions>

         <BaseButton v-if="selectedCity"
                     class="base-btn-in-popup-page"
                     :click="sendOrder">
            {{ `Оформить за ${totalPrice}р.` }}
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>