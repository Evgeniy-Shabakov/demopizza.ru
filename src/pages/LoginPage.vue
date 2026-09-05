<script setup>
import * as VKID from '@vkid/sdk'
import { api } from '@/api/api'
import { authUser } from '@/composables/useAuthUser'

const router = useRouter()

const vkAppId = import.meta.env.VITE_VK_APP_ID
const isCheckedSoglasie = ref(false)
const isLoading = ref(false)
const errorAuth = ref()

if (vkAppId) {
   VKID.Config.init({
      app: import.meta.env.VITE_VK_APP_ID,
      redirectUrl: import.meta.env.VITE_VK_REDIRECT_URL,
      responseMode: VKID.ConfigResponseMode.Callback,
      scope: 'phone',
   })
}

async function handleButton() {
   if (!vkAppId) return

   errorAuth.value = null
   isLoading.value = true

   try {
      const payload = await VKID.Auth.login()
      const authData = await VKID.Auth.exchangeCode(payload.code, payload.device_id)

      const res = await api.post('/auth/login',
         {
            vkidAccessToken: authData.access_token
         })

      authUser.value = res.data.data

      router.push('/profile')
   }
   catch (error) {
      errorAuth.value = error
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

      <div v-if="errorAuth && errorAuth.statusCode != 401"
           class="text-center">
         <div class="text-destructive">Ошибка ВК (авторизация)</div>
         <div>Код: {{ errorAuth.code }}</div>
         <div>Ошибка: {{ errorAuth.error }}</div>
      </div>

      <div v-else-if="errorAuth"
           class="text-center">
         <div class="text-destructive">Ошибка входа на сервере</div>
         <div>{{ errorAuth }}</div>
         <div>{{ errorAuth?.response?.data?.message }}</div>
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
