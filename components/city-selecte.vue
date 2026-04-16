<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { cities } from '~/js/axios-helper.js'

</script>

<template>

   <select v-if="cities"
           class="base-selecte"
           v-model="selectedCity">
      <option v-for="city in cities"
              :value="city">{{ city.name }}</option>
   </select>

</template>
