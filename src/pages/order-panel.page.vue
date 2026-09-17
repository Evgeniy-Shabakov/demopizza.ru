<script setup>
import { api } from '@/api/api'
import { ClipboardCheck } from '@lucide/vue'
import { currentCity } from '@/composables/use-cities'
import {
   atRest, atRestToTable, deliveryToAddress, orderTypeId, pickUpAtCounter, orderTypeShortName
}
   from '@/composables/use-order-type'
import { inputedPhone } from '@/composables/use-phone-input'
import { currentRestaurant } from '@/composables/use-restaurants'
import { currentUserAddress } from '@/composables/use-user-addresses'
import { formatPhone } from '@/helpers/format-phone'
import { paymentTypeId } from '@/composables/use-payment-type'
import { productsInOrder } from '@/composables/use-cart'
import { deliveryPrice, totalPrice, totalProductPrice } from '@/composables/use-prices'
import { authUser } from '@/composables/use-auth-user'
import { currentDeliveryZone } from '@/composables/use-delivery-zones'
import { currentOrder } from '@/composables/orders/use-current-order'
import { packTakeaway, tableNumber } from '@/composables/use-order-restaurant-settings'
import { lastOrder } from '@/composables/orders/use-last-order'
import { normalizeProductImagePathForOrder } from '@/helpers/normalize-product-image-path'

const router = useRouter()

const phone = computed(() => {
   if (authUser.value) return formatPhone(authUser.value.phone)
   else return formatPhone('+7' + inputedPhone.value)
})

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

      normalizeProductImagePathForOrder(currentOrder.value)

      lastOrder.value = JSON.parse(JSON.stringify(currentOrder.value))

      if (currentOrder.value.payment?.paymentUrl) {
         window.location.href = currentOrder.value.payment.paymentUrl
      }

      else router.push('/order-success')
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
      <div v-if="deliveryToAddress && currentUserAddress?.comment"
           class="text-xs font-normal text-muted-foreground">
         {{ currentUserAddress.comment }}
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
         <ClipboardCheck class="size-5" />
         Оформить зa {{ totalPrice }} ₽
      </ButtonLgWfull>
   </BottomBar>

   <SpinnerCenter v-if="isSendingOrder" />
</template>