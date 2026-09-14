<script setup>
import { inputedPhone } from '@/composables/use-phone-input'
import { CircleArrowRight } from '@lucide/vue'

const isCheckedSoglasie = ref(false)
</script>

<template>
   <div class="flex-1 flex flex-col justify-between items-center">

      <div class="text-center">
         Для оформления заказа <br>
         необходимо ввести номер телефона
      </div>

      <PhoneInput />

      <Soglasie v-model="isCheckedSoglasie"
                class="mx-2" />

   </div>

   <BottomBar>
<ButtonLgWfull :disabled="!isCheckedSoglasie || inputedPhone.length != 14"
                      @click="$router.push('/order-panel')">
         <CircleArrowRight class="size-5" />
         Продолжить
      </ButtonLgWfull>
   </BottomBar>
</template>
