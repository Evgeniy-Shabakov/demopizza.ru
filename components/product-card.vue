<script setup>
import { minusProductInCartForMenuPage, plusProductToCart, removeProductFromCart } from '~/js/client-helper.js'
import { rerecordProductWithUserConfigs } from '~/js/save/user-configs-products.js'
import { serverUrl } from '~/env.js'

const props = defineProps(['product', 'userConfig', 'index'])

const baseIngredients = props.userConfig ? props.userConfig.baseIngredients : props.product.base_ingredients

const additionalIngredients = props.userConfig ? props.userConfig.additionalIngredients : []

const price = computed(() => {
   if (!props.userConfig) return props.product.priceDefault

   let total = 0

   props.userConfig.additionalIngredients.forEach(element => {
      total += Number(element.ingredient.price_default) * element.quantity
   })

   props.userConfig.baseIngredients.forEach(element => {
      total += Number(element.ingredient.additionalPrice)
   })

   total += Number(props.product.price_default)

   props.userConfig.price_default = total //записываем цену в userConfig для корзины

   return total
})

function deleteUserConfig() {
   removeProductFromCart(null, props.userConfig)

   const index = props.product.userConfigs.findIndex(config => config.userConfigID == props.userConfig.userConfigID)
   props.product.userConfigs.splice(index, 1)

   rerecordProductWithUserConfigs(props.product)
}

const imagePath = serverUrl + '/' + props.product.imagePath.replace(/^storage\/public\/?/, '')


</script>

<template>

   <!-- id нужен для прокрутки к новой карточке продукта после создания новой конфигурации -->
   <article :id="`${product.id}${userConfig ? '-' + userConfig.userConfigID : ''}`"
            class="product-card shadow-md">

      <div class="row-span-3">

         <img class="w-full aspect-[1/1]"
              :class="product.isInStopListForSelectedCity ? 'grayscale-80' : ''"
              :src="imagePath">

         <IngredientsMini class="mt-2"
                          :baseIngredients="baseIngredients"
                          :additionalIngredients="additionalIngredients" />

         <NuxtLink v-if="product.base_ingredients?.length > 0 || product.additional_ingredients?.length > 0"
                   class="product-card__btn-edit"
                   :to="`/product/${product.id}/ingredients-editor-${index >= 0 ? index : 'base'}`">
            изменить
         </NuxtLink>

      </div>

      <p class="flex items-center justify-between gap-1">
         <span class="text-[20px] leading-[24px] font-[550] overflow-hidden overflow-ellipsis">
            {{ product.name }}
         </span>

         <button class="relative text-(--danger-color)
                        hover:text-(--brand-color-hover) active:text-(--brand-color-active)"
                 v-if="userConfig"
                 @click=deleteUserConfig>
            <IconTrash />
         </button>

      </p>

      <p class="text-sm text-(--text-color-main)/60"
         :class="{ 'text-(--text-color-accent)': userConfig }">
         <span v-if="userConfig">
            {{ product.name }} с Вашей конфигурацией. Можно удалить или создать новую
         </span>
         <span v-else>{{ product.descriptionShort }}</span>
      </p>

      <div class="flex items-center justify-between mt-auto">

         <p> {{ Number(price) }}р.</p>

         <BaseButton v-if="product.isInStopListForSelectedCity"
                     :active=false>
            Будет позже
         </BaseButton>

         <!-- <button v-else-if="!product.allIngredientIsAvailable && !userConfig"
                 class="relative text-(--brand-color)
                        hover:text-(--brand-color-hover) active:text-(--brand-color-active)">
            <IconInfoCircle />
            <DialogMiniInfo right=0
                            bottom=0>
               Не все ингредиенты доступны для заказа.
               Но вы можете изменить ингредиенты и добавить в корзину товары с новыми ингредиентами
            </DialogMiniInfo>
         </button> -->

         <template v-else>
            <BaseButton v-if="
               (userConfig && (userConfig.countInCart == 0 || userConfig.countInCart == undefined))
               ||
               (!userConfig && (product.countInCart == 0 || product.countInCart == undefined))"
                        class=""
                        :click="() => plusProductToCart(product, userConfig)">
               В корзину
            </BaseButton>

            <div v-else
                 class="flex items-center gap-1.5 h-10">
               <BaseButton :isIcon="true"
                           :click="() => minusProductInCartForMenuPage(product, userConfig)">
                  <IconMinus class="h-7 w-7" />
               </BaseButton>

               <div v-if="userConfig">{{ userConfig.countInCart }}</div>
               <div v-else>{{ product.countInCart }}</div>

               <BaseButton :isIcon="true"
                           :click="() => plusProductToCart(product, userConfig)">
                  <IconPlus class="h-7 w-7" />
               </BaseButton>
            </div>
         </template>

      </div>

   </article>

</template>

<style scoped>
.product-card {
   position: relative;
   /* для того чтобы сделать всю карточку ссылкой*/

   padding: 15px;
   display: flex;
   flex-direction: column;
   gap: 10px;

   background-color: var(--background-page-elements-color);
   border-radius: var(--border-radius-main);
}

@media (max-width: 447px) {
   .product-card {
      padding: 15px 8px;
      display: grid;
      column-gap: 15px;
      row-gap: 5px;
      grid-template-columns: 40% calc(60% - 15px);
      grid-template-rows: max-content max-content 1fr;
   }
}

.product-card__btn-edit {
   display: inline-block;
   border: 2px solid var(--brand-color);
   border-radius: var(--border-radius-main);
   background-color: var(--text-color-on-brand-color);
   color: var(--brand-color);
   font-size: 14px;
   padding: 5px;
   margin-top: 5px;
}

.product-card__btn-edit::after {
   /* для того чтобы сделать всю карточку ссылкой*/
   content: '';
   position: absolute;
   inset: 0 0 30% 0;
}

@media (hover: hover) {
   .product-card__btn-edit:hover {
      color: var(--brand-color-hover);
      border-color: var(--brand-color-hover);
   }
}

.product-card__btn-edit:active {
   color: var(--brand-color-hover);
   border-color: var(--brand-color-hover);
}
</style>