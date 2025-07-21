<script setup>
import * as VKID from '@vkid/sdk'
import { VK_APP_ID, VK_REDIRECT_URL } from '~/env'

const emit = defineEmits(['success', 'error'])

async function loginVK() {
   VKID.Config.init({
      app: VK_APP_ID,
      redirectUrl: VK_REDIRECT_URL,
      responseMode: VKID.ConfigResponseMode.Callback,
      scope: 'phone',
   })

   try {
      const payload = await VKID.Auth.login()
      getVKtokens(payload)
   }
   catch (error) {
      emit('error', error)
   }
}

async function getVKtokens(payload) {
   try {
      const authData = await VKID.Auth.exchangeCode(payload.code, payload.device_id)
      emit('success', authData.access_token)
   } catch (error) {
      emit('error', error)
   }
}
</script>

<template>
   <BaseButton :click="loginVK"
               class="VkIdWebSdk__button">
      <svg width="28"
           height="28"
           viewBox="0 0 28 28"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd"
               clip-rule="evenodd"
               d="M4.54648 4.54648C3 6.09295 3 8.58197 3 13.56V14.44C3 19.418 3 21.907 4.54648 23.4535C6.09295 25 8.58197 25 13.56 25H14.44C19.418 25 21.907 25 23.4535 23.4535C25 21.907 25
           19.418 25 14.44V13.56C25 8.58197 25 6.09295 23.4535 4.54648C21.907 3 19.418 3 14.44 3H13.56C8.58197 3 6.09295 3 4.54648 4.54648ZM6.79999 10.15C6.91798 15.8728 9.92951 19.31 14.8932 19.31H15.1812V16.05C16.989 16.2332 18.3371
           17.5682 18.8875 19.31H21.4939C20.7869 16.7044 18.9535 15.2604 17.8141 14.71C18.9526 14.0293 20.5641 12.3893 20.9436 10.15H18.5722C18.0747 11.971 16.5945 13.6233 15.1803 13.78V10.15H12.7711V16.5C11.305 16.1337 9.39237 14.3538 9.314 10.15H6.79999Z"
               fill="white" />
      </svg>
      <div>
         Войти с VK ID
      </div>
   </BaseButton>
</template>

<style scoped>
.VkIdWebSdk__button {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 15px;
   background: #0077ff;
   transition: all .1s ease-out;
   border-radius: 8px;
   min-height: 44px;
   min-width: 300px;
   font-weight: 500;
}

.VkIdWebSdk__button:hover {
   background: #0077ff;
   opacity: 0.8;
}

.VkIdWebSdk__button:active {
   opacity: .7;
   transform: scale(.97);
}
</style>