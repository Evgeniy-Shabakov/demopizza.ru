import { selectedCity, selectedAddressForDelivery } from '~/js/client-helper.js'
import * as turf from '@turf/turf'

export const currentDeliveryZone = computed(() => {
   if (!selectedCity.value || !selectedAddressForDelivery.value) return null

   const { latitude, longitude } = selectedAddressForDelivery.value

   if (latitude == null || longitude == null) {
      console.log('В адресе отсутствует широта и долгота, невозможно определить зону доставки')
      return null
   }

   const point = turf.point([longitude, latitude])

   for (const dz of selectedCity.value.deliveryZones) {
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