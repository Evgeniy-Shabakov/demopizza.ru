import { selectedCity, selectedAddressForDelivery } from '~/js/client-helper.js'
import { COOKIE_NAME } from '~/js/strings/cookie-name.js'
import { userAddresses } from '~/js/address-index.js'

export function setAddressForDelivery() {
    let id = localStorage.getItem(COOKIE_NAME.ADDRESS_DELIVERY_ID)

    if (id)
        selectedAddressForDelivery.value = userAddresses.value.find(address => address.id == id)

    // если город выбранного адреса не совпадает с текущим городом или не установлен
    // то найти первый адрес в текущем городе
    // иначе selectedAddressForDelivery.value присвоить undefined 
    if (selectedAddressForDelivery.value == null
        || selectedAddressForDelivery.value.city.id != selectedCity.value.id) {

        selectedAddressForDelivery.value = userAddresses.value
            .find(address => address.city.id === selectedCity.value.id)
    }
}