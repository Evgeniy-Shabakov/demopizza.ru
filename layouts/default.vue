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

   <!-- <cookies></cookies> -->

   <slot></slot>

   <div class="flex h-12 bg-white fixed bottom-0 border-t border-gray-400 w-full md:hidden">

      <NuxtLink class="flex-1 flex justify-center items-center"
                @click="btnTopPressed()">
         <IconCircleUp />
      </NuxtLink>

      <NuxtLink class="flex-1 flex justify-center items-center"
                to="/user">
         <IconUser />
      </NuxtLink>

      <NuxtLink class="flex-1 flex justify-center items-center"
                to="/cart">
         <IconCart />
      </NuxtLink>

   </div>

   <!-- <DialogMini /> -->

</template>
