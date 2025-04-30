<script setup>
import { totalCountInCart } from '~/js/client-helper.js'

const route = useRoute()

//функция вместо якорных ссылок, т.к. якорные ссылки не работают с контроллером меню
function btnTopPressed() {
   if (route.name == 'index') {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      })
   }
   else {
      navigateTo('/')
   }
}

</script>

<template>

   <div class="bg-[var(--background_page_elements_color)] 
               text-[var(--bottom_nav_color)]
               border-t border-[var(--bottom_nav_color)]
               fixed bottom-0 w-full h-12 flex
               md:hidden">

      <button class="flex-1 flex justify-center items-center cursor-pointer
                     hover:text-[var(--brand-color)] active:text-[var(--brand-color)]"
              @click="btnTopPressed()">
         <IconCircleUp />
      </button>

      <NuxtLink class="flex-1 flex justify-center items-center 
                       hover:text-[var(--brand-color)] active:text-[var(--brand-color)]"
                to="/user">
         <IconUser />
      </NuxtLink>

      <NuxtLink class="flex-1 flex justify-center items-center 
                       hover:text-[var(--brand-color)] active:text-[var(--brand-color)]"
                to="/cart">
         <IconCart />
      </NuxtLink>

   </div>

</template>
