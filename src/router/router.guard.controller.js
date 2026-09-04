import { authUser } from '@/composables/useAuthUser'

const PROTECTED_ROUTES = ['profile']

export function routerGuardController(to) {
   if (PROTECTED_ROUTES.includes(to.name) && !authUser.value) {
      return { name: 'login' }
   }

   if (to.name == 'login' && authUser.value) {
      return { name: 'profile' }
   }
}
