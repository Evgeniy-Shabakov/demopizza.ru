<script setup>
import { company } from '@/composables/use-company'
import { serverOrigin } from '@/api/api'
</script>

<template>
   <header class="lg:hidden">

      <div class="flex items-center justify-between">

         <div class="flex items-center gap-2">
            <img :src="`${serverOrigin}/images/logo.png`"
                 class="size-8 object-contain" />
             <span class="font-bold text-2xl">{{ company?.brandName }}</span>
         </div>

         <BurgerMenu />

      </div>

   </header>
</template>
