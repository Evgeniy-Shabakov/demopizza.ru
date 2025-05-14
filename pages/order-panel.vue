<script setup>
import axios from 'axios'

import { authUser, lastOrderForUser } from '~/js/axios-helper.js'
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, currentOrder,
   selectedOrderType, selectedAddressForDelivery, totalCountInCart, removeAllProductsFromCart,
   selectedRestaurant, selectedOrderInRestaurantType
} from '~/js/client-helper.js'
import { loginForOrder } from '~/js/login-panel-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'
import { ORDER_IN_RESTAURANT_TYPE } from '~/js/data-types/order-in-restaurant-type'
import { PAYMENT_TYPE } from '~/js/data-types/payment-type'
import { setAddressForDelivery } from '~/js/order-panel-helper.js'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { userAddresses } from '~/js/address-index.js'
import { checkOperatingModeAndActivateDialog } from '~/js/open-close-time'

const orderData = reactive({})

const productsInOrder = ref([])

const addressesInSelectedCity = ref([])

const validationErrors = ref({})
const otherErrors = ref()

if (authUser.value == null) {
   loginForOrder.value = true
   navigateTo('/login')
}
else {
   productsInOrder.value = productsInCart.value
      .filter(product => product.countInCart > 0)

   addressesInSelectedCity.value = userAddresses.value
      .filter(address => address.city.id === selectedCity.value.id)

   setAddressForDelivery()

   orderData.user_id = authUser.value.id
   orderData.city_id = selectedCity.value.id
   orderData.restaurant_id = selectedRestaurant.value ? selectedRestaurant.value.id : null
   orderData.user_address_id = selectedAddressForDelivery.value ? selectedAddressForDelivery.value.id : null
   orderData.order_type = selectedOrderType.value
   orderData.order_in_restaurant_type = selectedOrderInRestaurantType.value
   orderData.table_number = null
   orderData.car_number = null
   orderData.pack_takeaway = true
   orderData.total_products_price = totalProductPrice.value
   orderData.delivery_price = deliveryPrice.value
   orderData.total_price = totalPrice.value
   orderData.payment_type = PAYMENT_TYPE.CARD_OFFLINE
   orderData.banknote_for_change = null
   orderData.is_payment = false
   orderData.comment = null
   orderData.products_in_order = productsInOrder.value
}

watch(selectedAddressForDelivery, () => { //v-model это selectedAddressForDelivery, чтобы сохранить изменения
   orderData.user_address_id = selectedAddressForDelivery.value.id
})

watch(selectedOrderInRestaurantType, () => { //v-model это selectedOrderInRestaurantType, чтобы сохранить изменения
   orderData.order_in_restaurant_type = selectedOrderInRestaurantType.value
})

watch(selectedRestaurant, () => {
   orderData.restaurant_id = selectedRestaurant.value.id
   setOrderInRestaurantType()
})

function setOrderInRestaurantType() {
   if (selectedOrderInRestaurantType.value == ORDER_IN_RESTAURANT_TYPE.COUNTER) {
      if (selectedRestaurant.value.pick_up_at_counter_available)
         return
      else
         selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.TABLE
   }

   if (selectedOrderInRestaurantType.value == ORDER_IN_RESTAURANT_TYPE.TABLE) {
      if (selectedRestaurant.value.at_restaurant_to_table_available)
         return
      else
         selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.COUNTER
   }
}

