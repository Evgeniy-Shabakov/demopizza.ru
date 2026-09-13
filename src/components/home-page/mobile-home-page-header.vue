<script setup>
const brandName = import.meta.env.VITE_BRAND_NAME
</script>

<template>
   <header class="lg:hidden">

      <div class="flex items-center justify-between">

         <div class="flex items-center gap-2">
            <img src="/logo.png"
                 class="size-8 object-contain" />
             <span class="font-bold text-2xl">{{ brandName }}</span>
         </div>

         <BurgerMenu />

      </div>

   </header>
</template>
