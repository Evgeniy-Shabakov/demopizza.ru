<script setup>
import { authUser } from '@/composables/useAuthUser'
import { currentOrder } from '@/composables/useOrder'
</script>

<template>
   <PageHeader>
      <div>
         Ваш заказ оформлен! <br>
         Статус заказа можно отследить <br>
         в личном кабинете.
      </div>
      <div v-if="!authUser" class="text-sm font-normal">
         Статус заказа доступен при оформлении заказа после входа в личный кабинет
      </div>
   </PageHeader>

   <OrderCard v-if="currentOrder" class="mt-3"
              :order="currentOrder" />

   <BottomBar>
      <ButtonLgWfull @click="$router.push('/')">
         На главную
      </ButtonLgWfull>
   </BottomBar>
</template>