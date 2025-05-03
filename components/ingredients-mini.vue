<script setup>
const props = defineProps(['baseIngredients', 'additionalIngredients'])

const additionalIngredients = props.additionalIngredients.filter(el => el.quantity > 0)
</script>

<template>

   <div>
      
      <div>
         <div v-for="baseIngredient in baseIngredients"
              class="ingredients-mini__ingredient-container">
            <img class="ingredients-mini__ingredient-img"
                 :src="baseIngredient.image_url || baseIngredient.ingredient.image_url"
                 alt="">
            <img v-if="baseIngredient.isDelete"
                 class="ingredients-mini__ingredient-img ingredients-mini__ingredient-img-cross"
                 src="/assets/images/cross.png">
         </div>
      </div>

      <div>
         <div v-for="additionalIngredient in additionalIngredients"
              class="ingredients-mini__ingredient-container">
            <img class="ingredients-mini__ingredient-img"
                 :src="additionalIngredient.ingredient.image_url">
            <div class="ingredients-mini__count">
               {{ additionalIngredient.quantity }}
            </div>
         </div>
      </div>

   </div>

</template>

<style scoped>
.ingredients-mini__ingredient-container {
   display: inline-block;
   position: relative;
}

.ingredients-mini__ingredient-img-cross {
   position: absolute;
   top: 0;
   left: 0;
}

.ingredients-mini__ingredient-img {
   width: 20px;
   margin-right: 1px;
}

.ingredients-mini__count {
   position: absolute;
   bottom: 0;
   right: 0;

   display: flex;
   align-items: center;
   justify-content: center;

   border-radius: 50%;
   width: 12px;
   height: 12px;

   background-color: var(--brand-color);
   color: var(--text-color-on-brand-color);
   font-size: 10px;
}
</style>