<script setup>
import { Menu, X, Phone } from '@lucide/vue'
import { company } from '@/composables/use-company'
import { formatPhone } from '@/helpers/format-phone'
import PwaInstallButton from '@/pwa/components/pwa-install-button.vue'

const isMenuOpen = ref(false) //добавлено из-за keep-alive в layout
const route = useRoute()
watch(() => route.path, () => { isMenuOpen.value = false })

</script>

<template>
   <DropdownMenu v-model:open="isMenuOpen">
      <DropdownMenuTrigger as-child>
         <ButtonIcon variant="ghost">
            <Menu v-if="!isMenuOpen"
                  class="size-5" />
            <X v-else
               class="size-5" />
         </ButtonIcon>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="flex flex-col gap-2 p-2 data-[state=closed]:animate-none!">

         <CitySelect />

         <a v-if="company?.phoneForOrders"
            :href="'tel:' + company.phoneForOrders"
            class="flex items-center justify-center gap-2 px-3 py-2.5 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer no-underline">
            <Phone class="size-4" />
            {{ formatPhone(company.phoneForOrders) }}
         </a>

         <PwaInstallButton />

         <WorkSchedule />

         <div class="flex flex-col">
            <Button variant="link"
                    size="sm"
                    as-child>
               <RouterLink to="/delivery-and-payments">
                  Доставка и оплата
               </RouterLink>
            </Button>

            <Button variant="link"
                    size="sm"
                    as-child>
               <RouterLink to="/legal-documents">
                  Правовая информация
               </RouterLink>
            </Button>

            <Button variant="link"
                    size="sm"
                    as-child>
               <RouterLink to="/company-datails">
                  Реквизиты
               </RouterLink>
            </Button>
         </div>

         <ThemeToggle />

      </DropdownMenuContent>
   </DropdownMenu>
</template>
