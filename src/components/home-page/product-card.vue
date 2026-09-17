<script setup>
import { Minus, Plus, ShoppingCart, Hourglass } from '@lucide/vue'
import { itemsInCart, addProductToCart, minusProductFromCart } from '@/composables/use-cart'
import { isProductInStopList } from '@/helpers/is-product-in-stop-list'

const props = defineProps({
   product: { type: Object, required: true },
})

const isInStopList = computed(() => isProductInStopList(props.product))

const cartItem = computed(() =>
   itemsInCart.value.find(item => item.productId === props.product.id)
)
</script>

<template>
   <Card class="gap-2 p-1 rounded-sm">

      <RouterLink :to="{ name: 'product', params: { id: product.id } }"
                  class="flex flex-col gap-2 flex-1">
         <img :src="product.imagePath"
              :alt="product.title"
              class="w-full aspect-square rounded-sm mb-1.5" />

         <CardTitle>{{ product.name }}</CardTitle>
         <CardDescription class="line-clamp-2 sm:line-clamp-none">
            {{ product.descriptionShort }}
         </CardDescription>
      </RouterLink>

      <div class="font-semibold text-sm mt-auto">{{ product.priceDefault }} ₽</div>

      <ButtonWfull v-if="isInStopList"
                   disabled>
         <Hourglass class="size-4" />
         Будет позже
      </ButtonWfull>
      <template v-else-if="cartItem && cartItem.quantity > 0">
         <div class="flex items-center gap-3 justify-between">
            <ButtonIcon variant="outline"
                        @click="minusProductFromCart(product.id)">
               <Minus />
            </ButtonIcon>
            <span class="w-4 text-center font-medium">{{ cartItem.quantity }}</span>
            <ButtonIcon @click="addProductToCart(product.id)">
               <Plus />
            </ButtonIcon>
         </div>
      </template>
      <ButtonWfull v-else
                   @click="addProductToCart(product.id)">
         <ShoppingCart class="size-4" />
         В корзину
      </ButtonWfull>

   </Card>
</template>
