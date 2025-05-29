<script setup>
import { initialize } from '~/js/client-initialize'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'
import { company, categories, authUser } from '~/js/axios-helper'
import { activateSelecteMenuController, activateMoveMenuController } from '~/js/client-menu'
import { openCloseTimeDialogIsActive } from '~/js/open-close-time'
import { repeatOrderDialogIsActive, repeatOrderDialogContent } from '~/js/user-panel'
import { formatPhone } from '~/js/phone-helper'

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

                  <div class="flex items-center gap-3.5">
                     <img v-if="company"
                          class=" h-10 w-10 lg:h-20 lg:w-20"
                          :src="company.logo_url">
                     <div v-if="company">
                        <h1 class="text-2xl font-bold lg:text-4xl">{{ company.brand_title }}</h1>
                        <div class="hidden lg:block">{{ company.tagline }}</div>
                     </div>
                  </div>

                  <div class="hidden md:flex md:items-center md:gap-4">
                     <BaseLink v-if="authUser"
                               to="/user">Личный&nbsp;кабинет</BaseLink>
                     <BaseLink v-else
                               to="/login">Войти</BaseLink>
                     <CitySelecte />
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

            <section v-for="category in categories"
                     ref="contentSections">

               <h2 :id="category.title"
                   class="text-2xl font-bold mb-5 ml-2">
                  {{ category.title }}
               </h2>

               <div class="grid grid-cols-1 gap-3.5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:w-[80%]">

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
