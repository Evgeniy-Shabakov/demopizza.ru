import { authUser } from '~/js/axios-helper.js'
import { loginForOrder, loginForAddingAdress } from '~/js/login-panel-helper.js'
import { loadCurrentAuthUser } from '~/js/loading-helper'

const protectedPaths = ['user', 'order-panel', 'order-status'];

export default defineNuxtRouteMiddleware(async (to, from) => {
   try {
      //возможно лучше вынести в другое место, чтобы запускать спиннер пока грузится
      //loadCurrentAuthUser() загружает только один раз, потом просто вовращает
      await loadCurrentAuthUser()

      if (!authUser.value && protectedPaths.some(path => to.path.includes(path))) {

         if (!authUser.value) {
            if (to.name == 'order-panel') {
               loginForOrder.value = true
               loginForAddingAdress.value = false
            }
            if (to.name == 'user-adresses-id') {
               loginForAddingAdress.value = true
               loginForOrder.value = false
            }
            return navigateTo('/login')
         }

      }

      if (authUser.value && to.name == 'login') {
         return navigateTo('/user')
      }

   }
   catch (error) {
      console.log(error)
      throw createError(error)
   }
})