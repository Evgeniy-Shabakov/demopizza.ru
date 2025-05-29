<script setup>
import { initialize } from '~/js/client-initialize'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'
import { company, categories, authUser } from '~/js/axios-helper'
import { activateSelecteMenuController, activateMoveMenuController } from '~/js/client-menu'
import { openCloseTimeDialogIsActive } from '~/js/open-close-time'
import { repeatOrderDialogIsActive, repeatOrderDialogContent } from '~/js/user-panel'
import { formatPhone } from '~/js/phone-helper'
import { totalCountInCart } from '~/js/client-helper.js'
import {
   selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice, selectedOrderType
} from '~/js/client-helper.js'
import { ORDER_TYPE } from '~/js/data-types/order-type'

const dataForComponentLoadingType = ref(LOADING_TYPE.LOADING)
const error = ref()

const categoriesMenu = ref()
const categoriesItems = ref([])
const contentSections = ref([])

try {
   await initialize()
   dataForComponentLoadingType.value = LOADING_TYPE.COMPLETE
   // setBrowserTitleForClient()
}
catch (err) {
   dataForComponentLoadingType.value = LOADING_TYPE.ERROR
   error.value = err
}

checkAndActivateMenuControllers()

function checkAndActivateMenuControllers() {
   if (contentSections.value.length > 0 && categoriesItems.value.length > 0 && categoriesMenu.value) {
      activateSelecteMenuController(contentSections.value, categoriesItems.value)
      activateMoveMenuController(contentSections.value, categoriesItems.value, categoriesMenu.value);
   }
   else {
      setTimeout(checkAndActivateMenuControllers, 300)
   }
}

//функция вместо якорных ссылок, т.к. якорные ссылки не работают с MenuController
function scrollToCategory(index) {
   window.scrollTo({
      top: index == 0 ? 0 : contentSections.value[index].offsetTop - categoriesMenu.value.offsetHeight - 5,
      behavior: "smooth",
   })
}

function reloadPage() {
   location.reload()
}

</script>

