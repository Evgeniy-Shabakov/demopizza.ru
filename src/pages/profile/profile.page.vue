<script setup>
import { authUser } from '@/composables/use-auth-user'
import { formatPhone } from '@/helpers/format-phone';

</script>

<template>
   <PageHeader>Профиль</PageHeader>
   <div class="-mt-2 text-center">{{ formatPhone(authUser?.phone) }}</div>

   <div class="flex flex-col gap-3 mt-4">
      <Button as-child>
         <RouterLink to="/profile/delivery-addresses">
            Адреса доставки
         </RouterLink>
      </Button>

      <Button as-child>
         <RouterLink to="/profile/edit">
            Управление профилем
         </RouterLink>
      </Button>

      <Button as-child>
         <RouterLink to="/profile/order-history">
            История заказов
         </RouterLink>
      </Button>
   </div>

   <ActiveOrders class="mt-4" />

   <LastOrder class="mt-4" />

   <BottomBar />
</template>
