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

   <Cookies />

   <slot />

   <MobileNav />

   <BaseSpinner v-if="dataForComponentLoadingType === LOADING_TYPE.LOADING" />

   <DialogStandart :isActive="dataForComponentLoadingType === LOADING_TYPE.ERROR">
      <template #title>
         Ошибка загрузки данных
      </template>

      <div class=" text-center">
         <div>{{ error }}</div>
         <div>Попробуйте обновить страницу </div>
      </div>

      <template #actions>
         <BaseButton :click="reloadPage">Обновить</BaseButton>
      </template>

   </DialogStandart>

   <!-- <DialogMini /> -->

</template>
