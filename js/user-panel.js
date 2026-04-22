import { getActiveOrdersForUser, categories } from '~/js/axios-helper.js'
import { plusProductToCart, removeAllProductsFromCart, productsInCart }
   from '~/js/client-helper.js'
// import { activateDialogMini } from '/src/store/client/block/dialog-mini'
import { findProductById, checkProductAvailabilityForCart } from '~/js/models/product'

export const repeatOrderDialogIsActive = ref(false)
export const repeatOrderDialogContent = ref()

//загрузка статусов активных заказов через запрос в бэк - START
export let intervalLoadActiveOrders

export async function loadActiveOrdersForUserAndRestartInterval(userID) {
   clearInterval(intervalLoadActiveOrders)

   await getActiveOrdersForUser(userID)

   intervalLoadActiveOrders = setInterval(() => {
      getActiveOrdersForUser(userID)
   }, 30000)
}
//загрузка статусов активных заказов через запрос в бэк - END

export function repeatOrder(order) {
   console.log(order)
   
   if (order == null) return

   removeAllProductsFromCart()

   for (const productInOrder of order.orderProducts) {

      const product = findProductById(productInOrder.id)

      if (!product) continue
      if (!checkProductAvailabilityForCart(product)) continue

      if (!productInOrder.user_config_id) {
         plusProductToCart(product, null, productInOrder.quantity)
      }

      if (productInOrder.user_config_id && product.userConfigs) {
         let userConfig = product.userConfigs.find(el => el.userConfigID == productInOrder.user_config_id)

         if (userConfig) {
            plusProductToCart(product, userConfig, productInOrder.quantity)
         }
      }

   }

   if (productsInCart.value.length == order.orderProducts.length) {
      navigateTo('/cart')
   }

   else if (productsInCart.value.length > 0) {
      navigateTo('/cart')

      repeatOrderDialogIsActive.value = true
      repeatOrderDialogContent.value =
         'Не все товары добавлены в корзину, возможно некоторые товары временно недоступны, попробуйте добавить их из меню'
   }

   else {
      repeatOrderDialogIsActive.value = true
      repeatOrderDialogContent.value =
         'Товары не добавлены в корзину, возможно они временно недоступны, попробуйте добавить их из меню'
   }
}