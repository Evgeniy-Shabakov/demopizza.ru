<script setup>
import { legalDocuments, loadLegalDocuments } from '@/composables/useLegalDocuments'

const route = useRoute()
const id = route.params.id

if (!legalDocuments.value) loadLegalDocuments()

const currentDocument = computed(() => {
   if (!legalDocuments.value) return null

   const doc = legalDocuments.value.find(doc => doc.id == id)
   doc.linkModifyed = doc.link.replace(/\/edit(\?.*)?$/, '/mobilebasic')

   return doc
})

const isIframeLoaded = ref(false)
function onIframeLoad() {
   isIframeLoaded.value = true
}
</script>

<template>

   <div class="flex-1 flex flex-col">

      <PageHeader>Правовая информация</PageHeader>

      <div class="flex-1 overflow-hidden relative">
         <iframe v-if="currentDocument?.linkModifyed"
                 :src="currentDocument?.linkModifyed"
                 class="absolute left-0 w-full block border-none"
                 style="top: -87px; height: calc(100% + 87px);"
                 @load="onIframeLoad" />
      </div>

   </div>

   <SpinnerCenter v-if="!isIframeLoaded" />

   <BottomBar />

</template>