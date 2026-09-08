import { api } from "@/api/api"

export const authUser = ref(null)
export let userIsLoaded = false

let loadPromise = null  //защита от двойного вызова
export function loadAuthUser() {
   if (loadPromise) return loadPromise 

   loadPromise = (async () => {
      try {
         const res = await api.get('/auth/me')
         authUser.value = res.data.data
      } catch {
         authUser.value = null
      } finally {
         userIsLoaded = true
         loadPromise = null
      }
   })()

   return loadPromise
}

export async function loginUser(vkidAccessToken) {
   const res = await api.post('/auth/login', { vkidAccessToken })
   authUser.value = res.data.data
   loadAuthUser()  //дополнительно загружает адреса
}

export async function logoutUser() {
   try {
      await api.delete('/auth/logout')
   } catch {
      // ignore server errors, always clear local state
   } finally {
      authUser.value = null
   }
}