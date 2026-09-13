const baseUrl = import.meta.env.VITE_SERVER_BASE_URL

function normalizeProductImagePath(product) {
   if (!product || !product.imagePath) return

   product.imagePath = `${baseUrl}/${product.imagePath.replace(/^\//, '')
      .replace(/^storage\/public\/?/, '')}`
}

export function normalizeProductImagePathForCategories(categories) {
   categories.forEach(category => {
      category.products.forEach(product => {
         normalizeProductImagePath(product)
      })
   })
}

export function normalizeProductImagePathForOrders(orders) {
   orders.forEach(order => {
      order.orderProducts?.forEach(orderProduct => {
         normalizeProductImagePath(orderProduct.product)
      })
   })
}

export function normalizeProductImagePathForOrder(order) {
   order?.orderProducts?.forEach(orderProduct => {
      normalizeProductImagePath(orderProduct.product)
   })
}