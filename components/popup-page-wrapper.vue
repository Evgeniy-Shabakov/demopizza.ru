<script setup>
</script>

<template>

   <div class="fixed inset-0 bottom-[48px] lg:bottom-0
             bg-gray-200/35 z-30  
               flex items-center justify-center"
        @click="navigateTo('/', { scroll: false })">

      <div class="w-full h-full lg:w-[600px] lg:h-[600px]
                  bg-(--background-page-elements-color)
                  lg:border lg:border-(--brand-color) lg:rounded-(--border-radius-main)"
           @click.stop>

         <ContainerX class="h-[calc(100%-68px)] py-3 overflow-y-auto
                            flex flex-col gap-2">

            <slot />

         </ContainerX>

         <ContainerX class="h-[68px] border-t border-(--bottom-nav-color)">

            <slot name="actions" />
            
         </ContainerX>

      </div>

   </div>

</template>

<style scoped></style>