import { categories } from '@/composables/useCategories'

export const itemsInCart = useLocalStorage('cart_v1', [])

export const totalProductsInCart = computed(() =>
   itemsInCart.value.reduce((sum, item) => sum + item.quantity, 0)
)

const allProducts = computed(() => {
   if (!categories.value) return []
   return categories.value.flatMap(cat => cat.products)
})

export const productsInCart = computed(() => {
   return itemsInCart.value
      .map(item => {
         const product = allProducts.value.find(p => p.id === item.productId)
         if (!product) return null
         return {
            productId: item.productId,
            name: product.name,
            imagePath: product.imagePath,
            priceDefault: product.priceDefault,
            quantity: item.quantity,
         }
      })
      .filter(Boolean)
})

export const productsInOrder = computed(() => {
   return productsInCart.value.filter(product => product.quantity > 0)
})

export function addProductToCart(productId) {
   const existing = itemsInCart.value.find(item => item.productId === productId)
   if (existing) {
      existing.quantity++
   } else {
      itemsInCart.value.push({ productId, quantity: 1 })
   }
}

export function minusProductFromCart(productId) {
   const existing = itemsInCart.value.find(item => item.productId === productId)
   if (!existing) return

   if (existing.quantity <= 1) removeProductFromCart(productId)
   else existing.quantity--
}

export function minusProductFromCartWithZero(productId) {
   const existing = itemsInCart.value.find(item => item.productId === productId)
   if (!existing) return

   if (existing.quantity <= 0) return
   else existing.quantity--
}

export function removeProductFromCart(productId) {
   itemsInCart.value = itemsInCart.value.filter(item => item.productId !== productId)
}

export function clearCart() {
   itemsInCart.value = []
}