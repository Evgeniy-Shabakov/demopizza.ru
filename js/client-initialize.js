import { company, categories, cities, activeDesign, restaurants } from '~/js/axios-helper.js'
import {
   selectedCity, selectedRestaurant, selectedOrderType,
   selectedOrderInRestaurantType, plusProductToCart, selectedAddressForDelivery
}
   from '~/js/client-helper.js'
import {
   loadCompany, loadCurrentAuthUser, loadCities, loadCategories, loadRestaurants, loadActiveDesign
} from '~/js/loading-helper.js'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'
import { ORDER_TYPE } from '~/js/data-types/order-type.js'
import { ORDER_IN_RESTAURANT_TYPE } from '~/js/data-types/order-in-restaurant-type'
import { COOKIE_NAME } from '~/js/strings/cookie-name.js'
import { adjustColor } from '~/js/color'
import { initializeUserConfigsForProducts } from '~/js/save/user-configs-products'
import { checkOperatingModeAndActivateDialog } from '~/js/open-close-time'
import { findProductById, checkProductAvailabilityForCart, setStatusAllIngredientsIsAvailableForProdacts }
   from '~/js/models/product'
import { userAddresses } from '~/js/address-index.js'
import { serverApiUrl, serverUrl } from '~/env.js'

export async function initialize() {

   try {
      await initializeCategories()

      // setStatusAllIngredientsIsAvailableForProdacts()

      initializeDesign()

      initializeCity().then(() => initializeRestaurant())

      loadCompany().then(() => {
         useHead({
            title: `${company.value?.brandName}`,
         })
         checkOperatingModeAndActivateDialog()

         company.value.logoPath = serverUrl + '/' + company.value.logoPath.replace(/^storage\/public\/?/, '')
      })

      loadCurrentAuthUser().then(() => setAddressForDelivery())

      // initializeUserConfigsForProducts()

      initializeCart()
      initializeOrderType()
      initializeOrderInRestaurantType()

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

async function initializeCategories() {
   try {
      await loadCategories()
// console.log(categories.value)

      //убираем из списка неактивные продукты и пустые категории чтобы не отображались
      categories.value.forEach(category => {
         category.products = category.products.filter(product => product.isActive == true)
      })
      categories.value = categories.value.filter(category => category.products?.length > 0)

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

export async function initializeCity() {
   try {
      await loadCities()

      let id = localStorage.getItem(COOKIE_NAME.CITY_ID)

      if (id)
         selectedCity.value = cities.value.find(city => city.id == id)

      if (selectedCity.value == null)
         selectedCity.value = cities.value[0]

      return LOADING_TYPE.complete
   }
   catch (error) {
      console.log(error)
      throw error
   }
}

export async function initializeRestaurant() {
   try {
      await loadRestaurants()

      let id = localStorage.getItem(COOKIE_NAME.RESTAURANT_ID)

      if (id)
         selectedRestaurant.value = restaurants.value.find(restaurant => restaurant.id == id)

      //добавить проверку на соотвествие ресторана городу
      if (selectedRestaurant.value == null)
         selectedRestaurant.value = restaurants.value[0]

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

function initializeCart() {
   if (localStorage.getItem(COOKIE_NAME.CART) == null) return

   let oldProductsInCart = JSON.parse(localStorage.getItem(COOKIE_NAME.CART))

   //т.к. инициализация корзины сложный процесс, учитывая изменения в товарах и ингредиентах
   //то оборачиваем в try catch
   try {
      for (const oldProduct of oldProductsInCart) {

         const product = findProductById(oldProduct.id)

         if (!product) continue
         if (!checkProductAvailabilityForCart(product)) continue

         if (!oldProduct.userConfigID) {
            plusProductToCart(product, null, oldProduct.countInCart)
         }
         else {
            if (Array.isArray(product.userConfigs)) {
               let userConfig = product.userConfigs.find(el => el.userConfigID == oldProduct.userConfigID)

               if (userConfig) {
                  plusProductToCart(product, userConfig, oldProduct.countInCart)
               }
            }
         }

      }
   }
   catch (error) {
      console.log(error)
      localStorage.removeItem(COOKIE_NAME.CART)
      //throw error - ошибку не выбрасываем, чтобы не прерывать работу приложения, 
      //а просто удаляем все с корзины
   }
}

function initializeOrderType() {
   selectedOrderType.value = localStorage.getItem(COOKIE_NAME.ORDER_TYPE)

   if (selectedOrderType.value == null)
      selectedOrderType.value = ORDER_TYPE.delivery
}

function initializeOrderInRestaurantType() {
   selectedOrderInRestaurantType.value = localStorage.getItem(COOKIE_NAME.ORDER_IN_RESTAURANT_TYPE)

   if (selectedOrderInRestaurantType.value == null)
      selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.COUNTER
}

export async function initializeDesign() {
   try {
      await loadActiveDesign()

      // Получаем корневой элемент документа
      const root = document.documentElement

      // Устанавливаем новое значение для CSS переменной
      root.style.setProperty('--background-page-main-color', activeDesign.value.backgroundPageMainColor)
      root.style.setProperty('--background-page-elements-color', activeDesign.value.backgroundPageElementsColor)
      root.style.setProperty('--brand-color', activeDesign.value.brandColor)
      root.style.setProperty('--text-color-main', activeDesign.value.textColorMain)
      root.style.setProperty('--text-color-on-brand-color', activeDesign.value.textColorOnBrandColor)
      root.style.setProperty('--text-color-accent', activeDesign.value.textColorAccent)
      root.style.setProperty('--bottom-nav-color', activeDesign.value.bottomNavColor)

      root.style.setProperty('--brand-color-hover', adjustColor(activeDesign.value.brandColor, -20))
      root.style.setProperty('--brand-color-active', adjustColor(activeDesign.value.brandColor, 20))
      root.style.setProperty('--background-active-category', adjustColor(activeDesign.value.brandColor, 125))
      root.style.setProperty('--border-color-order-settings', adjustColor(activeDesign.value.backgroundPageMainColor, -70))

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

function setAddressForDelivery() {
   let id = localStorage.getItem(COOKIE_NAME.ADDRESS_DELIVERY_ID)

   if (id)
      selectedAddressForDelivery.value = userAddresses.value.find(address => address.id == id)

   // если город выбранного адреса не совпадает с текущим городом или не установлен
   // то найти первый адрес в текущем городе
   // иначе selectedAddressForDelivery.value присвоить undefined 
   if (selectedAddressForDelivery.value == null
      || selectedAddressForDelivery.value.cityId != selectedCity.value.id) {

      selectedAddressForDelivery.value = userAddresses.value
         .find(address => address.cityId === selectedCity.value.id)
   }
}





