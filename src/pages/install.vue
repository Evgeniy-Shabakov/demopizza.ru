<script setup>
import { installPrompt } from '/plugins/before-install-prompt.client'
import { OS_TYPE } from '~/js/data-types/os-type'
import { BROWSER_TYPE } from '~/js/data-types/browser-type'
import { detectOS, detectBrowser } from '~/js/enviroment-detecting'
import { brandName, linkInstallApp } from '../env'

const OS = detectOS()
const Browser = detectBrowser()

const isAboutInstall = ref(false)

function copyLink() {
   navigator.clipboard.writeText(linkInstallApp)

   const msg = document.createElement('div')
   msg.innerText = 'Скопировано!'
   msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 9999;
        white-space: nowrap;
    `
   document.body.appendChild(msg)

   setTimeout(() => msg.remove(), 1000)
}
</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">
         <div>Установка приложения</div>
         <div class="flex justify-center items-center gap-2">
            <div class="text-2xl">{{ brandName }}</div>
            <img class="size-7"
                 src="/logo.png">
         </div>
      </h1>

      <div class="space-y-5 px-5">

         <div v-if="!installPrompt || Browser == BROWSER_TYPE.YANDEX">

            <div v-if="OS == OS_TYPE.IOS">

               <div v-if="Browser == BROWSER_TYPE.SAFARI">
                  <ol class="list-decimal px-4 space-y-2 marker:text-blue-500 marker:font-bold">
                     <li>
                        Нажмите кнопку "Поделиться" внизу экрана
                        <img src="/assets/icons/safari-share.png"
                             class="ml-2 inline size-6 bg-gray-200">
                     </li>
                     <li>Выберите опцию "На экран "Домой"</li>
                     <li>Нажмите "Добавить" в правом верхнем углу</li>
                  </ol>
               </div>

               <div v-if="Browser == BROWSER_TYPE.CHROME">
                  <ol class="list-decimal px-4 space-y-2 marker:text-blue-500 marker:font-bold">
                     <li>
                        Справа от адресной строки нажмите на значок "Поделиться"
                        <img src="/assets/icons/safari-share.png"
                             class="ml-2 inline size-6 bg-gray-200">
                     </li>
                     <li>Выбирите опцию "Добавить на главный экран"</li>
                     <li>Нажмите "Добавить" в правом верхнем углу</li>
                  </ol>
               </div>

               <div v-else>

                  <ol class="list-decimal px-4 space-y-2 marker:text-blue-500 marker:font-bold">
                     <li>
                        <span>Откройте ссылку</span>
                        <div @click="copyLink"
                             class="text-blue-600 underline cursor-pointer hover:text-blue-800 break-all">
                           {{ linkInstallApp }}
                        </div>
                        <span>в браузере Safari</span>
                        <img src="/assets/icons/safari.png"
                             class="ml-2 inline size-6">
                     </li>
                     <li>
                        Следуйте инструкциям
                     </li>
                  </ol>

                  <div class="mt-4 flex flex-col gap-4">
                     <BaseButton :click="() => copyLink()">
                        Скопировать ссылку
                     </BaseButton>
                  </div>

               </div>

            </div>

            <div v-else>

               <div v-if="Browser == BROWSER_TYPE.CHROME">

                  <ol class="list-decimal px-4 space-y-2 marker:text-blue-500 marker:font-bold">
                     <li>
                        Справа от адресной строки нажмите на значок с тремя точками
                        <img src="/assets/icons/google-option.png"
                             class="ml-2 inline size-6 bg-gray-200">
                     </li>
                     <li>Добавить на главный экран</li>
                     <li>Установить</li>
                  </ol>

               </div>

               <div v-else>

                  <ol class="list-decimal px-4 space-y-2 marker:text-blue-500 marker:font-bold">
                     <li>
                        <span>Откройте ссылку</span>
                        <div @click="copyLink"
                             class="text-blue-600 underline cursor-pointer hover:text-blue-800 break-all">
                           {{ linkInstallApp }}
                        </div>
                        <span>в браузере Chrome</span>
                        <img src="/assets/icons/google-chrome.png"
                             class="ml-2 inline size-6">
                     </li>
                     <li>
                        Нажмите "Установить на {{ OS }}"
                     </li>
                  </ol>

                  <div class="mt-4 flex flex-col gap-4">
                     <BaseButton :click="() => copyLink()">
                        Скопировать ссылку
                     </BaseButton>
                  </div>

               </div>

            </div>

            <div class="mt-4 space-y-4">
               <div @click="isAboutInstall = !isAboutInstall"
                    class="text-center text-blue-600 underline cursor-pointer hover:text-blue-800 break-all">
                  Подробнее об установке
               </div>

               <div v-if="isAboutInstall"
                    class="space-y-3">
                  <div class="text-sm text-center">
                     Для установки мобильного приложения мы используем технологию Progressive Web Apps (PWA)
                  </div>
                  <ol class="w-max mx-auto list-disc list-inside space-y-2 marker:text-green-500">
                     <li>Занимает менее 10MB</li>
                     <li>Не требует обновлений</li>
                     <li>Защита по технологии HTTPS</li>
                  </ol>
                  <div class="text-sm text-center text-(--danger-color)">
                     Не все браузеры поддерживают установку PWA приложений <br>
                     Рекомендуется установка через Chrome и Safari
                  </div>
               </div>
            </div>

         </div>

         <div v-else>
            <div class="text-sm mb-2 text-center">
               Для установки мобильного приложения мы используем технологию Progressive Web Apps (PWA)
            </div>
            <ol class="w-max mx-auto list-disc list-inside space-y-2 marker:text-green-500 ">
               <li>Занимает менее 10MB</li>
               <li>Не требует обновлений</li>
               <li>Защита по технологии HTTPS</li>
            </ol>
         </div>

      </div>

      <template #actions>

         <BaseButton v-if="installPrompt && Browser != BROWSER_TYPE.YANDEX"
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