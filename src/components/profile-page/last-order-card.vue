<script setup>
defineProps({
   order: { type: Object, required: true },
})
</script>

<template>
   <Card class="gap-2 p-3 text-sm">
      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-1">
         <template v-for="orderProduct in order.orderProducts"
                   :key="orderProduct.product.id">
            <img :src="orderProduct.product.imagePath"
                 :alt="orderProduct.product.name"
                 class="size-8 aspect-square rounded object-cover" />

            <div class="min-w-0 truncate">
               {{ orderProduct.product.name }}
            </div>

            <div class="text-muted-foreground ml-auto tabular-nums whitespace-nowrap">
               {{ orderProduct.quantity }} шт.
            </div>
         </template>
      </div>
   </Card>
</template>