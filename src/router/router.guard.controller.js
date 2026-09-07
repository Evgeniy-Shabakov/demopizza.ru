import { authUser, loadAuthUser, userIsLoaded } from '@/composables/useAuthUser'

const PROTECTED_ROUTES = [
   'profile',
   'profile-delivery-addresses',
   'profile-edit',
   'profile-order-history'
]

export async function routerGuardController(to) {
   if (PROTECTED_ROUTES.includes(to.name)) {
      if (!userIsLoaded) await loadAuthUser()

      if (!authUser.value) return { name: 'login' }
   }

   if (to.name == 'login' && authUser.value) {
      return { name: 'profile' }
   }
}
