<script setup>
import * as VKID from '@vkid/sdk'
import { User, PackageCheck, MapPin } from '@lucide/vue'
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
         <br> осуществляется с помощью VKID
         <br> это просто и безопасно
         <img src="/vk-logo.png"
              class="size-12 object-contain mx-auto mt-2"
              alt="VK ID" />
      </PageHeader>

      <div>
         <p class="text-sm text-muted-foreground text-center -mt-3 mb-3">
            После входа вам будут доступны:
         </p>

         <ul class="space-y-3.5">
            <li class="flex items-center gap-3">
               <span class="p-1.5 rounded-xl bg-primary/10 text-primary">
                  <User class="size-5" />
               </span>
               <div>История и статус ваших заказов</div>
            </li>
            <li class="flex items-center gap-3">
               <span class="p-1.5 rounded-xl bg-primary/10 text-primary ">
                  <PackageCheck class="size-5" />
               </span>
               <div>Быстрое оформление заказа</div>
            </li>
            <li class="flex items-center gap-3">
               <span class="p-1.5 rounded-xl bg-primary/10 text-primary">
                  <MapPin class="size-5" />
               </span>
               <div>Сохранённые адреса</div>
            </li>
         </ul>
      </div>

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
                class="mx-2 mt-3" />

   </div>

   <SpinnerCenter v-if="isLoading" />

   <BottomBar>
      <ButtonLgWfull :disabled="!isCheckedSoglasie || isLoading"
                     @click="handleButton">
         <img src="/vk-logo.png"
              class="size-6 rounded-md object-contain"
              alt="VK ID" />
         Продолжить с VK ID
      </ButtonLgWfull>
   </BottomBar>
</template>
