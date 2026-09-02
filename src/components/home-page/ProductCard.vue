<script setup>
import { Minus, Plus } from '@lucide/vue'
import { itemsInCart, addProductToCart, minusProductFromCart } from '@/composables/useCart'

const props = defineProps({
   product: { type: Object, required: true },
})

const cartItem = computed(() =>
   itemsInCart.value.find(item => item.productId === props.product.id)
)
</script>

<template>
   <Card class="flex-row xs:flex-col gap-3.5 p-2 sm:p-3 lg:p-4">

      <img :src="product.imagePath"
           :alt="product.title"
           class="w-2/5 shrink-0 self-start xs:w-full aspect-square rounded-xl" />

      <div class="flex flex-col gap-2 min-w-0 grow">
         <CardTitle>{{ product.name }}</CardTitle>
         <CardDescription>{{ product.descriptionShort }}</CardDescription>
         <div class="flex flex-wrap items-center justify-between gap-1 mt-auto">
            <span class="font-semibold">{{ product.priceDefault }} ₽</span>

            <template v-if="cartItem && cartItem.quantity > 0">
               <div class="flex items-center gap-1">
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
            <Button v-else
                    @click="addProductToCart(product.id)">
               В корзину
            </Button>
         </div>
      </div>

   </Card>
</template>
