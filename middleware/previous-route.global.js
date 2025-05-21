
//массив и сохранение скролла перед каждым роутом
export let previousRoute = null

export default defineNuxtRouteMiddleware((to, from) => {
  previousRoute = from
})