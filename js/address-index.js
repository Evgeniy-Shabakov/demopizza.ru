import { authUser } from '~/js/axios-helper.js'

export const userAddresses = computed(() =>
   authUser.value.addresses.filter(address => address.show_to_user == true)
)

export function findAdresseAuthUserByID(id) {
   if (!authUser.value) return null
  
   const adresse = authUser.value.addresses.find(el => el.id == id)

   return adresse || null
}