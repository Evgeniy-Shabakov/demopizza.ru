<script setup>
import { selectedCity } from '~/js/client-helper.js'

const mapSrc = ref(null)

const stopWatch = watchEffect(() => { // watchEffect нужен при обновлении страницы, т.к. selectedCity не успевает загрузится
   if (selectedCity.value?.map_iframe) {
      mapSrc.value = extractSrcFromIframe(selectedCity.value.map_iframe)
      // Останавливаем после следующего цикла обновления, чтобы не было ошибки инициализации stopWatch
      nextTick(() => stopWatch())
   }
})

function extractSrcFromIframe(iframeString) {
   const parser = new DOMParser();
   const doc = parser.parseFromString(iframeString, 'text/html');
   const iframe = doc.querySelector('iframe');
   return iframe ? iframe.getAttribute('src') : null;
}
</script>

<template>

   <PopupPageWrapper class="text-center">

      <h1 class="text-xl text-center font-semibold">Зоны доставки</h1>

      <iframe :src=mapSrc
              width="329"
              height="312"
              frameborder="0"
              class="h-full w-full" />

      <template #actions>

         <BaseButton class="w-full"
                     :click="() => $router.back()">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>