async function sendOrder() {
   if (!checkOperatingModeAndActivateDialog()) return

   if (selectedOrderType.value == ORDER_TYPE.delivery) {
      orderData.restaurant_id = null
   }

   if (selectedOrderType.value != ORDER_TYPE.inRestaurant) {
      orderData.order_in_restaurant_type = null
   }

   validationErrors.value = {}
   otherErrors.value = null

   try {
      const res = await axios.post(`/orders`, orderData)
      currentOrder.value = res.data.data

      lastOrderForUser.value = res.data.data

      removeAllProductsFromCart()
      navigateTo('/order-status')
   } catch (error) {
      console.log(error)

      if (error.response.status === 422) {
         validationErrors.value = error.response.data.errors
         transformValidateErrorsForUI(validationErrors.value)
      } else {
         otherErrors.value = 'что то пошло не так, попробуйте еще раз';
      }
   }
}
</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="selectedCity"
          class="text-xl text-center">
         <div class="font-bold">{{ selectedCity.title }}</div>
         <div class="text-(--text-color-accent)">{{ selectedOrderType }}</div>
         <div class="text-sm font-normal">(оформление заказа)</div>
         <BaseInvalidateText>{{ otherErrors }}</BaseInvalidateText>
      </h1>

      <div v-if="selectedCity"
           class="flex flex-col gap-5">

         <template v-if="selectedOrderType == ORDER_TYPE.delivery">

            <div v-if="addressesInSelectedCity.length > 0">
               <BaseLabel class="mb-2">Выбирите адрес или добавьте новый</BaseLabel>
               <div class="flex items-center gap-3.5">

                  <select v-model="selectedAddressForDelivery"
                          class="base-selecte">
                     <option v-for="address in addressesInSelectedCity"
                             :value="address">

                        <span v-if="address.title">{{ address.title }} -</span>
                        {{ address.street }}
                        {{ address.house_number }}
                        <span v-if="address.corps_number">/ {{ address.corps_number }}</span>
                        <span v-if="address.apartment_number"> - {{ address.apartment_number }}</span>

                     </option>
                  </select>

                  <NuxtLink to="/">
                     <BaseButton :isIcon="true">
                        <IconPlus />
                     </BaseButton>
                  </NuxtLink>

               </div>
               <BaseInvalidateText>{{ validationErrors.user_address_id }}</BaseInvalidateText>
            </div>

            <div v-else
                 class="text-center">
               <NuxtLink to="/">
                  <BaseButton>
                     Добавить адрес доставки
                  </BaseButton>
               </NuxtLink>
               <BaseInvalidateText>{{ validationErrors.user_address_id }}</BaseInvalidateText>
            </div>

         </template>

         <div v-else>

            <BaseLabel v-if="selectedOrderType == ORDER_TYPE.pickUp"
                       class="mb-2">
               Выберите точку самовывоза
            </BaseLabel>
            <BaseLabel v-else-if="selectedOrderType == ORDER_TYPE.inRestaurant"
                       class="mb-2">
               Выберите ресторан
            </BaseLabel>
            <RestaurantSelecte />
            <BaseInvalidateText>{{ validationErrors.restaurant_id }}</BaseInvalidateText>

         </div>

         <div v-if="selectedOrderType == ORDER_TYPE.inRestaurant && selectedRestaurant"
              class="flex justify-between gap-3.5">

            <button class="btn-selecte"
                    :class="{ 'btn-selecte--active': selectedOrderInRestaurantType == ORDER_IN_RESTAURANT_TYPE.COUNTER }"
                    @click="selectedOrderInRestaurantType = ORDER_IN_RESTAURANT_TYPE.COUNTER"
                    :disabled="!selectedRestaurant.pick_up_at_counter_available">
               Заберу у бара
               <template v-if="!selectedRestaurant.pick_up_at_counter_available">
                  <br>(не доступно)
               </template>
            </button>

            <button class="btn-selecte"
                    :class="{ 'btn-selecte--active': selectedOrderInRestaurantType == ORDER_IN_RESTAURANT_TYPE.TABLE }"
                    @click="selectedOrderInRestaurantType = ORDER_IN_RESTAURANT_TYPE.TABLE"
                    :disabled="!selectedRestaurant.at_restaurant_to_table_available">
               Принести к столику
               <template v-if="!selectedRestaurant.at_restaurant_to_table_available">
                  <br>(не доступно)
               </template>
            </button>

         </div>

         <div v-if="selectedOrderType == ORDER_TYPE.inRestaurant &&
            selectedOrderInRestaurantType == ORDER_IN_RESTAURANT_TYPE.TABLE"
              class="flex flex-col items-center">

            <BaseLabel class="mb-2">Введите номер столика</BaseLabel>
            <input type="text"
                   class="text-center text-2xl p-2.5 rounded-lg w-32 border border-(--brand-color)"
                   v-model="orderData.table_number"
                   @click.prevent="validationErrors.table_number = ''">
            <BaseInvalidateText>{{ validationErrors.table_number }}</BaseInvalidateText>
         </div>

         <div>
            <BaseLabel class="mb-2">Способ оплаты</BaseLabel>
            <select v-model="orderData.payment_type"
                    class="base-selecte">
               <option :value="PAYMENT_TYPE.CARD_OFFLINE"> {{ PAYMENT_TYPE.CARD_OFFLINE }}</option>
               <option :value="PAYMENT_TYPE.CASH"> {{ PAYMENT_TYPE.CASH }}</option>
            </select>
            <BaseInvalidateText>{{ validationErrors.payment_type }}</BaseInvalidateText>
         </div>

         <div>

            <BaseLabel class="mb-2">Товары ({{ totalCountInCart }}шт.)</BaseLabel>

            <div class="grid grid-cols-[1fr_max-content_max-content] gap-2 gap-x-4 items-center p-1
                        text-sm border border-(--brand-color) rounded-(--border-radius-main) mb-2">

               <template v-for="(product, index) in productsInOrder">

                  <div>

                     <div class="flex items-center gap-1.5">
                        <img class="w-8"
                             :src="product.image_url">
                        <span>{{ product.title }}</span>
                     </div>

                     <IngredientsMini v-if="product.userConfigID"
                                      :baseIngredients="product.baseIngredients"
                                      :additionalIngredients="product.additionalIngredients" />

                     <BaseInvalidateText>
                        {{ validationErrors[`products_in_order.${index}.id`] }}
                     </BaseInvalidateText>

                  </div>

                  <div class="justify-self-center whitespace-nowrap">
                     {{ product.countInCart }} x {{ Number(product.price_default) }}р
                  </div>
                  <div class="justify-self-end">
                     {{ Number(product.countInCart) * Number(product.price_default) }}р
                  </div>

               </template>

            </div>
            <BaseInvalidateText>{{ validationErrors.products_in_order }}</BaseInvalidateText>

            <TotalBlock class="justify-end" />

         </div>

         <div>
            <BaseLabel class="mb-2">Комментарий к заказу</BaseLabel>
            <BaseTextarea v-model="orderData.comment" />
            <BaseInvalidateText>{{ validationErrors.comment }}</BaseInvalidateText>
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