<template>

   <Cookies />

   <slot />

   <div class="mb-12">
      <header class="bg-(--background-page-elements-color)">

         <section class="shadow-md hidden md:block">

            <ContainerX class="py-3 flex items-center justify-between">

               <BaseLink to='/legal-documents'>Правовая информация</BaseLink>

               <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                     <IconClock />
                     <span v-if="company">
                        <template v-if="company.open_time && company.close_time">
                           {{ company.open_time }} - {{ company.close_time }}
                        </template>
                        <template v-else>
                           Круглосуточно
                        </template>
                     </span>
                  </div>

                  <a v-if="company && company.phone"
                     :href="`tel:${company.phone}`"
                     target="_blank"
                     class="flex items-center justify-between gap-1">

                     <IconPhone2 />
                     <span>{{ formatPhone(company.phone) }}</span>

                  </a>

               </div>

            </ContainerX>

         </section>

         <section>

            <ContainerX>

               <div class="flex items-center justify-between py-1 md:py-2 lg:py-4 ">

                  <NuxtLink to="/"
                            class="flex items-center gap-3.5">
                     <img v-if="company"
                          class=" h-10 w-10 lg:h-20 lg:w-20"
                          :src="company.logo_url">
                     <div v-if="company">
                        <h1 class="text-2xl font-bold lg:text-4xl">{{ company.brand_title }}</h1>
                        <div class="hidden lg:block">{{ company.tagline }}</div>
                     </div>
                  </NuxtLink>

                  <div class="hidden md:flex md:items-center md:gap-4">

                     <BaseLink :to="authUser ? '/user' : '/login'">
                        {{ authUser ? 'Личный&nbsp;кабинет' : 'Войти' }}
                     </BaseLink>

                     <BaseLink to="/cart"
                               class="hidden lg:block">
                        Корзина&nbsp;({{ totalCountInCart }})
                     </BaseLink>

                     <CitySelecte class="xl:hidden" />

                  </div>

                  <BurgerMenu class="md:hidden" />

               </div>

            </ContainerX>

         </section>

      </header>

      <nav ref="categoriesMenu"
           class="sticky top-0 z-10 bg-(--background-page-elements-color) shadow-md py-2 overflow-x-auto lg:pb-3">
         <div class="my-container">

            <div v-if="categories"
                 class="flex gap-1 sm:gap-2 lg:flex-wrap">

               <div v-for="(category, index) in categories"
                    ref="categoriesItems"
                    :key="category.id"
                    @click="scrollToCategory(index)"
                    class="px-3 py-0.5 shadow-md text-nowrap cursor-pointer
                           bg-(--background-page-main-color) rounded-(--border-radius-main)
                           hover:text-(--brand-color) active:text-(--brand-color)">
                  {{ category.title }}

               </div>

            </div>

         </div>
      </nav>

      <main class="my-container">
         <div class="py-4 space-y-8">

            <NuxtLink to="/cart"
                      class="hidden lg:block xl:hidden
                      fixed right-20 bottom-10 z-100 hover:text-(--brand-color-hover)">
               <div class="border border-(--brand-color) p-5 rounded-full">
                  <div class="relative">
                     <IconCart class="h-8 w-8" />
                     <span v-if="totalCountInCart > 0"
                           class="absolute top-[-30%] right-[-30%] w-5 h-5 rounded-full text-sm
                         flex items-center justify-center
                         bg-(--brand-color) text-(--text-color-on-brand-color)">
                        {{ totalCountInCart }}
                     </span>
                  </div>
               </div>
            </NuxtLink>

            <div class="flex gap-5">

               <div class="xl:w-[70%] 2xl:w-[75%]">
                  <section v-for="category in categories"
                           ref="contentSections">

                     <h2 :id="category.title"
                         class="text-2xl font-bold mb-5 ml-2">
                        {{ category.title }}
                     </h2>

                     <div class="grid grid-cols-1 gap-3.5 
                                 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">

                        <template v-for="product in category.products"
                                  :key="product.id">

                           <ProductCard :product="product" />

                           <template v-for="(userConfig, index) in product.userConfigs"
                                     :key="userConfig.userConfigID">

                              <ProductCard :product="product"
                                           :userConfig="userConfig"
                                           :index="index" />

                           </template>

                        </template>

                     </div>

                  </section>
               </div>

               <div class="hidden xl:block xl:w-[30%] 2xl:w-[25%] space-y-4 mt-2 sticky top-16 h-max">

                  <template v-if="selectedCity">

                     <CitySelecte />

                     <OrderTypeSettings></OrderTypeSettings>

                     <div class="mt-5 border border-(--brand-color) rounded-(--border-radius-main) p-2
                       max-h-[calc(100vh-48px-112px-48px-220px)] overflow-auto">

                        <div v-if="productsInCart.length > 0"
                             class="flex flex-col gap-4">
                           <CartItem v-for="product in productsInCart"
                                     :key="product.userConfigID || product.id"
                                     :productOrUserConfig="product" />

                           <div v-if="selectedOrderType == ORDER_TYPE.delivery"
                                class="grid grid-cols-[100px_1fr_1fr] 
                                       text-sm minxs:text-base
                                       gap-1 minxs:gap-3 xs:gap-4 items-center
                                       mt-5">
                              <IconTrack class="justify-self-center text-(--brand-color-active)" />
                              <div>Доставка</div>
                              <div class=" justify-self-end">{{ deliveryPrice }}р</div>
                           </div>
                        </div>
                        <div v-else>
                           Корзина пока пуста (((
                        </div>

                     </div>

                     <div class="flex items-center justify-between gap-2 w-full">

                        <TotalBlock />

                        <div v-if="selectedOrderType == ORDER_TYPE.delivery"
                             class="text-xs text-center">
                           <div v-if="totalProductPrice < selectedCity.min_order_value_for_delivery">
                              Минимальная сумма товаров для заказа {{ Number(selectedCity.min_order_value_for_delivery)
                              }}р.
                           </div>
                           <div v-else-if="totalProductPrice < selectedCity.order_value_for_free_delivery">
                              Бесплатная доставка от {{ Number(selectedCity.order_value_for_free_delivery) }}р.
                           </div>
                           <div v-else-if="totalProductPrice >= selectedCity.order_value_for_free_delivery"
                                class="text-sm font-bold text-(--text-color-accent)">
                              Бесплатная доставка!!!
                           </div>
                        </div>

                        <BaseButton :active="totalProductPrice > 0 &&
                           (selectedOrderType !== ORDER_TYPE.delivery ||
                              totalProductPrice > selectedCity.min_order_value_for_delivery)"
                                    class="w-1/4"
                                    :click="() => navigateTo('/order-panel')">
                           Далее
                        </BaseButton>

                     </div>

                  </template>

               </div>
            </div>

         </div>
      </main>
   </div>

   <MobileNav class="h-12" />

   <BaseSpinner v-if="dataForComponentLoadingType === LOADING_TYPE.LOADING" />

   <DialogStandart :isActive="dataForComponentLoadingType === LOADING_TYPE.ERROR">
      <template #title>
         Ошибка загрузки данных
      </template>

      <div>{{ error }}</div>
      <div>Попробуйте обновить страницу </div>

      <template #actions>
         <BaseButton :click="reloadPage">Обновить</BaseButton>
      </template>

   </DialogStandart>

   <DialogStandart :isActive=openCloseTimeDialogIsActive
                   @closeDialog="openCloseTimeDialogIsActive = false">
      <template #title>
         Внимание!
      </template>

      <div v-if="company">
         Мы принимаем заказы
         <br>
         {{ `с ${company.open_time} до ${company.close_time}` }}
         <br>
         Пока вы можете добавить их в корзину
      </div>

      <template #actions>
         <BaseButton :click="() => openCloseTimeDialogIsActive = false">Закрыть</BaseButton>
      </template>

   </DialogStandart>

   <DialogStandart :isActive=repeatOrderDialogIsActive
                   @closeDialog="repeatOrderDialogIsActive = false">
      <template #title>
         Внимание!
      </template>

      <div>
         {{ repeatOrderDialogContent }}
      </div>

      <template #actions>
         <BaseButton :click="() => repeatOrderDialogIsActive = false">Закрыть</BaseButton>
      </template>

   </DialogStandart>

</template>
