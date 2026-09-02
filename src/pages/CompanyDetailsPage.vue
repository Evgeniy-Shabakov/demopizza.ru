<script setup>
import { company } from '@/composables/useCompany'
import { formatPhone } from '@/helpers/formatPhone'
</script>

<template>
   
   <PageHeader>Реквизиты компании</PageHeader>

   <div class="flex flex-col items-center">
      <div>{{ company?.name }}</div>
      <div>
         <span>ИНН: </span>
         <span>{{ company?.legalData?.inn }}</span>
      </div>
      <div>
         <span>ОГРНИП: </span>
         <span>{{ company?.legalData?.ogrnip }}</span>
      </div>
      <div>
         <span>Адрес: </span>
         <span>{{ company?.legalData?.address }}</span>
      </div>
      <div>
         <span>тел. </span>
         <span>{{ formatPhone(company?.legalData?.legalDataPhone) }}</span>
      </div>
   </div>

   <BottomBar />

</template>