<script setup>
import { getModelsAxios, legalDocuments } from '~/js/axios-helper.js'

if(!legalDocuments.value) getModelsAxios('legal-documents')
</script>

<template>
   <PopupPageWrapper class="text-center">

      <h1 class="text-xl text-center font-semibold">Правовая информация</h1>

      <template v-if="legalDocuments">
         <BaseLink v-for="document in legalDocuments"
                   :href="document.file_url">
            {{ document.title }}
            (скачать)
         </BaseLink>
      </template>

      <BaseSpinner v-else/>

      <template #actions>

         <BaseButton class="w-full"
                     :click="() => $router.back()">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>
</template>