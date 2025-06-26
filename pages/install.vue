<script setup>
import { installPrompt } from '/plugins/before-install-prompt.client'
import { OS_TYPE } from '~/js/data-types/os-type'
import { BROWSER_TYPE } from '~/js/data-types/browser-type'
import { detectOS, detectBrowser } from '~/js/enviroment-detecting'

const OS = detectOS()
const Browser = detectBrowser()

</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">
         Установка приложения
      </h1>

      <div class="space-y-5 px-5">

         <div class="">
            <div class="text-sm mb-2 text-center">
               Для установки мобильного приложения мы используем технологию Progressive Web Apps (PWA)
            </div>
            <ol class=" w-max mx-auto list-disc list-inside space-y-2 marker:text-green-500 marker:font-bold">
               <li>Занимает менее 10MB</li>
               <li>Не требует обновлений</li>
               <li>Защита по технологии HTTPS</li>
            </ol>
         </div>

         <div v-if="!installPrompt">

            <h2 class="text-center font-bold mb-2">Как установить?</h2>

            <ol class="list-decimal list-inside space-y-2 marker:text-blue-500 marker:font-bold">

               <template v-if="OS == OS_TYPE.IOS">

                  <template v-if="Browser == BROWSER_TYPE.CHROME">

                     <li>
                        Справа от адресной строки нажмите на значок "Поделиться"
                        <img src="/assets/icons/safari-share.png"
                             class="inline bg-gray-200 w-6">
                     </li>
                     <li>Добавить на главный экран</li>
                     <li>Подтвердите сведения о сайте и нажмите Добавить</li>

                  </template>

                  <template v-else>

                     <li v-if="Browser != BROWSER_TYPE.SAFARI">
                        Откройте сайт в браузере Safari
                        <img src="/assets/icons/safari.png"
                             class="inline w-6">
                     </li>
                     <li>
                        Нажмите кнопку "Поделиться"
                        <img src="/assets/icons/safari-share.png"
                             class="inline bg-gray-200 w-6">
                     </li>
                     <li>Выберите опцию "На экран "Домой"</li>
                     <li>Нажмите "Добавить" в правом верхнем углу экрана</li>

                  </template>

               </template>

               <template v-else>

                  <li v-if="Browser != BROWSER_TYPE.CHROME">
                     Откройте сайт в браузере Chrome
                     <img src="/assets/icons/google-chrome.png"
                          class="inline">
                  </li>
                  <li>
                     Справа от адресной строки нажмите на значок с тремя точками
                     <img src="/assets/icons/google-option.png"
                          class="inline bg-gray-200">
                  </li>
                  <li>Добавить на главный экран</li>
                  <li>Установить</li>

               </template>

            </ol>

         </div>

      </div>

      <template #actions>

         <BaseButton v-if="installPrompt"
                     class="base-btn-in-popup-page"
                     :click="() => installPrompt.prompt()">
            Установить на {{ OS }}
         </BaseButton>

         <BaseButton v-else
                     class="base-btn-in-popup-page"
                     :click="() => navigateTo('/')">
            На главную
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>