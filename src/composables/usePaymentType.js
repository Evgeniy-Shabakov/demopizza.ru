import { PAYMENT_TYPE } from "@/constants/paymentType"

export const paymentTypeId = useLocalStorage(
   'payment_type_id', Number(import.meta.env.VITE_PAYMENT_TYPE_BY_DEFAULT))

export const AVAILABLE_PAYMENT_TYPES = Object.freeze(
   Object.values(PAYMENT_TYPE).filter(paymentType =>
      import.meta.env.VITE_ENABLED_PAYMENT_TYPE_IDS.includes(paymentType.ID))
)