<script setup>
import { initialize } from '~/js/client-initialize'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'

const dataForComponentLoadingType = ref(LOADING_TYPE.LOADING)
const error = ref()

onBeforeMount(async () => {
   try {
      await initialize()
      dataForComponentLoadingType.value = LOADING_TYPE.COMPLETE
      // setBrowserTitleForClient()
   }
   catch (err) {
      dataForComponentLoadingType.value = LOADING_TYPE.ERROR
      error.value = err
   }

})

function reloadPage() {
   location.reload()
}
</script>

<template>

   <!-- <cookies></cookies> -->

   <slot />

   <BaseSpinner v-if="dataForComponentLoadingType === LOADING_TYPE.LOADING" />

   <div v-if="dataForComponentLoadingType === LOADING_TYPE.ERROR">
      <p>Ошибка загрузки данных. Попробуйте обновить страницу</p>
      <p>{{ error }}</p>
      <button @click="reloadPage()">Обновить</button>
   </div>

   <MobileNav />

   <!-- <DialogMini /> -->

</template>
