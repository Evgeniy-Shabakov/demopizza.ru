<script setup>
import { initializeUserAdditonalIngredientsForProductTemporary }
   from '~/js/ingredients-editor'
import { findProductById } from '~/js/models/product'

const router = useRouter()

const productID = Number(useRoute().params.id)
const userConfigIndex = useRoute().params.userConfigIndex == 'base'
   ? null
   : Number(useRoute().params.userConfigIndex)

const product = findProductById(productID)

if (!product.userAdditionalIngredientsTemporary) {
   initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex)
}

const userAdditionalIngredientsForPage = ref(JSON.parse(JSON.stringify(product.userAdditionalIngredientsTemporary)))

function minusUserAdditionalIngredient(userAdditionalIngredient) {
   if (userAdditionalIngredient.quantity <= 0) return
   userAdditionalIngredient.quantity--
}

function plusUserAdditionalIngredient(userAdditionalIngredient) {
   if (userAdditionalIngredient.quantity >= userAdditionalIngredient.ingredient.max_quantity) return
   userAdditionalIngredient.quantity++
}

function save() {
   product.userAdditionalIngredientsTemporary = userAdditionalIngredientsForPage.value
   router.back()
}
</script>

<template>
   <PopupPageWrapper>
      <h1 class="text-xl text-center font-semibold">
         Дополнительные ингредиенты
      </h1>

      <template v-if="product.additional_ingredients.length > 0">

         <div v-for="additonalIngredient in userAdditionalIngredientsForPage"
              class="flex items-center justify-between gap-2 mt-3">

            <div class="flex items-center gap-2">
               <img class="w-6 h-6"
                    :class="additonalIngredient.ingredient.is_in_stop_list ? 'grayscale-80' : ''"
                    :src="additonalIngredient.ingredient.image_url"
                    alt="">
               <span>{{ Number(additonalIngredient.ingredient.price_default) }}р.</span>
               <span class="text-(--text-color-main)/60">
                  {{ additonalIngredient.ingredient.title }}
               </span>
            </div>

            <BaseButton v-if="additonalIngredient.ingredient.is_in_stop_list"
                        :isIcon="true"
                        :active=false>
               Будет позже
            </BaseButton>

            <div v-else
                 class="flex items-center gap-1">
               <BaseButton :isIcon="true"
                           :click="() => minusUserAdditionalIngredient(additonalIngredient)">
                  <IconMinus />
               </BaseButton>
               <div> {{ additonalIngredient.quantity }} </div>
               <BaseButton :isIcon="true"
                           :click="() => plusUserAdditionalIngredient(additonalIngredient)">
                  <IconPlus />
               </BaseButton>
            </div>
         </div>

      </template>

      <template #actions>

         <BaseButton class="w-full"
                     :click="save">
            Сохранить
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>