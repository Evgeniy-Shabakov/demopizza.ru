import { LOADING_TYPE } from '~/js/data-types/loading-type.js'
import {
   company, countries, cities, categories, restaurants, ingredients, authUser, getAuthUser,
   getModelsAxios, activeDesign, getActiveDesign, getCompany
} from '~/js/axios-helper.js'

const MAX_RETRIES = 3; // Максимальное количество попыток загрузки

export async function loadCompany() {
   if (company.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getCompany()
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading company (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}

export async function loadCategories() {
   if (categories.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getModelsAxios('categories?include=products')
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading categories (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}

export async function loadCountries() {
   if (countries.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getModelsAxios('countries')
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading countries (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}

export async function loadCities() {
   if (cities.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getModelsAxios('cities?include=restaurants,deliveryZones')
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading countries (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}

export async function loadRestaurants() {
   if (restaurants.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getModelsAxios('restaurants?include=city,address,restaurantSchedule')
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading restaurants (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }


}

export async function loadIngredients() {
   if (ingredients.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getModelsAxios('ingredients')
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading restaurants (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }


}

export async function loadCurrentAuthUser() {
   if (authUser.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getAuthUser()
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading user (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}

export function getFirstCityId() {
   if (countries.value == null) return null

   for (let i = 0; i < countries.value.length; i++) {
      if (countries.value[i].cities.length)
         return countries.value[i].cities[0].id
   }

   return null
}

export async function loadActiveDesign() {
   if (activeDesign.value) return LOADING_TYPE.complete;

   let retryCount = 0

   while (retryCount < MAX_RETRIES) {
      try {
         await getActiveDesign()
         return LOADING_TYPE.complete;
      } catch (err) {
         console.log(`Error loading user (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err)

         retryCount++
         if (retryCount === MAX_RETRIES) {
            throw err
         }

         await new Promise(resolve => setTimeout(resolve, 1000)) // Задержка перед следующей попыткой
      }
   }
}
