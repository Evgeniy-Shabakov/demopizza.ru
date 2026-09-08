<script setup>
import { currentCity } from '@/composables/useCities'

const mapSrc = computed(() => extractSrcFromIframe(currentCity.value?.mapIframe))

function extractSrcFromIframe(iframeString) {
   const parser = new DOMParser();
   const doc = parser.parseFromString(iframeString, 'text/html');
   const iframe = doc.querySelector('iframe');
   return iframe ? iframe.getAttribute('src') : null;
}

const isIframeLoaded = ref(false)
function onIframeLoad() {
   isIframeLoaded.value = true
}
</script>
<template>
   <div class="flex-1 flex flex-col">
      <PageHeader>Зоны доставки</PageHeader>

      <iframe v-if="mapSrc"
              :src=mapSrc
              class="flex-1"
              @load="onIframeLoad" />

   </div>

   <SpinnerCenter v-if="!isIframeLoaded" />

   <BottomBar />
</template>