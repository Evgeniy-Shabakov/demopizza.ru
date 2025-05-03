<script setup>
import { initialize } from '~/js/client-initialize'
import { LOADING_TYPE } from '~/js/data-types/loading-type.js'
import { company, categories, authUser } from '~/js/axios-helper'
import { activateSelecteMenuController, activateMoveMenuController } from '~/js/client-menu'

const dataForComponentLoadingType = ref(LOADING_TYPE.LOADING)
const error = ref()

const categoriesMenu = ref()
const categoriesItems = ref([])
const contentSections = ref([])

onBeforeMount(async () => {
   try {
      await initialize()
      dataForComponentLoadingType.value = LOADING_TYPE.COMPLETE
      // setBrowserTitleForClient()
   }
   catch (err) {
      dataForComponentLoadingType.value = LOADING_TYPE.ERROR
      error.value = err
   }

})

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

            <div class="my-container py-3">
               <BaseLink to='/legal-documents'>Правовая информация</BaseLink>
            </div>

         </section>

         <section class="my-container">

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

               <div class="hidden md:block">
                  <BaseLink v-if="authUser"
                            to="/user">Личный кабинет</BaseLink>
                  <BaseLink v-else
                            to="/login">Войти</BaseLink>
               </div>

               <BurgerMenu class="md:hidden" />

            </div>

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

      <div class="text-center">
         <div>{{ error }}</div>
         <div>Попробуйте обновить страницу </div>
      </div>

      <template #actions>
         <BaseButton :click="reloadPage">Обновить</BaseButton>
      </template>

   </DialogStandart>

   <!-- <DialogMini /> -->

</template>
