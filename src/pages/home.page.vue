<script setup>
import { categories, isLoadingCategories } from '@/composables/use-categories'

defineOptions({ name: 'HomePage' }) //для keep-alive в layout
</script>

<template>

   <MobileHomePageHeader />

   <SpinnerCenter v-if="isLoadingCategories" />

   <template v-else-if="categories">
      <CategoryNav :categories="categories" />

      <div v-for="category in categories"
           :key="category.id"
           :id="'cat-' + category.id"
           :data-category-id="category.id"
           class="mb-6 scroll-mt-10">
         <h2 class="text-xl font-bold mb-2">{{ category.name }}</h2>
         <div class="grid gap-1.5 grid-cols-2 sm:gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            <ProductCard v-for="product in category.products"
                         :key="product.id"
                         :product="product" />
         </div>
      </div>
   </template>
</template>
