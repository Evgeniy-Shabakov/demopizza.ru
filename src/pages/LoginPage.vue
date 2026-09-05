<script setup>
import * as VKID from '@vkid/sdk'
import { api } from '@/api/api'
import { authUser } from '@/composables/useAuthUser'

const router = useRouter()

const isCheckedSoglasie = ref(false)
const isLoading = ref(false)
const errorVKAuth = ref()
const errorLoginOnServer = ref()

async function loginVK() {
   if (!import.meta.env.VITE_VK_APP_ID) return //чтобы работало на проде пока нет VK_APP_ID 

   VKID.Config.init({
      app: import.meta.env.VITE_VK_APP_ID,
      redirectUrl: import.meta.env.VITE_VK_REDIRECT_URL,
      responseMode: VKID.ConfigResponseMode.Callback,
      scope: 'phone',
   })

   try {
      const payload = await VKID.Auth.login()
      const authData = await VKID.Auth.exchangeCode(payload.code, payload.device_id)

      return authData.access_token
   }
   catch (error) {
      errorVKAuth.value = error
      throw error
   }
}

async function handleButton() {
   errorVKAuth.value = null
   errorLoginOnServer.value = null

   isLoading.value = true

   try {
      const vkToken = await loginVK()

      const res = await api.post('/auth/login',
         {
            vkidAccessToken: vkToken
         })

      authUser.value = res.data.data
      console.log(authUser.value)

      router.push('/profile')
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
   finally {
      isLoading.value = false
   }
}

</script>

<template>
   <div class="flex-1 flex flex-col justify-between items-center">

      <PageHeader>
         Вход в личный кабинет
      </PageHeader>

      <div>

         <div v-if="errorVKAuth"
              class="text-center">
            <div class="text-destructive">Ошибка ВК (авторизация)</div>
            <div>Код: {{ errorVKAuth.code }}</div>
            <div>Ошибка: {{ errorVKAuth.error }}</div>
         </div>

         <div v-else-if="errorLoginOnServer"
              class="text-center">
            <div class="text-destructive">
               Ошибка входа на сервере
            </div>
            <div>{{ errorLoginOnServer }}</div>
            <div>{{ errorLoginOnServer?.response?.data?.message }}</div>
         </div>

      </div>

      <Soglasie v-model="isCheckedSoglasie"
                class="mx-2" />

   </div>

   <SpinnerCenter v-if="isLoading" />

   <BottomBar>
      <ButtonLgWfull :disabled="!isCheckedSoglasie || isLoading"
                     @click="handleButton">
         Продолжить с VK ID
      </ButtonLgWfull>
   </BottomBar>
</template>
