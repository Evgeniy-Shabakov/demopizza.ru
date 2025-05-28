<script setup>
import { BaseButton } from '#components'
import { initializeUserBaseIngredientsForProductTemporary }
   from '~/js/ingredients-editor'
import { findProductById } from '~/js/models/product'

const router = useRouter()

const productID = Number(useRoute().params.id)
const position = Number(useRoute().params.position)
const userConfigIndex = useRoute().params.userConfigIndex == 'base'
   ? null
   : Number(useRoute().params.userConfigIndex)

const product = findProductById(productID)

if (!product.userBaseIngredientsTemporary) {
   initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
}

const userBaseIngredient = product.userBaseIngredientsTemporary[position]

// const selectedIngredientID = ref(userBaseIngredient.ingredient.id)
const selectedIngredientID = ref(setSelectedIngredientID())

function setSelectedIngredientID() {
   if (userBaseIngredient.ingredient.is_active && !userBaseIngredient.ingredient.is_in_stop_list) {
      return userBaseIngredient.ingredient.id
   }

   for (let ingredient of userBaseIngredient.ingredient.replacements) {
      if (ingredient.is_active && !ingredient.is_in_stop_list)
         return ingredient.id
   }

   return null
}

function save() {
   if (userBaseIngredient.ingredient.id != selectedIngredientID.value) {

      const replace = userBaseIngredient.ingredient.replacements
         .find(el => el.id == selectedIngredientID.value)

      Object.keys(replace).forEach(key => {
         if (userBaseIngredient.ingredient.hasOwnProperty(key)) {
            userBaseIngredient.ingredient[key] = replace[key];
         }
      })
   }

   router.back()
}

</script>

<template>
   <PopupPageWrapper>

      <h1 class="text-xl text-center">
         <div>Выбирите замену для</div>
         <div class="font-semibold">{{ userBaseIngredient.ingredient.title }}</div>
      </h1>

      <div v-for="ingredient in userBaseIngredient.ingredient.replacements"
           class="flex items-center justify-between gap-2">

         <label class="flex items-center gap-2 grow"
                :for="ingredient.id + ' - id-base-ingredient'">
            <img class="w-12 h-12"
                 :class="ingredient.is_in_stop_list ? 'replacing-base-ingredient__item-image--stop-list' : ''"
                 :src="ingredient.image_url"
                 alt="">
            <span>(+{{ ingredient.additionalPrice }}р.)</span>
            <span>{{ ingredient.title }}</span>
         </label>

         <div v-if="ingredient.is_in_stop_list"
              class="replacing-base-ingredient__item-text-for-stop-list">
            Будет позже
         </div>

         <!-- v-show чтобы не было ошибки что указан for label для несуществующего input  -->
         <input v-show="!ingredient.is_in_stop_list"
                class="w-6 h-6"
                type="radio"
                :id="ingredient.id + ' - id-base-ingredient'"
                :value="ingredient.id"
                v-model="selectedIngredientID">

      </div>

      <template #actions>

         <BaseButton class="w-full"
                     :click="save">
            Сохранить
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>

<style scoped>
.replacing-base-ingredient__item-image--stop-list {
   filter: grayscale(80%);
}

.replacing-base-ingredient__item-text-for-stop-list {
   font-size: 14px;
   background-color: rgba(128, 128, 128, 0.4);
   padding: 4px 6px;
   border-radius: 30px;
   white-space: nowrap;
}
</style>