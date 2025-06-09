import { authUser } from '~/js/axios-helper.js'
import { loginForOrder, loginForAddingAdress } from '~/js/login-panel-helper.js'

const protectedPaths = ['user', 'order-panel', 'order-status'];

export default defineNuxtRouteMiddleware(async (to, from) => {
   try {
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