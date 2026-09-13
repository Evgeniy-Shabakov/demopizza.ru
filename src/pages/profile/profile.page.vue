<script setup>
import { authUser } from '@/composables/use-auth-user'
import { formatPhone } from '@/helpers/format-phone';
import { lastOrder } from '@/composables/use-last-order'
import { repeatOrder } from '@/composables/use-cart'

const router = useRouter()

function repeatLastOrder() {
   repeatOrder(lastOrder.value)
   router.push('/cart')
}

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

   <BottomBar>
      <ButtonLgWfull v-if="lastOrder"
                     @click="repeatLastOrder">
         Повторить последний заказ
      </ButtonLgWfull>
      <ButtonLgWfull v-else
                     @click="$router.back()">
         Назад
      </ButtonLgWfull>
   </BottomBar>
</template>
