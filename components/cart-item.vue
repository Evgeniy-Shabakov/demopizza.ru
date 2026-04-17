<script setup>
import {
   minusProductInCartForCartPanel,
   plusProductToCart, removeProductFromCart,
} from '~/js/client-helper.js'
import { findProductById } from '~/js/models/product'
import { serverApiUrl, serverUrl } from '~/env.js'

const props = defineProps(['productOrUserConfig'])

const product = props.productOrUserConfig.userConfigID ?
   findProductById(props.productOrUserConfig.id) : props.productOrUserConfig

const userConfig = props.productOrUserConfig.userConfigID ? props.productOrUserConfig : null

const imagePath = serverUrl + '/' + props.productOrUserConfig.imagePath.replace(/^storage\/public\/?/, '')

</script>

<template>

   <div class="grid grid-cols-[100px_1fr_1fr] 
               text-sm minxs:text-base
               gap-1 minxs:gap-3 xs:gap-4 items-center">

      <section class="row-span-2">

         <img class="w-full aspect-square"
              :src="imagePath">

         <IngredientsMini v-if="productOrUserConfig.userConfigID"
                          :baseIngredients="productOrUserConfig.baseIngredients"
                          :additionalIngredients="productOrUserConfig.additionalIngredients" />

      </section>

      <div>{{ productOrUserConfig.name }}</div>

      <BaseButton :click="() => removeProductFromCart(product, userConfig)"
                  class="justify-self-end btn-icon-trash">
         <IconTrash class="h-5 w-5" />
      </BaseButton>

      <div class="flex items-center gap-1.5 whitespace-nowrap">
         <BaseButton :isIcon="true"
                     :click="() => minusProductInCartForCartPanel(product, userConfig)">
            <IconMinus class="h-6 w-6" />
         </BaseButton>
         <div>{{ productOrUserConfig.countInCart }}</div>
         <BaseButton :isIcon="true"
                     :click="() => plusProductToCart(product, userConfig)">
            <IconPlus class="h-6 w-6" />
         </BaseButton>
         <div>x {{ Number(productOrUserConfig.priceDefault) }}р</div>
      </div>

      <div class="justify-self-end whitespace-nowrap">
         {{ Number(productOrUserConfig.countInCart) * Number(productOrUserConfig.priceDefault) }}р
      </div>

   </div>

</template>

<style scoped>
.btn-icon-trash {
   padding: 6px;
}
</style>