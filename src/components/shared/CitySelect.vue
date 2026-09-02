<script setup>
import { cityId, cities } from '@/composables/useCities'
</script>

<template>
   <NativeSelect v-model="cityId">
      <NativeSelectOption v-for="city in cities"
                          :key="city.id"
                          :value="city.id">
         {{ city.name }}
      </NativeSelectOption>
   </NativeSelect>
</template>
