
//массив и сохранение скролла перед каждым роутом
export let scrollPosition = 0

export default defineNuxtRouteMiddleware((to, from) => {
   if (from.name == 'index') scrollPosition = window.scrollY

   if (to.name == 'index') {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
   }
   else {
      // Рассчитываем ширину скроллбара
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Блокируем скролл, но сохраняем полосу прокрутки
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
   }
})