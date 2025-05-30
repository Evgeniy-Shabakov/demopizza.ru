import { authUser } from '~/js/axios-helper.js'
import { loginForOrder } from '~/js/login-panel-helper.js'

const routeNamesForAuthUser = ['user', 'order-panel']

export default defineNuxtRouteMiddleware(async (to, from) => {
   try {
      if (!authUser.value && routeNamesForAuthUser.includes(to.name)) {

         if (!authUser.value) {
            if (to.name == 'order-panel') loginForOrder.value = true
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