
export let previousRoute = null

export default defineNuxtRouteMiddleware((to, from) => {
  previousRoute = from
})