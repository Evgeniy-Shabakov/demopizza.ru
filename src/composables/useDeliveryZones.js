import * as turf from '@turf/turf'
import { currentCity } from './useCities'
import { currentUserAddress } from './useUserAddresses'

export const currentDeliveryZone = computed(() => {
   if (!currentCity.value || !currentUserAddress.value) return null
console.log(currentCity.value)
   const { latitude, longitude } = currentUserAddress.value

   if (latitude == null || longitude == null) {
      console.log('В адресе отсутствует широта и долгота, невозможно определить зону доставки')
      return null
   }

   const point = turf.point([longitude, latitude])

   for (const dz of currentCity.value.deliveryZones) {
      try {
         if (turf.booleanPointInPolygon(point, JSON.parse(dz.geojsonFeature))) {
            return dz
         }
      } catch (e) {
         console.error('Ошибка парсинга geojsonFeature зоны', dz.id, e)
         // пропускаем проблемную зону
      }
   }

   return null
})