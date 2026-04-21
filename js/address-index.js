import { authUser } from '~/js/axios-helper.js'
import { selectedCity } from '~/js/client-helper.js'

export const userAddresses = computed(() => {
   if(!authUser.value) return []
   // return authUser.value.addresses.filter(address => address.show_to_user == true)
   return authUser.value.addresses
})

export const addressesInSelectedCity = computed(() =>
   userAddresses.value.filter(address => address.city.id === selectedCity.value.id)
)

export function findAdresseAuthUserByID(id) {
   if (!authUser.value) return null

   const adresse = authUser.value.addresses.find(el => el.id == id)

   return adresse || null
}