<script setup>
import { authUser } from '@/composables/useAuthUser'
import { formatPhone } from '@/helpers/formatPhone';

</script>

<template>
   <PageHeader>Профиль</PageHeader>
   <div class="-mt-2 text-center">{{ formatPhone(authUser.phone) }}</div>

   <div class="flex flex-col gap-3 mt-6">
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

   <BottomBar />
</template>
