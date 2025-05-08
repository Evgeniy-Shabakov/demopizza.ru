<script setup>
</script>

<template>

   <div class="fixed inset-0 bottom-[48px] lg:bottom-0
             bg-gray-200/35 z-30  
               flex items-center justify-center"
        @click="navigateTo('/', { scroll: false })">

      <div class="w-full h-full lg:w-[600px] lg:h-[600px]
                  bg-(--background-page-elements-color)
                  lg:border lg:border-(--brand-color) lg:rounded-(--border-radius-main)
                  my-container"
           @click.stop>

         <slot />

      </div>

   </div>

</template>

<style scoped></style>