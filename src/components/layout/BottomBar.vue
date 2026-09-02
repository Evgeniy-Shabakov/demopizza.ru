<template>

   <div class="fixed bottom-12 inset-x-0 border-t bg-background">

      <ContainerX>

         <div class="h-17 p-2 flex items-center ">

            <slot />

            <ButtonLgWfull v-if="!$slots.default"
                           @click="$router.back()">
               Назад
            </ButtonLgWfull>

         </div>

      </ContainerX>

   </div>

</template>
