<script setup>
import {
   initializeUserBaseIngredientsForProductTemporary,
   initializeUserAdditonalIngredientsForProductTemporary,
   resetCurrentConfig
} from '~/js/ingredients-editor.js'
import { rerecordProductWithUserConfigs } from '~/js/save/user-configs-products.js'
import { findProductById } from '~/js/models/product'
import { createUserConfigForProduct } from '~/js/models/user-config'
import { previousRoute } from '~/middleware/previous-route.global'

const productID = Number(useRoute().params.id)
const userConfigIndex = useRoute().params.userConfigIndex == 'base'
   ? null
   : Number(useRoute().params.userConfigIndex)

const product = findProductById(productID)

//нужно если переход происходит с обновленной страницы добавления доп ингредиентов
if (!product.userBaseIngredientsTemporary) {
   initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
}

if (previousRoute.path == '/') {
   initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
   initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex)
}

const totalPrice = computed(() => {
   let total = 0

   if (product.userAdditionalIngredientsTemporary) {
      product.userAdditionalIngredientsTemporary.forEach(element => {
         total += Number(element.ingredient.price_default) * element.quantity
      })
   }

   if (product.userBaseIngredientsTemporary) {
      product.userBaseIngredientsTemporary.forEach(element => {
         total += Number(element.ingredient.additionalPrice)
      })
   }

   total += Number(product.price_default)

   return total
})

async function saveConfig() {
   createUserConfigForProduct(product, product.userBaseIngredientsTemporary, product.userAdditionalIngredientsTemporary)

   rerecordProductWithUserConfigs(product)

   resetCurrentConfig(product, userConfigIndex);

   await navigateTo('/')

   // один nextTick не успевает
   await nextTick()
   await nextTick()

   scrollToNewProductUserConfig()
}

function scrollToNewProductUserConfig() {
   const element = document
      .getElementById(`${product.id}-${product.userConfigs[product.userConfigs.length - 1].userConfigID}`)

   if (!element) return

   element.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center">
         <div class="font-semibold">{{ product.title }} </div>
         <div class="text-sm">(редактор ингредиентов)</div>
      </h1>

      <img class="w-26 h-26 m-auto"
           :src="product.image_url">

      <p class="text-sm text-center text-(--text-color-main)/60">
         Настрой ингредиенты по своему вкусу
      </p>

      <div class="flex items-center justify-between">
         <BaseButton :isIcon="true"
                     :click="() => resetCurrentConfig(product, userConfigIndex)">
            Сбросить изменения
         </BaseButton>

         <button class="ingredients-editor__btn-info">
            <IconInfoCircle />
            <DialogMiniInfo right=0>
               Базовые игредиенты - ингредиенты, которые уже есть в продуке и которые можно удалить или заменить.
               Изменение ингредиентов может повлиять на стоимость продукта.
            </DialogMiniInfo>
         </button>
      </div>

      <section v-if="product.userBaseIngredientsTemporary.length > 0"
               class="ingredients-editor__base-ingredients">
         <div class="ingredients-editor__base-ingredients-title">Базовые ингредиенты</div>
         <div v-for="(baseIngredient, index) in product.userBaseIngredientsTemporary"
              class="ingredients-editor__base-ingredients-item">
            <div class="ingredients-editor__base-ingredients-item-image-and-title">
               <img class="ingredients-editor__base-ingredients-item-image"
                    :class="{
                     'image-gray': baseIngredient.isDelete
                        || baseIngredient.ingredient.is_in_stop_list
                        || !baseIngredient.ingredient.is_active
                  }"
                    :src="baseIngredient.ingredient.image_url"
                    alt="">
               <span class="ingredients-editor__base-ingredients-item-title"
                     :class="{ 'text-line-through': baseIngredient.isDelete }">
                  {{ baseIngredient.ingredient.title }}
                  <span v-if="baseIngredient.ingredient.is_in_stop_list">(будет позже)</span>
                  <span v-if="!baseIngredient.ingredient.is_active">(недоступен)</span>
               </span>
            </div>

            <div class="ingredients-editor__base-ingredients-item-btns-section">
               <button v-if="baseIngredient.ingredient.can_delete"
                       class="ingredients-editor__base-ingredients-item-btn-delete"
                       @click="baseIngredient.isDelete = !baseIngredient.isDelete">
                  <span v-if="baseIngredient.isDelete">восстановить</span>
                  <span v-else>удалить</span>
               </button>

               <NuxtLink class="ingredients-editor__base-ingredients-item-btn-edit"
                         :to="`/product/${productID}/ingredients-editor-${userConfigIndex || 'base'}/replacing-base-ingredient-${index}`">
                  заменить
               </NuxtLink>


            </div>
         </div>
      </section>

      <section v-if="product.additional_ingredients.length > 0">

         <BaseButton class="w-full"
                     :isIcon="true">
            <NuxtLink
                      :to="`/product/${productID}/ingredients-editor-${userConfigIndex || 'base'}/adding-additional-ingredients`">
               Добавить дополнительные ингредиенты
            </NuxtLink>
         </BaseButton>

         <div class="ingredients-editor__additional-ingredients-list">
            <template v-for="additionalIngredient in product.userAdditionalIngredientsTemporary">
               <div v-if="additionalIngredient.quantity > 0"
                    class="ingredients-editor__additional-ingredients-item">
                  <img class="ingredients-editor__additional-ingredients-item-image"
                       :src="additionalIngredient.ingredient.image_url"
                       alt="">
                  <span class="ingredients-editor__additional-ingredients-item-quantity ">
                     {{ additionalIngredient.quantity }}
                  </span>
               </div>
            </template>
         </div>
      </section>

      <template #actions>

         <div class="flex items-center justify-between w-full">
            <p> {{ Number(totalPrice) }}р.</p>
            <BaseButton :click="saveConfig">
               Сохранить конфигурацию
            </BaseButton>
         </div>

      </template>

   </PopupPageWrapper>

