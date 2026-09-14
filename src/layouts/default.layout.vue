<script setup>
// onMounted(() => {
//    //костыль который помогает убрать лишнюю высоту и полосу прокрутки
//    //при обновлении страницы в PWA на страницах где мало контента
//    const mainElement = document.querySelector('main')
//
//    const dvh = window.visualViewport ? window.visualViewport.height : window.innerHeight
//    mainElement.style.minHeight = `${dvh}px`
// })

onMounted(() => {
   const mainElement = document.querySelector('main')
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
            <router-view />
         </div>
      </main>

   </ContainerX>

   <BottomNav class="h-12" />

   <CookieConsent />

</template>
