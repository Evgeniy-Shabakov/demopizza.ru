<script setup>
defineProps({
   isCenterPage: {
      type: Boolean,
      default: false
   }
})
//не забыть добавить position: relative; в родительский объект, если нужен спиннер в центе родительского объекта
</script>

<template>

   <div :class="isCenterPage ? 'spinner-center-page' : 'spinner-center-object'">
      <div class="spinner"></div>
   </div>

</template>

<style scoped>
.spinner-center-page {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   z-index: 1000;
}

.spinner-center-object {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
}

.spinner {
   height: 30px;
   aspect-ratio: 1/1;

   /* Сделаем элемент круглым */
   border-radius: 50%;

   /* Одна из границ должна отличаться по цвету */
   border: solid 5px #ddd;
   border-left: solid 5px var(--brand-color);

   animation-name: spin;
   /* Применяем анимацию вращения */
   animation-duration: 1s;
   /* Период вращения */
   animation-iteration-count: infinite;
   /* Если не указать, то сделает только одно вращение */
   animation-timing-function: linear;
   /* Для того, чтобы вращение было равномерным */
}

@keyframes spin {
   0% {
      transform: rotate(0);
   }

   100% {
      transform: rotate(360deg);
   }
}
</style>