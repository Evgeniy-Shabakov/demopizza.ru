<script setup>
import { LoginWithVKID, LoginWithTelegramBot, authUser } from '~/js/axios-helper'
import { loginForOrder, loginForAddingAdress } from '~/js/login-panel-helper.js'

const errorVKAuth = ref()
const errorTGBotAuth = ref()
const errorLoginOnServer = ref()

const authTgBotRef = ref() // Ссылка на компонент AuthTgBot

watch(authUser, (newVal, oldVal) => {
   if (authUser.value && !loginForOrder.value && !loginForAddingAdress.value)
      navigateTo('/user')
})

function clearErrors() {
   errorVKAuth.value = null
   errorTGBotAuth.value = null
   errorLoginOnServer.value = null
}

function handleErrorVKAuth(err) {
   clearErrors()
   errorVKAuth.value = err
}

function handleErrorTgBotAuth(err) {
   clearErrors()
   errorTGBotAuth.value = err
}

async function handleSuccessVKAuth(access_token) {
   clearErrors()

   try {
      await LoginWithVKID(access_token)
      actionAfrerLogin()
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
}

async function handleSuccessTgBotAuth(access_token) {
   clearErrors()

   try {
      await LoginWithTelegramBot(access_token)
      actionAfrerLogin()
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
}

function actionAfrerLogin() {
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
}

// Функция для обработки клика на кнопку "Продолжить с Telegram"
function handleTelegramButtonClick() {
   if (authTgBotRef.value) {
      authTgBotRef.value.openTelegramBot()
   }
}

const authRef = ref(null)

const simulateVkClick = () => {
  authRef.value?.loginVK()
}

</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">
         Вход в личный кабинет
      </h1>

      <div class="flex flex-col justify-between h-full">

         <div class="text-sm text-center">
            Вход осуществляется по номеру телефона с помощью
            <br> Телеграм или ВК
            <br> (это просто и безопасно)

         </div>

         <div class="flex flex-col items-center gap-4">
            <!-- <AuthTgBot ref="authTgBotRef"
                       @success="handleSuccessTgBotAuth"
                       @error="handleErrorTgBotAuth" /> -->

            <div>
               <BaseButton class="TelegramLoginButton">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       x="0px"
                       y="0px"
                       width="28"
                       height="28"
                       viewBox="0 0 50 50"
                       fill="white">
                     <path
                           d="M25,2c12.703,0,23,10.297,23,23S37.703,48,25,48S2,37.703,2,25S12.297,2,25,2z M32.934,34.375	c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219	c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966	c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693	c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351	c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z">
                     </path>
                  </svg>
                  <div>
                     Войти с Telegram
                  </div>
               </BaseButton>
               <div class="text-xs text-center text-red-700 ">
                  Временно недоступен
               </div>
            </div>

            <div>
               <AuthVkid ref="authRef"
                         @success="handleSuccessVKAuth"
                         @error="handleErrorVKAuth" />
               <div class="text-xs text-center text-gray-700 mt-2">
                  Если осуществляете вход с чужого устройства
                  <br>
                  используйте режим инкогнито
               </div>
            </div>

            <div v-if="errorVKAuth"
                 class="bg-white rounded p-2  text-center">
               <div class="text-red-500">Ошибка ВК (авторизация)</div>
               <div>Код: {{ errorVKAuth.code }}</div>
               <div>Ошибка: {{ errorVKAuth.error }}</div>
            </div>

            <div v-if="errorTGBotAuth"
                 class="bg-white rounded p-2  text-center">
               <div class="text-red-500">Ошибка ТГ-бот (авторизация)</div>
               <div>Код: {{ errorTGBotAuth.code }}</div>
               <div>Ошибка: {{ errorTGBotAuth?.response?.data?.message }}</div>
            </div>

            <div v-if="errorLoginOnServer"
                 class="bg-white rounded p-2  text-center">
               <div class="text-red-500">
                  Ошибка входа на сервере
               </div>
               <div>{{ errorLoginOnServer }}</div>
               <div>{{ errorLoginOnServer?.response?.data?.message }}</div>
            </div>
         </div>


         <div class="text-sm text-center">
            Продолжая вы соглашаетесь со
            <BaseLink to='/legal-documents'>
               сбором, обработкой персональных данных и
               Пользовательским соглашением
            </BaseLink>
         </div>

      </div>

      <template #actions>

         <BaseButton class="w-full"
                     @click="simulateVkClick">
            Продолжить с VK ID
         </BaseButton>

      </template>

   </PopupPageWrapper>
</template>

<style scoped>
.TelegramLoginButton {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 15px;
   background: #0088cc;
   transition: all .1s ease-out;
   border-radius: 8px;
   min-height: 44px;
   min-width: 300px;
   font-weight: 500;
   color: white;
}

.TelegramLoginButton:hover {
   background: #0088cc;
   opacity: 0.8;
}

.TelegramLoginButton:active {
   opacity: .7;
   transform: scale(.97);
}
</style>