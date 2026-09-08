import { cityId } from '@/composables/useCities'
import { authUser } from '@/composables/useAuthUser'

export const userAddresses = ref([])
export const currentUserAddress = ref(null)

watch(() => authUser.value?.addresses, (addresses) => {
   userAddresses.value = addresses ?? []
   selectAddressForCity()
})

watch(cityId, () => {
   selectAddressForCity()
})

function selectAddressForCity() {
   if (!cityId.value) return

   const cityAddresses = userAddresses.value.filter(a => a.cityId == cityId.value)

   if (currentUserAddress.value && !cityAddresses.some(a => a.id === currentUserAddress.value.id)) {
      currentUserAddress.value = null
   }

   if (currentUserAddress.value === null && cityAddresses.length) {
      currentUserAddress.value = cityAddresses[0]
   }
}