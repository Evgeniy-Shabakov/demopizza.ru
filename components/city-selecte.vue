<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { cities } from '~/js/axios-helper.js'

</script>

<template>

   <select v-if="cities"
           class="w-full p-1 text-base text-black bg-[var(--text-color-on-brand-color)] 
                  rounded-[var(--border-radius-main)] "
           v-model="selectedCity">
      <option v-for="city in cities"
              :value="city">{{ city.title }}</option>
   </select>

</template>
