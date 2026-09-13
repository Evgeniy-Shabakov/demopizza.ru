import { api } from '@/api/api'
import { cityId } from '@/composables/useCities'
import { authUser } from '@/composables/useAuthUser'

const savedCurrentUserAddressId = useLocalStorage('current_user_address_id', null)

export const userAddresses = ref([])

export const currentUserAddressId = ref(null)

export const currentUserAddress = computed({
   get: () => userAddresses.value.find(a => a.id == currentUserAddressId.value) ?? null,
   set: (address) => {
      currentUserAddressId.value = address?.id ?? null
      if (authUser.value) savedCurrentUserAddressId.value = currentUserAddressId.value
   }
})

export async function saveNewAddress(addressData) {
   if (authUser.value) {
      const res = await api.post('/addresses', addressData)
      const savedAddress = res.data.data
      userAddresses.value.push(savedAddress)
      currentUserAddress.value = savedAddress
      return savedAddress
   } else {
      const newAddress = { id: Date.now(), ...addressData }
      userAddresses.value.push(newAddress)
      currentUserAddress.value = newAddress
      return newAddress
   }
}

export async function deleteAddress(id) {
   if (!authUser.value) throw new Error('Требуется авторизация')

   await api.delete(`/addresses/${id}`)

   const isCurrent = currentUserAddress.value?.id == id
   userAddresses.value = userAddresses.value.filter(a => a.id != id)

   if (isCurrent) {
      currentUserAddress.value = null
      selectAddressForCity()
   }
}

watch(() => authUser.value, (user) => {
   if (user) {
      const guestAddress = currentUserAddress.value
      currentUserAddressId.value = savedCurrentUserAddressId.value
      if (guestAddress && !user.addresses?.some(a => a.id == guestAddress.id)) {
         saveNewAddress(guestAddress).catch(() => {})
      }
   } else {
      savedCurrentUserAddressId.value = null
   }
})

watch(() => authUser.value?.addresses, (addresses) => {
   userAddresses.value = addresses ?? []
   if (!addresses) currentUserAddress.value = null
   selectAddressForCity()
})

watch(cityId, () => {
   selectAddressForCity()
})

function selectAddressForCity() {
   if (!cityId.value) return

   const cityAddresses = userAddresses.value.filter(a => a.cityId == cityId.value)

   if (currentUserAddress.value &&
      !cityAddresses.some(a => a.id == currentUserAddress.value.id)) {
      currentUserAddress.value = null
   }

   if (currentUserAddress.value === null && cityAddresses.length) {
      currentUserAddress.value = cityAddresses[0]
   }
}