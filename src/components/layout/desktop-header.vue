<script setup>
import {
   Phone,
   Clock,
   Sun,
   Moon,
   Home,
   User,
   ShoppingCart,
   Truck,
   FileText,
   Building2,
} from '@lucide/vue'
import { company } from '@/composables/use-company'
import { formatPhone } from '@/helpers/format-phone'
import { totalProductsInCart } from '@/composables/use-cart'
import logo from '@/assets/images/logo.png'

const brandName = import.meta.env.VITE_BRAND_NAME

const route = useRoute()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const navLinks = [
   { label: 'Главная', to: '/', icon: Home },
   { label: 'Личный кабинет', to: '/profile', icon: User },
   { label: 'Корзина', to: '/cart', icon: ShoppingCart, badge: true },
   { label: 'Доставка и оплата', to: '/delivery-and-payments', icon: Truck },
   { label: 'Правовая информация', to: '/legal-documents', icon: FileText },
   { label: 'Реквизиты', to: '/company-datails', icon: Building2 },
]

function isNavActive(link) {
   if (link.to === '/profile') {
      return route.path.startsWith('/profile') || route.path === '/login'
   }
   return route.path === link.to
}
</script>

<template>
   <header id="desktop-header"
        class="hidden lg:block border-b bg-background">

      <ContainerX>

         <div class="h-16 flex items-center justify-between gap-4">

            <RouterLink to="/"
                        class="flex items-center gap-2 shrink-0">
               <img :src="logo"
                    class="size-10 object-contain" />
               <span class="font-bold text-2xl">{{ brandName }}</span>
            </RouterLink>

            <div class="flex items-center gap-2 shrink-0">

               <div class="w-44 shrink-0">
                  <CitySelect />
               </div>

               <a v-if="company?.phoneForOrders"
                  :href="'tel:' + company.phoneForOrders"
                  class="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Phone class="size-4 shrink-0" />
                  <span>{{ formatPhone(company.phoneForOrders) }}</span>
               </a>

               <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                     <ButtonIcon variant="ghost">
                        <Clock class="size-5" />
                     </ButtonIcon>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent class="flex flex-col gap-2 p-2">
                     <WorkSchedule />
                  </DropdownMenuContent>
               </DropdownMenu>

               <ButtonIcon variant="ghost"
                           @click="toggleDark()">
                  <Sun v-if="!isDark"
                       class="size-5" />
                  <Moon v-else
                        class="size-5" />
               </ButtonIcon>

            </div>

         </div>

      </ContainerX>

      <div class="border-t">

         <ContainerX>

            <nav class="h-14 flex items-center gap-1">

               <RouterLink v-for="link in navLinks"
                           :key="link.to"
                           :to="link.to"
                           class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                           :class="isNavActive(link)
                              ? 'text-primary'
                              : 'text-muted-foreground hover:bg-muted'">
                  <component :is="link.icon"
                             class="size-4 shrink-0" />
                  <span>{{ link.label }}</span>
                  <Badge v-if="link.badge && totalProductsInCart"
                         class="h-4 min-w-4 rounded-full px-1 text-[10px] font-mono tabular-nums">
                     {{ totalProductsInCart }}
                  </Badge>
               </RouterLink>

            </nav>

         </ContainerX>

      </div>

   </header>
</template>