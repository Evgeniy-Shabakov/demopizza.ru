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

   <div class="bg-(--background-page-elements-color) 
               text-(--bottom-nav-color)
               border-t border-(--bottom-nav-color)
               fixed bottom-0 w-full h-12 flex
               md:hidden">

      <button class="flex-1 flex justify-center items-center cursor-pointer
                     hover:text-(--brand-color) active:text-(--brand-color)"
              @click="btnTopPressed()">
         <IconCircleUp />
      </button>

      <NuxtLink class="flex-1 flex justify-center items-center 
                       hover:text-(--brand-color) active:text-(--brand-color)"
                to="/user">
         <IconUser />
      </NuxtLink>

      <NuxtLink class="flex-1 flex justify-center items-center 
                       hover:text-(--brand-color) active:text-(--brand-color)"
                to="/cart">
         <IconCart />
      </NuxtLink>

   </div>

</template>
