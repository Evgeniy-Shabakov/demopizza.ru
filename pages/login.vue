<script setup>
import { sendVerifyCode, login, authUser } from '~/js/axios-helper.js'
import { inputedPhone, inputedCode, loginForOrder, loginForAddingAdress } from '~/js/login-panel-helper.js'
import { timerForSendVerifyCodeAllowed, secBeforeSendVerifyCodeAllowed } from '~/js/login-panel-helper.js'

const openPhoneInput = ref(true)

const codeError = ref('')
const phoneError = ref('')

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - START
watch(authUser, () => {
   if (authUser.value && !loginForOrder.value) {
      navigateTo('/user')
   }
})
//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - END

watch(inputedCode, () => {
   if (inputedCode.value.length == 1)
      codeError.value = false
})

const currentSecBeforeSendVerifyCodeAllowed = ref()

const phoneNumberForServer = computed(() => {
   return '+7' + inputedPhone.value.replace(/[^+\d]/g, '')
})

if (localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')) {
   startTimerForSendVerifyCodeAllowed(secBeforeSendVerifyCodeAllowed.value)
}

function startTimerForSendVerifyCodeAllowed(delayInSec) {
   let startTime
   if (localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')) {
      clearInterval(timerForSendVerifyCodeAllowed.value)
      startTime = new Date(JSON.parse(localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')))
   }
   else {
      startTime = new Date()
      localStorage.setItem('startTimeTimeoutForSendVerifyCodeAllowed', JSON.stringify(startTime))
   }

   timerForSendVerifyCodeAllowed.value = setInterval(() => {

      currentSecBeforeSendVerifyCodeAllowed.value = delayInSec - Math.round((new Date() - startTime) / 1000)

      if (currentSecBeforeSendVerifyCodeAllowed.value < 1) {
         clearInterval(timerForSendVerifyCodeAllowed.value)
         timerForSendVerifyCodeAllowed.value = null
         localStorage.removeItem('startTimeTimeoutForSendVerifyCodeAllowed')
      }

   }, 1000)
}

async function sendVerifyCodeHandler() {
   inputedCode.value = ''

   startTimerForSendVerifyCodeAllowed(secBeforeSendVerifyCodeAllowed.value)

   try {
      const res = await sendVerifyCode({ 'phone': phoneNumberForServer.value })
      openPhoneInput.value = false
      alert(res.data)
   } catch (err) {
      openPhoneInput.value = true
      phoneError.value = err.response.data.message
   }
}

async function loginVue() {
   try {
      await login({ phone: phoneNumberForServer.value, sms_code: inputedCode.value })

      if (loginForOrder.value) {
         loginForOrder.value = false
         navigateTo('/order-panel')
      }
      else if (loginForAddingAdress.value) {
         loginForAddingAdress.value = false
         navigateTo('/user/adresses/create')
      }
      else
         navigateTo('/user')
   } catch (err) {
      codeError.value = err.response.data.message
      inputedCode.value = ''
   }
}

</script>

<template>

   <PopupPageWrapper>

      <div class="h-full flex flex-col gap-2 justify-between">

         <div class="h-16"></div>

         <div class="flex flex-col items-center gap-4">

            <h1 class="text-xl font-bold text-center">
               {{ openPhoneInput ? 'Введите номер телефона' : 'Введите код' }}
            </h1>

            <p v-if="openPhoneInput"
               class="text-center mb-3.5">
               для входа в личный кабинет или <br>оформления заказа
            </p>
            <p v-else
               class="text-center mb-3.5">
               код отправили сообщением на <br>{{ phoneNumberForServer }}
            </p>

            <div v-if="openPhoneInput">
               <PhoneInput class="m-auto" />
               <div class="text-sm text-center text-(--danger-color) h-4">
                  {{ phoneError }}
               </div>
            </div>

            <div v-else>
               <CodeInput class="m-auto" />
               <div class="text-sm text-center text-(--danger-color) h-4">
                  {{ inputedCode.length == 0 ? codeError : '' }}
               </div>
            </div>

         </div>

         <div class="h-16 text-sm text-center flex flex-col justify-end">

            <template v-if="openPhoneInput">

               <div v-if="timerForSendVerifyCodeAllowed == null">
                  Продолжая вы соглашаетесь со
                  <BaseLink to='/legal-documents'>
                     сбором, обработкой персональных данных и
                     Пользовательским соглашением
                  </BaseLink>
               </div>

               <div v-else>
                  Повторно отправить код можно через
                  {{ currentSecBeforeSendVerifyCodeAllowed }}сек.
               </div>

            </template>

            <template v-else>

               <div v-if="timerForSendVerifyCodeAllowed">
                  Если код не придет, его можно будет отправить
                  повторно через {{ currentSecBeforeSendVerifyCodeAllowed }}сек.
               </div>

            </template>

         </div>

      </div>

      <template #actions>

         <BaseButton v-if="openPhoneInput"
                     class="base-btn-in-popup-page"
                     :active="phoneNumberForServer.length == 12 && timerForSendVerifyCodeAllowed == null"
                     :click="sendVerifyCodeHandler">
            {{ timerForSendVerifyCodeAllowed == null ? 'ПРОДОЛЖИТЬ' : 'Отправить код повторно' }}
         </BaseButton>

         <template v-else>

            <BaseButton v-if="inputedCode.length == 4"
                        class="base-btn-in-popup-page"
                        :click="loginVue">
               Подтвердить код
            </BaseButton>

            <BaseButton v-else
                        class="base-btn-in-popup-page"
                        :active="timerForSendVerifyCodeAllowed == null"
                        :click="sendVerifyCodeHandler">
               Отправить код повторно
            </BaseButton>

         </template>

      </template>

   </PopupPageWrapper>

</template>