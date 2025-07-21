<script setup>
import { LoginWithVKID, LoginWithTelegramBot } from '~/js/axios-helper'
import { loginForOrder, loginForAddingAdress } from '~/js/login-panel-helper.js'

const errorVKAuth = ref()
const errorTGBotAuth = ref()
const errorLoginOnServer = ref()

const authTgBotRef = ref() // Ссылка на компонент AuthTgBot

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
      ActionAfrerLogin()
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
}

async function handleSuccessTgBotAuth(access_token) {
   clearErrors()

   try {
      await LoginWithTelegramBot(access_token)
      ActionAfrerLogin()
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
}

function ActionAfrerLogin() {
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
            <AuthTgBot ref="authTgBotRef"
                       @success="handleSuccessTgBotAuth"
                       @error="handleErrorTgBotAuth" />

            <div>
               <AuthVkid @success="handleSuccessVKAuth"
                         @error="handleErrorVKAuth" />
               <div class="text-xs text-center text-gray-700">
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
                     :click="handleTelegramButtonClick">
            Продолжить с Telegram
         </BaseButton>

      </template>

   </PopupPageWrapper>



</template>