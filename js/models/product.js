import { categories, restaurants } from '~/js/axios-helper.js'
import { selectedCity, restaurantsInSelectedCity, selectedRestaurant, selectedOrderType } from '../client-helper'
import { ORDER_TYPE } from '../data-types/order-type'

export function findProductById(id) {
   for (const category of categories.value) {
      const product = category.products.find(product => product.id === id)
      if (product) {
         return product
      }
   }
   return null
}

export function setStatusAllIngredientsIsAvailableForProdacts() {
   categories.value.forEach(category => {
      category.products.forEach(product => {
         product.allIngredientIsAvailable = checkAvailabilityIngredientsForProduct(product)
      })
   })
}

export function checkProductAvailabilityForCart(product) {
   if (!product) return false
   if (!product.isActive) return false

   if (product.isInStopListForSelectedCity) return false
   if (product.isInStopListForSelectedRestaurant &&
      selectedOrderType.value.ID != ORDER_TYPE.DELIVERY_TO_ADDRESS.ID) {
         return false
   }

   // if (!product.allIngredientIsAvailable) return false

   return true
}

export function isProductInStopListForSelectedCity(product) {
   if (!product.productRestaurants) return false
   if (product.productRestaurants.length == 0) return false
   
   return restaurantsInSelectedCity.every(rest =>
      product.productRestaurants.some(productRestaurant =>
         productRestaurant.restaurantId === rest.id &&
         productRestaurant.isInStopList
      )
   )
}

export function isProductInStopListForSelectedRestaurant(product) {
   if (!product.productRestaurants) return false
   if (product.productRestaurants.length == 0) return false

   return product.productRestaurants.some(productRestaurant =>
      productRestaurant.restaurantId == selectedRestaurant.value.id &&
      productRestaurant.isInStopList)
}

function checkAvailabilityIngredientsForProduct(product) {
   if (!product) return false

   for (let ingredient of product.base_ingredients) {
      if (!ingredient.is_active) return false
      if (ingredient.is_in_stop_list) return false
   }

   return true
}