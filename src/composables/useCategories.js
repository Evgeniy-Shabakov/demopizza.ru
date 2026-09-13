import { api } from '@/api/api'
import { normalizeProductImagePathForCategories } from '@/helpers/normalizeProductImagePath'

export const categories = ref(null)
export const isLoadingCategories = ref(false)

const lastFetched = ref(null)
const maxAge = 30 * 1000  // 30 сек

export async function loadCategories() {
   if (categories.value && Date.now() - lastFetched.value < maxAge) return
   
   if (!categories.value) isLoadingCategories.value = true

   const response = await api.get('/categories')
   categories.value = response.data.data

   normalizeProductImagePathForCategories(categories.value)

   lastFetched.value = Date.now()
   isLoadingCategories.value = false
}


