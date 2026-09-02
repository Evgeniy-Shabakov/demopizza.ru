<script setup>
import { Home, ArrowUp, User, ShoppingCart } from '@lucide/vue'
import { totalProductsInCart } from '@/composables/useCart'

const route = useRoute()
const router = useRouter()
const scrollY = ref(0)

function onScroll() {
   scrollY.value = window.scrollY
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const showArrowUp = computed(() => route.path === '/' && scrollY.value > 0)

function handleHomeClick() {
   if (showArrowUp.value) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
   } else {
      router.push('/')
   }
}

function isActive(path) {
   return route.path === path
}
</script>

<template>
   <nav class="fixed bottom-0 inset-x-0 bg-background border-t z-50">
     
      <div class="flex items-stretch h-full">

         <button @click="handleHomeClick"
                 class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors hover:bg-muted"
                 :class="isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'">
            <ArrowUp v-if="showArrowUp"
                     class="w-5 h-5" />
            <Home v-else
                  class="w-5 h-5" />
            <span class="text-[10px] font-medium">{{ showArrowUp ? 'Наверх' : 'Главная' }}</span>
         </button>

         <router-link :to="'/profile'"
                      class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors hover:bg-muted"
                      :class="isActive('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'">
            <User class="w-5 h-5" />
            <span class="text-[10px] font-medium">Профиль</span>
         </router-link>

         <router-link :to="'/cart'"
                      class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors hover:bg-muted"
                      :class="isActive('/cart') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'">
            <div class="relative">
               <ShoppingCart class="w-5 h-5" />
               <Badge v-if="totalProductsInCart"
                      class="absolute -top-0.5 -right-3 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                  {{ totalProductsInCart }}
               </Badge>
            </div>
            <span class="text-[10px] font-medium">Корзина</span>
         </router-link>

      </div>
   
   </nav>
</template>
