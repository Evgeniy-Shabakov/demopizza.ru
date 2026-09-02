<script setup>
import { api } from '@/api/api'
import { currentCity } from '@/composables/useCities'
import {
   atRest, atRestToTable, deliveryToAddress, orderTypeId, pickUpAtCounter, orderTypeShortName
}
   from '@/composables/useOrderType'
import { inputedPhone } from '@/composables/usePhoneInput'
import { currentRestaurant } from '@/composables/useRestaurants'
import { currentUserAddress } from '@/composables/useUserAddresses'
import { formatPhone } from '@/helpers/formatPhone'
import { paymentTypeId } from '@/composables/usePaymentType'
import { productsInOrder, clearCart } from '@/composables/useCart'
import { deliveryPrice, totalPrice, totalProductPrice } from '@/composables/usePrices'
import { authUser } from '@/composables/useAuthUser'
import { currentDeliveryZone } from '@/composables/useDeliveryZones'
import { currentOrder, lastOrderForUser } from '@/composables/useOrder'
import { packTakeaway, tableNumber } from '@/composables/useOrderRestaurantSettings'

const router = useRouter()

const phone = computed(() => formatPhone('+7' + inputedPhone.value))

const address = computed(() => {
   if (deliveryToAddress.value) {
      return currentUserAddress?.value?.addressAsString
   }
   if (pickUpAtCounter.value || atRest.value) {
      return currentRestaurant?.value?.address?.addressAsString
   }
})

const userComment = ref()

const isSendingOrder = ref(false)

const sendOrderIsActive = computed(() => {
   if (phone.value.length < 10) return false
   if (!orderTypeId.value) return false
   if (!paymentTypeId.value) return false
   if (!totalProductPrice.value) return false
   if (!address.value) return false
   if (atRestToTable.value && !tableNumber.value) return false
   if (isSendingOrder.value) return false

   return true
})

const errorMessage = ref()

async function sendOrder() {
   isSendingOrder.value = true
   errorMessage.value = null

   const orderData = {}

   orderData.cityId = currentCity.value.id

   if (authUser.value) {
      orderData.userId = authUser.value.id
      orderData.phone = authUser.value.phone
   }
   else orderData.phone = '+7' + inputedPhone.value

   if (deliveryToAddress.value) {
      orderData.addressJson = currentUserAddress.value
      if (authUser.value) orderData.addressId = currentUserAddress.value.id

      orderData.deliveryZoneId = currentDeliveryZone.value.id
   }
   else orderData.restaurantId = currentRestaurant.value.id

   if (atRestToTable.value) orderData.tableNumber = String(tableNumber.value)
   else orderData.tableNumber = null

   if (atRest.value) orderData.packTakeaway = packTakeaway.value
   else orderData.packTakeaway = true

   orderData.orderTypeId = orderTypeId.value
   orderData.paymentTypeId = paymentTypeId.value

   orderData.totalProductsPrice = totalProductPrice.value
   orderData.deliveryPrice = deliveryPrice.value
   orderData.totalPrice = totalPrice.value

   orderData.orderProducts = productsInOrder.value.map(product => {
      return {
         productId: product.productId,
         quantity: product.quantity,
         price: product.priceDefault
      }
   })

   orderData.userComment = userComment.value

   try {
      const res = await api.post(`/orders`, orderData)
      currentOrder.value = res.data.data

      lastOrderForUser.value = res.data.data

      clearCart()

      if (currentOrder.value.payment?.paymentUrl) {
         window.location.href = currentOrder.value.payment.paymentUrl
      }

      else router.push('/order-status')
   } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка при оформлении заказа!'
   } finally {
      isSendingOrder.value = false
   }
}
</script>

<template>
   <PageHeader>
      <div>
         {{ currentCity?.name }} - {{ orderTypeShortName }}
      </div>
      <div class="text-base font-normal">
         (оформление заказа)
      </div>
      <div class="text-base text-primary">
         {{ phone }}
      </div>
      <div class="text-sm font-normal text-primary">
         {{ address }}
      </div>
      <div class="text-destructive">
         {{ errorMessage }}
      </div>
   </PageHeader>

   <div class="flex flex-col gap-5">
      <OrderRestaurantSettings />
      <PaymentTypeSelect />
      <ProductsAndTotal />
      <div>
         <Label class="mb-1.5">Комментарий к заказу</Label>
         <Textarea v-model="userComment" />
      </div>
   </div>

   <BottomBar>
      <ButtonLgWfull :disabled="!sendOrderIsActive"
                     @click="sendOrder">
         Оформить зa {{ totalPrice }} ₽
      </ButtonLgWfull>
   </BottomBar>

   <SpinnerCenter v-if="isSendingOrder" />
</template>