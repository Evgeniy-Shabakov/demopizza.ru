<script setup>
import {
   minusProductInCartForCartPanel,
   plusProductToCart, removeProductFromCart,
} from '~/js/client-helper.js'

defineProps(['productOrUserConfig'])

</script>

<template>

   <div class="grid grid-cols-[100px_1fr_1fr] 
               text-sm minxs:text-base
               gap-1 minxs:gap-3 xs:gap-4 items-center">

      <section class="row-span-2">

         <img class="w-full aspect-square"
              :src="productOrUserConfig.image_url">

         <IngredientsMini v-if="productOrUserConfig.userConfigID"
                          :baseIngredients="productOrUserConfig.baseIngredients"
                          :additionalIngredients="productOrUserConfig.additionalIngredients" />

      </section>

      <div>{{ productOrUserConfig.title }}</div>

      <BaseButton :click="() => removeProductFromCart(productOrUserConfig)"
                  class="justify-self-end btn-icon-trash">
         <IconTrash class="h-4 w-4" />
      </BaseButton>

      <div class="flex items-center gap-1.5 whitespace-nowrap">
         <BaseButton :isIcon="true"
                     :click="() => minusProductInCartForCartPanel(productOrUserConfig)">
            <IconMinus class="h-5 w-5" />
         </BaseButton>
         <div>{{ productOrUserConfig.countInCart }}</div>
         <BaseButton :isIcon="true"
                     :click="() => plusProductToCart(productOrUserConfig)">
            <IconPlus class="h-5 w-5" />
         </BaseButton>
         <div>x {{ Number(productOrUserConfig.price_default) }}р</div>
      </div>

      <div class="justify-self-end whitespace-nowrap">
         {{ Number(productOrUserConfig.countInCart) * Number(productOrUserConfig.price_default) }}р
      </div>

   </div>

</template>

<style scoped>
.btn-icon-trash {
   padding: 6px;
}
</style>