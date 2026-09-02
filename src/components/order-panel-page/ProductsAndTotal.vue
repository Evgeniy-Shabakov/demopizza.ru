<script setup>
import { productsInOrder, totalProductsInCart } from '@/composables/useCart'
</script>

<template>
   <div>
      <Label class="mb-1.5">Товары ({{ totalProductsInCart }} шт.)</Label>
      <Card class="p-3 gap-2 text-sm">
         <div class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
            <template v-for="product in productsInOrder"
                      :key="product.productId">

               <img :src="product.imagePath"
                    class="size-8 aspect-square rounded-xl object-cover" />

               <div>
                  {{ product.name }}
               </div>

               <div class="text-muted-foreground ml-auto">
                  {{ product.quantity }} шт. × {{ product.priceDefault }}
               </div>

               <div class="ml-auto">
                  {{ Number(product.quantity) * Number(product.priceDefault) }} ₽
               </div>

            </template>
         </div>

      </Card>
      <TotalBlock class="ml-auto block w-max m-3" />
   </div>
</template>