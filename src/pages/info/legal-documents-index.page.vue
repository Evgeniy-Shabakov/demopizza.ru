<script setup>
import { legalDocuments, loadLegalDocuments } from '@/composables/useLegalDocuments'

loadLegalDocuments()
</script>

<template>
   <PageHeader>Правовая информация</PageHeader>

   <div v-if="legalDocuments"
        class="flex flex-col gap-2 text-center">
      <BaseLink v-for="document in legalDocuments"
                :to="`/legal-documents/${document.id}`">
         {{ document.name }}
      </BaseLink>
   </div>

   <SpinnerCenter v-else />

   <BottomBar />
</template>