<script setup>
import { Download } from '@lucide/vue'
import { installPrompt } from '@/helpers/pwa/pwa-btn-initialize'
import { detectBrowser, isPWA } from '@/helpers/pwa/enviroment-detecting'

const router = useRouter()
function install() {
   if (detectBrowser() == BROWSER_TYPE.YANDEX) {
      navigateTo('/install')
      return
   }

   if (installPrompt.value) installPrompt.value.prompt()
   else navigateTo('/install')
}

const isPWAdetect = isPWA()
</script>

<template>
   <ButtonLg v-if="!isPWAdetect"
             @click="install">
      <Download class="size-5" />
      Установить мобильное <br> приложение
   </ButtonLg>
</template>