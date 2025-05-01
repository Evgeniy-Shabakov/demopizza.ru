<script setup>
import { BaseLink } from '#components'
import { COOKIE_NAME } from '~/js/strings/cookie-name.js'

const isCookiesAccepted = ref(false)

if (localStorage.getItem(COOKIE_NAME.COOKIES_ACCEPTED)) {
   isCookiesAccepted.value = localStorage.getItem(COOKIE_NAME.COOKIES_ACCEPTED)
}

function btnCloseCookiesPressed() {
   isCookiesAccepted.value = true
   localStorage.setItem(COOKIE_NAME.COOKIES_ACCEPTED, true)
}

</script>

<template>
   <div class="bg-[var(--background_page_elements_color)]"
        v-if="isCookiesAccepted == false">

      <div class="my-container">

         <div class="flex gap-4 text-[10px] py-1  md:text-base">

            <button @click=btnCloseCookiesPressed
                    class="cursor-pointer">
               <IconXmark />
            </button>

            <div>

               Мы используем файлы cookies для быстрой и удобной работы сайта и мобильного приложения.
               Продолжая пользоваться сайтом и мобильным приложением, вы принимаете

               <BaseLink to="/legal-documents">
                  условия обработки персональных данных
               </BaseLink>

            </div>
         </div>

      </div>

   </div>
</template>