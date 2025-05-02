<script setup>
import { minusProductInCartForMenuPage, plusProductToCart, removeProductFromCart } from '~/js/client-helper.js'
import { rerecordProductWithUserConfigs } from '~/js/save/user-configs-products.js'

const props = defineProps(['product', 'userConfig', 'index'])

const baseIngredients = props.userConfig ? props.userConfig.baseIngredients : props.product.base_ingredients

const additionalIngredients = props.userConfig ? props.userConfig.additionalIngredients : []

const price = computed(() => {
   if (!props.userConfig) return props.product.price_default

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

</script>

<template>

   <!-- id нужен для прокрутки к новой карточке продукта после создания новой конфигурации -->
   <article :id="`${product.id}${userConfig ? '-' + userConfig.userConfigID : ''}`"
            class="product-card">

      <div class="product-card__image-and-ingredients">

         <img class="product-card__product-image"
              :class="product.is_in_stop_list ? 'product-card__product-image--stop-list' : ''"
              :src="product.image_url"
              alt="">

         <!-- <IngredientsMini :baseIngredients="baseIngredients"
                          :additionalIngredients="additionalIngredients" /> -->

         <!-- <NuxtLink v-if="product.base_ingredients.length > 0 || product.additional_ingredients.length > 0"
                      class="product-card__btn-edit"
                      :to="{
                        name: 'product-ingredients-editor',
                        params:
                        {
                           id: product.id,
                           userConfigIndex: index >= 0 ? index : null
                        }
                     }">
            изменить
         </NuxtLink> -->

      </div>

      <p class="product-card__title-btn-delete">
         <span class="product-card__title">{{ product.title }}</span>

         <button class="product-card__btn-delete"
                 v-if="userConfig"
                 @click=deleteUserConfig>
            <i class="fa-solid fa-trash-can"></i>
         </button>
      </p>

      <p class="product-card__description-short"
         :class="{ 'product-card__description-short--user-config': userConfig }">
         <span v-if="userConfig">
            {{ product.title }} с Вашей конфигурацией. Можно удалить или создать новую
         </span>
         <span v-else>{{ product.description_short }}</span>
      </p>

      <div class="product-card__price-and-btn">

         <p class="product-card__price"> {{ Number(price) }} р.</p>

         <div v-if="product.is_in_stop_list"
              class="product-card__text-for-stop-list">
            Будет позже
         </div>

         <button v-else-if="!product.allIngredientIsAvailable && !userConfig"
                 class="product-card__icon-info">
            <i class="fas fa-info-circle"></i>
            <!-- <DialogMiniInfo right = 0 bottom=0>
               Не все ингредиенты доступны для заказа.
               Но вы можете изменить ингредиенты и добавить в корзину товары с новыми ингредиентами
            </DialogMiniInfo> -->
         </button>

         <template v-else>
            <button v-if="
               (userConfig && (userConfig.countInCart == 0 || userConfig.countInCart == undefined))
               ||
               (!userConfig && (product.countInCart == 0 || product.countInCart == undefined))"
                    class="product-card__btn-in-cart btn btn-submit"
                    @click="plusProductToCart(product, userConfig)"
                    type="button">В корзину
            </button>

            <div v-else
                 class="product-card__plus-count-minus">
               <button class="product-card__btn-plus-minus btn btn-submit"
                       @click="minusProductInCartForMenuPage(product, userConfig)">
                  <i class="fa-solid fa-minus"></i>
               </button>
               <div v-if="userConfig">{{ userConfig.countInCart }}</div>
               <div v-else>{{ product.countInCart }}</div>
               <button class="product-card__btn-plus-minus btn btn-submit"
                       @click="plusProductToCart(product, userConfig)">
                  <i class="fa-solid fa-plus"></i>
               </button>
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

   background-color: white;
   border-radius: .5rem;
   --tw-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
   --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
   box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.product-card__product-image {
   width: 100%;
   aspect-ratio: 1/1;
}

.product-card__product-image--stop-list {
   filter: grayscale(80%);
}

/*чтобы работало только на компе с мышкой */
@media (hover: hover) {
   .product-card__btn-delete:hover {
      color: var(--brand-color-hover);
   }
}

.product-card__btn-delete:active {
   color: var(--brand-color-active);
}

.product-card__btn-edit {
   display: inline-block;
   text-decoration: none;
   border: 2px solid var(--brand-color);
   border-radius: 15px;
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

.product-card__btn-delete,
.product-card__btn-in-cart,
.product-card__btn-plus-minus {
   position: relative;
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

.product-card__title-btn-delete {
   margin-top: 20px;
   display: flex;
   justify-content: space-between;
   gap: 5px;
   /* border: 1px solid; */
}

.product-card__title {
   font-size: 20px;
   line-height: 24px;
   font-weight: 550;
   /* border: 1px solid; */
   overflow: hidden;
   text-overflow: ellipsis;

}

.product-card__btn-delete {
   border: 0;
   background-color: transparent;
   color: red;
   font-size: 16px;
   padding: 5px 5px 5px 5px;
   width: max-content;
   height: max-content;
}

.product-card__description-short {
   margin-top: 10px;
   font-size: 14px;
   color: grey;
   margin-bottom: 30px;
}

.product-card__description-short--user-config {
   color: green;
   font-weight: 500;
}

.product-card__price-and-btn {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: auto;
}

.product-card__price {
   font-size: 17px;
   white-space: nowrap;
}

.product-card__plus-count-minus {
   display: flex;
   align-items: center;
   gap: 5px;
   font-size: 17px;
}

.product-card__text-for-stop-list {
   font-size: 15px;
   background-color: rgba(128, 128, 128, 0.4);
   padding: 8px 12px;
   border-radius: 30px;
}

.product-card__icon-info {
   position: relative;
   font-size: 25px;
   color: var(--brand-color);
   background-color: transparent;
   border: 0;
}

@media (hover: hover) {
   .product-card__icon-info:hover {
      color: var(--brand-color-hover);
   }
}

.product-card__icon-info:active {
   color: var(--brand-color-active);
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

   .product-card__image-and-ingredients {
      grid-row: span 3;
   }

   .product-card__title-btn-delete {
      margin-top: 0px;
   }

   .product-card__description-short {
      margin-top: 0px;
      margin-bottom: 0px;
   }

   .product-card__price-and-btn {
      margin-top: 0;
      align-self: flex-end;
   }
}
</style>