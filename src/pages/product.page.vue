<script setup>
import { Minus, Plus, ShoppingCart, Hourglass, CircleArrowLeft } from '@lucide/vue'
import { categories, isLoadingCategories, loadCategories } from '@/composables/use-categories'
import { itemsInCart, addProductToCart, minusProductFromCart } from '@/composables/use-cart'
import { isProductInStopList } from '@/helpers/is-product-in-stop-list'

const route = useRoute()
const id = Number(route.params.id)

if (!categories.value) loadCategories()

const currentProduct = computed(() => {
   if (!categories.value) return null
   return categories.value
      .flatMap(category => category.products)
      .find(product => product.id == id)
})

const isInStopList = computed(() => isProductInStopList(currentProduct.value))

const description = computed(() =>
   currentProduct.value?.descriptionFull || currentProduct.value?.descriptionShort
)

const cartItem = computed(() =>
   itemsInCart.value.find(item => item.productId == id)
)

const isNotFound = computed(() =>
   !isLoadingCategories.value && categories.value && !currentProduct.value
)
</script>

<template>
   <SpinnerCenter v-if="isLoadingCategories" />

   <div v-else-if="isNotFound"
        class="text-center mt-32">
      Товар не найден
   </div>

   <template v-else-if="currentProduct">
      <img :src="currentProduct.imagePath"
           :alt="currentProduct.name"
           class="w-full max-w-md mx-auto aspect-square rounded-sm mb-4" />

      <h1 class="text-2xl font-bold mb-2">{{ currentProduct.name }}</h1>

      <div class="text-lg font-semibold mb-2">
         {{ currentProduct.priceDefault }} ₽
      </div>

      <p v-if="description"
         class="text-muted-foreground text-sm">
         {{ description }}
      </p>
   </template>

   <BottomBar>
      <template v-if="!currentProduct">
         <ButtonLgWfull @click="$router.back()">
            <CircleArrowLeft class="size-5" />
            Назад
         </ButtonLgWfull>
      </template>

      <ButtonLgWfull v-else-if="isInStopList"
                     disabled>
         <Hourglass class="size-5" />
         Будет позже
      </ButtonLgWfull>

      <template v-else-if="cartItem && cartItem.quantity > 0">
         <div class="flex items-center gap-6 justify-between w-full">
            <ButtonIcon variant="outline"
                        size="icon-lg"
                        @click="minusProductFromCart(id)">
               <Minus />
            </ButtonIcon>
            <span class="w-4 text-center font-medium tabular-nums">{{ cartItem.quantity }}</span>
            <ButtonIcon size="icon-lg"
                        @click="addProductToCart(id)">
               <Plus />
            </ButtonIcon>
         </div>
      </template>

      <ButtonLgWfull v-else
                     @click="addProductToCart(id)">
         <ShoppingCart class="size-5" />
         В корзину
      </ButtonLgWfull>
   </BottomBar>
</template>