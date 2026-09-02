<script setup>
import { AVAILABLE_PAYMENT_TYPES, paymentTypeId } from '@/composables/usePaymentType'
</script>

<template>
   <div>
      <Label class="mb-1.5">Выбирите способ оплаты</Label>
      <NativeSelect v-model="paymentTypeId">
         <NativeSelectOption v-for="paymentType in Object.values(AVAILABLE_PAYMENT_TYPES)"
                             :key="paymentType.ID"
                             :value="paymentType.ID">
            {{ paymentType.NAME }}
         </NativeSelectOption>
      </NativeSelect>
   </div>
</template>