import { api } from '@/api/api'

export const categories = ref(null)
export const isLoadingCategories = ref(false)

const lastFetched = ref(null)
const maxAge = 30 * 1000  // 30 сек

export async function loadCategories() {
   if (categories.value && Date.now() - lastFetched.value < maxAge) return
   
   if (!categories.value) isLoadingCategories.value = true

   const response = await api.get('/categories')
   categories.value = response.data.data

   const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
   categories.value.forEach(category => {
      category.products.forEach(product => {
         product.imagePath = `${baseUrl}${product.imagePath.replace('storage/public', '')}`
      })
   })

   lastFetched.value = Date.now()
   isLoadingCategories.value = false
}


