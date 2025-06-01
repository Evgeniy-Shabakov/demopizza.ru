<script setup>
const mapSrc = 'https://yandex.ru/map-widget/v1/?um=constructor%3A5cb84ff2b9eb12c39112e51e39c61cf4bc13246e40bf5ca8d3794fd1f57b91ed&amp;source=constructor'
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