<script setup>
import { totalCountInCart } from '~/js/client-helper.js'
import { initialize } from '~/js/client-initialize'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'

const route = useRoute()

const dataForComponentLoadingType = ref(LOADING_TYPE.loading)

onBeforeMount(async () => {
   try {
      await initialize()
      dataForComponentLoadingType.value = LOADING_TYPE.complete
      // setBrowserTitleForClient()
   }
   catch (error) {
      dataForComponentLoadingType.value = error
   }

})

function reloadPage() {
   location.reload()
}

</script>

<template>

   <div v-if="dataForComponentLoadingType === LOADING_TYPE.complete">
      index
   </div>

   <div v-else-if="dataForComponentLoadingType === LOADING_TYPE.loading"
        class="spinner-centr-display">
      <div class="spinner"></div>
   </div>

   <div v-else
        class="error-loading">
      <p class="error-loading__text">Ошибка загрузки данных. Попробуйте обновить страницу</p>
      <p class="error-loading__description">{{ dataForComponentLoadingType }}</p>
      <button class="btn btn-submit"
              @click="reloadPage()"
              type="button">Обновить</button>
   </div>

</template>
