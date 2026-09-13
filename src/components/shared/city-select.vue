<script setup>
import { cityId, cities } from '@/composables/use-cities'
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
