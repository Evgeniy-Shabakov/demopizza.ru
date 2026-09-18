<script setup>
onMounted(() => {
   //костыль который помогает убрать лишнюю высоту и полосу прокрутки
   //при обновлении страницы в PWA на страницах где мало контента
   const mainElement = document.querySelector('main')

   //учитываем высоту desctop-header чтобы не появлялся скролл на неполных страницах
   //без полноэкранного режима desktopHeaderHeight можно убрать
   const desktopHeaderHeight = document.getElementById('desktop-header')?.offsetHeight ?? 0

   const dvh = window.visualViewport ? window.visualViewport.height : window.innerHeight
   mainElement.style.minHeight = `${dvh - desktopHeaderHeight}px`
})
</script>

<template>

   <DesktopHeader />

   <ContainerX>

      <main class="min-h-dvh flex flex-col p-2"
            :class="$route.path === '/' ? 'pb-16' : 'pb-33'">
         <div class="flex-1 flex flex-col">
            <router-view v-slot="{ Component }">
               <keep-alive :include="['HomePage']">
                  <component :is="Component" />
               </keep-alive>
            </router-view>
         </div>
      </main>

   </ContainerX>

   <BottomNav class="h-12" />

   <CookieConsent />

</template>
