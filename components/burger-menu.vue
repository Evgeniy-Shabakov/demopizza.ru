<script setup>
import { company } from '~/js/axios-helper'
import { formatPhone } from '~/js/phone-helper'
import { installPrompt } from '/plugins/before-install-prompt.client'
import { isPWA } from '~/js/enviroment-detecting'

const burgerMenuIsOpen = ref(false)

function toggleBurgerMenu() {
   if (burgerMenuIsOpen.value) closeBurgerMenu()
   else activateBurgerMenu()
}

function activateBurgerMenu() {
   if (burgerMenuIsOpen.value) return

   burgerMenuIsOpen.value = true

   document.addEventListener('click', closeBurgerMenu)
   document.addEventListener('scroll', closeBurgerMenu)
}

function closeBurgerMenu() {
   burgerMenuIsOpen.value = false
   document.removeEventListener('click', closeBurgerMenu)
   document.removeEventListener('scroll', closeBurgerMenu)
}

function btnInstallHandler() {
   if (installPrompt.value) installPrompt.value.prompt()
   else navigateTo('/install')
}

const isPWAdetect = isPWA()
</script>

<template>
   <div class="w-7 h-7">

      <button @click="toggleBurgerMenu"
              @click.stop>
         <IconXmark v-if="burgerMenuIsOpen"
                    class="w-7 h-7 text-(--brand-color)" />
         <IconBurgerMenu v-else
                         class="w-7 h-7 text-(--brand-color)" />

      </button>

      <div v-if="burgerMenuIsOpen"
           class="fixed top-12 right-0 z-20 p-2 bg-(--brand-color-active) rounded-(--border-radius-main)"
           @click.stop>

         <div class="flex flex-col gap-2 text-xl text-center text-(--text-color-on-brand-color)">

            <CitySelecte />

            <div class="flex items-center justify-between">
               <IconClock />
               <span>
                  <template v-if="company.open_time && company.close_time">
                     {{ company.open_time }} - {{ company.close_time }}
                  </template>
                  <template v-else>
                     Круглосуточно
                  </template>
               </span>
            </div>

            <div class="bg-(--brand-color-hover) p-2 rounded-(--border-radius-main)">
               <a v-if="company && company.phone"
                  :href="`tel:${company.phone}`"
                  target="_blank"
                  class="flex items-center justify-between gap-4">

                  <IconPhone class="h-6" />
                  <span>{{ formatPhone(company.phone) }}</span>

               </a>
            </div>

            <BaseButton v-if="!isPWAdetect"
                        class="btn-install"
                        :click="btnInstallHandler">
               Установить <br> мобильное приложение
            </BaseButton>

            <NuxtLink class="text-base underline active:text-black block"
                      to='/delivery-and-payment'
                      @click="closeBurgerMenu">
               Доставка и оплата
            </NuxtLink>

            <NuxtLink class="text-base underline active:text-black"
                      to='/legal-documents'
                      @click="closeBurgerMenu">
               Правовая информация
            </NuxtLink>

            <div class="text-sm">
               <span>Сделано на платформе</span>
               <NuxtLink class="underline active:text-black ml-2"
                         to='https://food-it.ru'
                         target="_blank"
                         @click="closeBurgerMenu">
                  food-it.ru
               </NuxtLink>
            </div>

         </div>

      </div>
   </div>

</template>

<style scoped>
.btn-install {
   font-size: 16px;
   background-color: var(--brand-color-hover);
}
</style>
