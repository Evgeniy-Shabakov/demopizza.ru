import { selectedCity, selectedAddressForDelivery } from '~/js/client-helper.js'
import * as turf from '@turf/turf'

export const currentDeliveryZone = computed(() => {
   if (!selectedCity.value || !selectedAddressForDelivery.value) return

   const latitude = selectedAddressForDelivery.value.latitude
   const longitude = selectedAddressForDelivery.value.longitude

   const point = turf.point([longitude, latitude])

   const geoJson = selectedCity.value.geojson

   if (geoJson.type !== 'FeatureCollection') {
      console.error('GeoJson.type is not FeatureCollection')
      return
   }

   const deliveryZone = geoJson.features.find(feature => {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
         return turf.booleanPointInPolygon(point, feature)
      }
      return false
   })
   
   return deliveryZone
})