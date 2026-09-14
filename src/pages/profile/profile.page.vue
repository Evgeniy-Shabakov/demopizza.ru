<script setup>
import { authUser } from '@/composables/use-auth-user'
import { formatPhone } from '@/helpers/format-phone';
import { lastOrder } from '@/composables/orders/use-last-order'
import { repeatOrder } from '@/composables/use-cart'
import { MapPin, UserRound, History, RotateCcw } from '@lucide/vue'

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
            <MapPin class="size-4" />
            Адреса доставки
         </RouterLink>
      </Button>

      <Button as-child>
         <RouterLink to="/profile/edit">
            <UserRound class="size-4" />
            Управление профилем
         </RouterLink>
      </Button>

      <Button as-child>
         <RouterLink to="/profile/order-history">
            <History class="size-4" />
            История заказов
         </RouterLink>
      </Button>
   </div>

   <ActiveOrders class="mt-4" />

   <LastOrder class="mt-4" />

   <BottomBar>
      <ButtonLgWfull v-if="lastOrder"
                     @click="repeatLastOrder">
         <RotateCcw class="size-5" />
         Повторить последний заказ
      </ButtonLgWfull>
      <ButtonLgWfull v-else
                     @click="$router.back()">
         Назад
      </ButtonLgWfull>
   </BottomBar>
</template>
