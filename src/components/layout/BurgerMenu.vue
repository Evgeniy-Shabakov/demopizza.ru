<script setup>
import { Menu, X, Phone } from '@lucide/vue'
import { company } from '@/composables/useCompany'
import { formatPhone } from '@/helpers/formatPhone'

</script>

<template>
   <DropdownMenu v-slot="{ open }">
      <DropdownMenuTrigger as-child>
         <ButtonIcon variant="ghost">
            <Menu v-if="!open"
                  class="size-5" />
            <X v-else
               class="size-5" />
         </ButtonIcon>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="flex flex-col gap-2 p-2">

         <CitySelect />

         <a v-if="company?.phoneForOrders"
            :href="'tel:' + company.phoneForOrders"
            class="flex items-center justify-center gap-2 px-3 py-2.5 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer no-underline">
            <Phone class="size-4" />
            {{ formatPhone(company.phoneForOrders) }}
         </a>

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
