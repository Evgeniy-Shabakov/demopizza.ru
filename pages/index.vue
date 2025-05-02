<script setup>
import { company, categories, authUser } from '~/js/axios-helper'
import { activateSelecteMenuController, activateMoveMenuController, getIndexCentrSection } from '~/js/client-menu'

const categoriesMenu = ref()
const categoriesMenuInner = ref()
const contentInner = ref()
const categoriesItems = ref([])
const contentSections = ref([])

onMounted(() => {
   // activateSelecteMenuController(contentSections.value, categoriesItems.value)
   // activateMoveMenuController(contentSections.value, categoriesItems.value, categoriesMenuInner.value)
})

onUpdated(() => {
   //изменяем отступ при скролле для меню категорий в зависимости от высоты меню
   //высота меняется несколько раз при загрузке странице и категорий с продуктами

   setTimeout(() => { //таймаут так как DOM обновляется с задержкой
      if (categoriesMenu.value == null) return // чтобы избежать ошибок

      let scrollPaddingTop = categoriesMenu.value.offsetHeight + 20 + 'px'
      document.documentElement.style.setProperty('--scroll-padding-top', scrollPaddingTop)
   }, 0, 3 * 1000)
})


//функция вместо якорных ссылок, т.к. якорные ссылки не работают с moveMenu()
function scrollToCategory(index) {
   window.scrollTo({
      top: index == 0 ? 0 : contentSections.value[index].offsetTop - categoriesMenu.value.offsetHeight - 20,
      behavior: "smooth",
   })
}
</script>

<template>

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
        class="bg-(--background-page-elements-color) shadow-md py-2 overflow-x-auto lg:pb-3">
      <div class="my-container">

         <div v-if="categories"
              ref="categoriesMenuInner"
              class="flex gap-1 sm:gap-2 lg:flex-wrap">

            <div v-for="(category, index) in categories"
                 class="px-3 py-0.5 shadow-md text-nowrap
                        bg-(--background-page-main-color) rounded-(--border-radius-categories-menu)
                        hover:text-(--brand-color) active:text-(--brand-color)">
               <a ref="categoriesItems"
                  :key="index"
                  @click="scrollToCategory(index)"
                  :href="'#' + category.title">
                  {{ category.title }}
               </a>
            </div>

         </div>

      </div>
   </nav>

   <div class="my-container">
      index
   </div>



</template>
