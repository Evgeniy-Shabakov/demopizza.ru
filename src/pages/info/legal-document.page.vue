<script setup>
import { legalDocuments, loadLegalDocuments } from '@/composables/use-legal-documents'
import { isCookieConsentAccepted } from '@/composables/use-cookie-consent'

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

const reservedSpaceForCookies = ref(0)

onMounted(() => nextTick(() => {
   const cookieBanner = document.getElementById('cookie-consent')
   reservedSpaceForCookies.value = !isCookieConsentAccepted.value && cookieBanner
      ? Math.max(0, cookieBanner.offsetHeight - 84 + 16)
      : 0
}))

watch(isCookieConsentAccepted, () => { reservedSpaceForCookies.value = 0 })
</script>

<template>

   <div class="flex-1 flex flex-col"
        :style="{ paddingBottom: `${reservedSpaceForCookies}px` }">

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