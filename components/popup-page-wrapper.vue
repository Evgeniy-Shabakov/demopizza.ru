<template>

   <div class="fixed inset-0 bottom-[48px] lg:bottom-0
             bg-gray-200/35 z-30  
               flex items-center justify-center"
        @click="navigateTo('/')">

      <div class="w-full h-full lg:w-[600px] lg:h-[600px]
                  bg-(--background-page-elements-color)
                  lg:border lg:border-(--brand-color) lg:rounded-(--border-radius-main)"
           @click.stop>

         <ContainerX class="h-[calc(100%-68px)] py-3 overflow-y-auto">

            <div class="sm:w-3/4 sm:mx-auto lg:w-full
                        flex flex-col gap-2">
               <slot />
            </div>

         </ContainerX>

         <ContainerX class="h-[68px] border-t border-(--bottom-nav-color)">

            <div class="h-[68px] sm:w-3/4 sm:mx-auto lg:w-full">
               <slot name="actions" />
            </div>

         </ContainerX>

      </div>

   </div>

</template>