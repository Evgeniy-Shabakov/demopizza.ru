<script setup>
import { logoutClient } from '~/js/client-helper.js'
import { authUser } from '~/js/axios-helper.js'
import { formatPhone } from '~/js/phone-helper'

function logoutVue() {
   logoutClient()
   navigateTo('/')
}
</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center">
         <div class="font-semibold">Управление профилем</div>
         <div v-if="authUser"
              class="text-base">
            {{ formatPhone(authUser.phone) }}
         </div>
      </h1>

      <div v-if="authUser">

         <BaseButton class="w-full"
                     :isIcon="true"
                     :click="logoutVue">
            Выйти из профиля
         </BaseButton>

      </div>

      <BaseSpinner v-else />

      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="() => navigateTo('/user')">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>