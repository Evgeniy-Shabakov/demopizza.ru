<script setup>
import { inputedPhone } from '@/composables/usePhoneInput'

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
         Продолжить
      </ButtonLgWfull>
   </BottomBar>
</template>
