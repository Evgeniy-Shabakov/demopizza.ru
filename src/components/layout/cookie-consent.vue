<script setup>
import { Cookie, CircleCheck } from '@lucide/vue'
import { isCookieConsentAccepted } from '@/composables/use-cookie-consent'

function acceptCookieConsent() {
   isCookieConsentAccepted.value = true
}
</script>

<template>
   <div v-if="!isCookieConsentAccepted"
        id="cookie-consent"
        class="fixed bottom-12 inset-x-0 z-40 border-t bg-background">

      <ContainerX>

         <div class="p-4 flex flex-col gap-1">
            <div class="flex items-center justify-center gap-2">
               <Cookie class="size-4 text-primary" />
               <h2 class="text-base font-semibold">Файлы cookie</h2>
            </div>
            <p class="text-sm leading-5 text-foreground mb-2">
               Мы используем файлы cookie, чтобы сайт и мобильное приложение работали
               корректно. Нажимая «Принять», вы соглашаетесь с
               <BaseLink to="/legal-documents">
                  политикой обработки персональных данных
               </BaseLink>.
            </p>
<Button class="w-full"
                     size="lg"
                     @click="acceptCookieConsent">
               <CircleCheck class="size-5" />
               Принять
            </Button>
         </div>

      </ContainerX>

   </div>
</template>