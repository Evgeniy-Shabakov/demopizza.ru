<script setup>
import { Trash2, Minus, Plus } from '@lucide/vue'
import { addProductToCart, removeProductFromCart, minusProductFromCartWithZero }
   from '@/composables/useCart'

defineProps({
   product: { type: Object, required: true },
})
</script>

<template>
   <Card class="flex-row gap-3.5 p-2 sm:p-3 lg:p-4">
      <img :src="product.imagePath"
           class="w-1/5 xs:size-30 shrink-0 self-start aspect-square rounded-xl" />
      <div class="flex flex-col flex-1 min-w-0 justify-between">
         <div>
            <div class="flex items-start justify-between gap-2">
               <div>
                  <div class="flex items-center gap-2">
                     <CardTitle>{{ product.name }}</CardTitle>
                     <Badge v-if="product.isInStopList"
                            variant="secondary">Будет позже</Badge>
                  </div>
                  <CardDescription>{{ product.priceDefault }} ₽</CardDescription>
               </div>
               <ButtonIconSm variant="outline"
                           @click="removeProductFromCart(product.productId)">
                  <Trash2 />
               </ButtonIconSm>
            </div>
         </div>
         <div class="flex items-center justify-between gap-2 pt-3">
            <div class="flex items-center gap-1">
               <ButtonIconSm variant="outline"
                             :disabled="product.isInStopList"
                             @click="minusProductFromCartWithZero(product.productId)">
                  <Minus />
               </ButtonIconSm>
               <span class="w-6 text-center font-medium tabular-nums">{{ product.isInStopList ? 0 : product.quantity }}</span>
               <ButtonIconSm :disabled="product.isInStopList"
                             @click="addProductToCart(product.productId)">
                  <Plus />
               </ButtonIconSm>
            </div>
            <span class="tabular-nums">{{ product.isInStopList ? 0 : product.priceDefault * product.quantity }} ₽</span>
         </div>
      </div>
   </Card>
</template>
