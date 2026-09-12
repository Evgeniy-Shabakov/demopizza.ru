<script setup>
import { authUser } from '@/composables/useAuthUser'
import { currentOrder } from '@/composables/useOrder'

const router = useRouter()

onMounted(() => {
   if (!currentOrder.value) router.replace({ name: 'home' })
})

onBeforeRouteLeave(() => {
   currentOrder.value = null
})
</script>

<template>
   <PageHeader>
      <div>
         Ваш заказ оформлен! <br>
         Статус заказа можно отследить <br>
         в личном кабинете.
      </div>
      <div v-if="!authUser"
           class="text-sm font-normal text-destructive">
         Статус заказа не доступен для заказов, сделанных без входа в личный кабинет
      </div>
   </PageHeader>

   <OrderCard v-if="currentOrder"
              :show-payment-status="false"
              class="mt-3"
              :order="currentOrder" />

   <BottomBar>
      <ButtonLgWfull @click="$router.push('/profile')">
         Личный кабинет
      </ButtonLgWfull>
   </BottomBar>
</template>