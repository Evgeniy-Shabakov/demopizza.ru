import { api } from "@/api/api"

export const authUser = ref(null)
export let userIsLoaded = false

export async function loadAuthUser() {
   try {
      const res = await api.get('/auth/me')
      authUser.value = res.data.data
   } catch {
      authUser.value = null
   }
   finally {
      userIsLoaded = true
   }
}

export async function loginUser(vkidAccessToken) {
   const res = await api.post('/auth/login', { vkidAccessToken })
   authUser.value = res.data.data
   loadAuthUser()
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