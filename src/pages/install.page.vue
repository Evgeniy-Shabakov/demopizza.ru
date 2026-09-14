<script setup>
const brandName = import.meta.env.VITE_BRAND_NAME
</script>

<template>
   <div class="flex-1 flex flex-col">
      <PageHeader>
         <div>Установка приложения</div>
         <div class="flex justify-center items-center gap-2">
            <div class="text-2xl">{{ brandName }}</div>
            <img class="size-7"
                 src="/logo.png">
         </div>
      </PageHeader>

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
   </div>

   <BottomBar />
</template>