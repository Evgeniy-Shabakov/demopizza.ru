import { PAYMENT_TYPE } from "@/constants/payment-type"
import { company } from "@/composables/use-company"

export const paymentTypeId = useLocalStorage('payment_type_id', 0)

export const AVAILABLE_PAYMENT_TYPES = computed(() => {
   const enabledIds = company.value?.options?.paymentTypeSetting?.enabledPaymentTypeIds ?? []
   if (!enabledIds.length) return [PAYMENT_TYPE.CASH]
   return Object.values(PAYMENT_TYPE).filter(paymentType => enabledIds.includes(paymentType.ID))
})

watch(() => company.value?.options?.paymentTypeSetting, setting => {
   if (!company.value) return
   const enabledIds = setting?.enabledPaymentTypeIds ?? []
   const defaultId = setting?.paymentTypeIdByDefault
   const reassignedId = enabledIds.includes(Number(defaultId))
      ? Number(defaultId)
      : PAYMENT_TYPE.CASH.ID
   if (!paymentTypeId.value || !enabledIds.some(id => Number(paymentTypeId.value) === id)) {
      paymentTypeId.value = reassignedId
   }
}, { immediate: true })