</template>

<style scoped>
.ingredients-editor__btn-info {
   position: relative;
   font-size: 25px;
   color: var(--brand-color);
   background-color: transparent;
   border: 0;

   display: flex;
}

@media (hover: hover) {
   .ingredients-editor__btn-info:hover {
      color: var(--brand-color-hover);
   }
}

.ingredients-editor__btn-info:active {
   color: var(--brand-color-active);
}

.ingredients-editor__base-ingredients {
   margin-top: 10px;
   font-size: 16px;
   margin-bottom: 25px;
}

.ingredients-editor__base-ingredients-title {
   margin-bottom: 10px;
}

.ingredients-editor__base-ingredients-item {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 10px;
   margin-bottom: 10px;
}

.ingredients-editor__base-ingredients-item-image-and-title {
   display: flex;
   align-items: center;
   gap: 5px;
}

.ingredients-editor__base-ingredients-item-btns-section {
   /* для запрета переноса кнопок при длинном имени ингредиента   */
   display: flex;
}

.ingredients-editor__base-ingredients-item-image {
   width: 25px;
   aspect-ratio: 1/1;
}

.ingredients-editor__base-ingredients-item-title {
   font-size: 14px;
   color: grey;
}

.image-gray {
   filter: grayscale(100%);
}

.text-line-through {
   text-decoration: line-through;
}

.ingredients-editor__base-ingredients-item-btn-edit {
   font-family: Arial, Helvetica, sans-serif;
   display: inline-block;
   text-decoration: none;
   border: 2px solid var(--brand-color);
   border-radius: 15px;
   background-color: var(--text-color-on-brand-color);
   color: var(--brand-color);
   font-size: 14px;
   padding: 5px;
   margin-left: 5px;
}

@media (hover: hover) {
   .ingredients-editor__base-ingredients-item-btn-edit:hover {
      color: var(--brand-color-hover);
      border-color: var(--brand-color-hover);
   }
}

.ingredients-editor__base-ingredients-item-btn-edit:active {
   color: var(--brand-color-hover);
   border-color: var(--brand-color-hover);
}

.ingredients-editor__base-ingredients-item-btn-delete {
   display: inline-block;
   text-decoration: none;
   border: 2px solid red;
   border-radius: 15px;
   background-color: white;
   color: red;
   font-size: 14px;
   padding: 5px;
}

@media (hover: hover) {
   .ingredients-editor__base-ingredients-item-btn-delete:hover {
      color: var(--brand-color-hover);
      border-color: var(--brand-color-hover);
   }
}

.ingredients-editor__base-ingredients-item-btn-delete:active {
   color: var(--brand-color-hover);
   border-color: var(--brand-color-hover);
}

.ingredients-editor__additional-ingredients-list {
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
}

.ingredients-editor__additional-ingredients-item {
   position: relative;
}

.ingredients-editor__additional-ingredients-item-image {
   width: 40px;
   aspect-ratio: 1/1;
}

.ingredients-editor__additional-ingredients-item-quantity {
   position: absolute;
   bottom: 0;
   right: -10px;

   display: flex;
   align-items: center;
   justify-content: center;

   border-radius: 50%;
   width: 20px;
   height: 20px;

   font-size: 10px;
   font-weight: 500;
   color: var(--text-color-on-brand-color);
   background-color: var(--brand-color);
}
</style>