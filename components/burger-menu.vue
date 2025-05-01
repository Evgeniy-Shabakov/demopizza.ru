<script setup>
import { company } from '~/js/axios-helper'
import { formatPhone } from '~/js/phone-helper'

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
</script>

<template>
   <div class="w-7 h-7">

      <button @click="toggleBurgerMenu"
              @click.stop>
         <IconXmark v-if="burgerMenuIsOpen"
                    class="w-7 h-7 text-[var(--brand-color)]" />
         <IconBurgerMenu v-else
                         class="w-7 h-7 text-[var(--brand-color)]" />

      </button>

      <div v-if="burgerMenuIsOpen"
           class="fixed top-12 right-0 p-2 bg-[var(--brand-color)] rounded-[var(--border-radius-main)]"
           @click.stop>

         <div class="space-y-3 text-xl text-center text-[var(--text-color-on-brand-color)]">

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

            <div class="bg-[var(--brand-color-hover)] p-2 rounded-[var(--border-radius-main)]">
               <a v-if="company && company.phone"
                  :href="`tel:${company.phone}`"
                  target="_blank"
                  class="flex items-center justify-between gap-4">

                  <IconPhone class="h-6" />
                  <span>{{ formatPhone(company.phone) }}</span>

               </a>
            </div>

            <NuxtLink class="text-base underline active:text-black"
                      to='/legal-documents'>
               Правовая информация
            </NuxtLink>

         </div>

      </div>
   </div>

</template>
