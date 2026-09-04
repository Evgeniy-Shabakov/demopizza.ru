<script setup>
import { authUser } from '@/composables/useAuthUser'
import { api } from '@/api/api'

const router = useRouter()

const errorVKAuth = ref()
const errorLoginOnServer = ref()
const isCheckedSoglasie = ref(false)

function clearErrors() {
   errorVKAuth.value = null
   errorLoginOnServer.value = null
}

function handleErrorVKAuth(err) {
   clearErrors()
   errorVKAuth.value = err
}

async function handleSuccessVKAuth(access_token) {
   clearErrors()

   try {
      const res = await api.post('/auth/login',
         {
            vkidAccessToken: access_token
         })

      authUser.value = res.data.data
      console.log(authUser.value)

      router.push('/profile')
   }
   catch (error) {
      errorLoginOnServer.value = error
   }
}

const authRef = ref(null)

function simulateVkClick() {
   if (!isCheckedSoglasie.value) return
   authRef.value?.loginVK()
}

</script>

<template>
   <div class="flex-1 flex flex-col justify-between items-center">

      <PageHeader>
         Вход в личный кабинет
      </PageHeader>

      <div>
         <div :class="{ 'pointer-events-none cursor-not-allowed': !isCheckedSoglasie }">
            <Vkid ref="authRef"
                  @success="handleSuccessVKAuth"
                  @error="handleErrorVKAuth" />
         </div>

         <div v-if="errorVKAuth"
              class="text-center">
            <div class="text-destructive">Ошибка ВК (авторизация)</div>
            <div>Код: {{ errorVKAuth.code }}</div>
            <div>Ошибка: {{ errorVKAuth.error }}</div>
         </div>

         <div v-if="errorLoginOnServer"
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

   <BottomBar>
      <ButtonLgWfull :disabled="!isCheckedSoglasie"
                     @click="simulateVkClick">
         Продолжить с VK ID
      </ButtonLgWfull>
   </BottomBar>
</template>
