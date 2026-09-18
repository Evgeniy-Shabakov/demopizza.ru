<script setup>
import { Download } from '@lucide/vue'
import { installPrompt } from '@/pwa/helpers/pwa-btn-initialize'
import { BROWSER_TYPE, detectBrowser, isPWA } from '@/pwa/helpers/enviroment-detecting'

const router = useRouter()

function install() {
   if (detectBrowser() == BROWSER_TYPE.YANDEX) {
      router.push('/install')
      return
   }

   if (installPrompt.value) installPrompt.value.prompt()
   else router.push('/install')
}

const isPWAdetect = isPWA()
</script>

<template>
   <Button v-if="!isPWAdetect"
           class="h-14"
           @click="install">
      <Download class="size-5" />
      Установить мобильное <br> приложение
   </Button>
</template>