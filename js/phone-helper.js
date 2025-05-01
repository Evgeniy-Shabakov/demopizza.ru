
export function formatPhone(value) {
   if (!value) return ''

   const phoneNumber = value.replace(/\D/g, '')

   return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9)}`
}