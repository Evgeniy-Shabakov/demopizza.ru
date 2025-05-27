<script setup>

const props = defineProps(['top', 'right', 'bottom', 'left'])

const isVisible = ref(false)

const dialogElement = ref(null)

let parentElement
const dialogPosition = reactive({})

let popupParentPage

onMounted(() => {
   parentElement = dialogElement.value.parentNode

   if (props.bottom !== undefined && props.right !== undefined) {
      dialogPosition.bottom = parentElement.offsetHeight + 5 + 'px'
      dialogPosition.right = 0
   }
   else if (props.right !== undefined) {
      dialogPosition.right = parentElement.offsetWidth + 5 + 'px'
   }

   //для dialog-info-mini расположенных внутри  popup-pages 
   // т.к. document.addEventListener('scroll', closeDialog) не отрабатывает в элементах с overflow
   popupParentPage = dialogElement.value.closest('.popup-page__inner')
})

function activateDialog() {
   if (isVisible.value) return

   isVisible.value = true

   setTimeout(() => {         // без setTimeout сразу закрывается
      document.addEventListener('click', closeDialog)
      document.addEventListener('scroll', closeDialog)

      if (popupParentPage) popupParentPage.addEventListener('scroll', closeDialog)
      if (popupParentPage) popupParentPage.addEventListener('click', closeDialog)
   })
}

function closeDialog() {
   isVisible.value = false
   document.removeEventListener('click', closeDialog)
   document.removeEventListener('scroll', closeDialog)

   if (popupParentPage) popupParentPage.removeEventListener('scroll', closeDialog)
   if (popupParentPage) popupParentPage.removeEventListener('click', closeDialog)
}

//на всякий случай удаляем обработчики при размонтировании компонента
onBeforeUnmount(() => {
   document.removeEventListener('click', closeDialog)
   document.removeEventListener('scroll', closeDialog)

   if (popupParentPage) popupParentPage.removeEventListener('scroll', closeDialog)
   if (popupParentPage) popupParentPage.removeEventListener('click', closeDialog)
})

</script>

<template>

   <div ref="dialogElement"
        class="dialog-mini-info"
        :class="!isVisible ? 'dialog-mini-info--closed' : ''"
        :style="{
         top: dialogPosition.top,
         right: dialogPosition.right,
         bottom: dialogPosition.bottom,
         left: dialogPosition.left
      }"
        @click="activateDialog()">

      <slot v-if="isVisible" />

   </div>

</template>

<style scoped>
.dialog-mini-info {
   width: 200px;
   position: absolute;
   background-color: var(--background-page-elements-color);
   padding: 10px;
   border: 1px solid var(--brand-color);
   border-radius: var(--border-radius-main);
   font-size: 14px;
   text-align: left;
}

.dialog-mini-info--closed {
   position: absolute;
   inset: 0;

   width: 100%;
   height: 100%;

   border: 0;
   background: transparent;
}
</style>

<!-- как применять -->
<!-- <button right = 0 bottom=0>    //задаем для button position: relative т.к. у DialogMiniInfo position: absolute
         <i class="fas fa-info-circle"></i>
         <DialogMiniInfo>
            Не все ингредиенты доступны для заказа.
            Но вы можете изменить ингредиенты и добавить в корзину товары с новыми ингредиентами
         </DialogMiniInfo>
      </button> -->