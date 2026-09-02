import { api } from '@/api/api'

export const cities = ref(null)

export const cityId = useLocalStorage('city_id', null)

export const currentCity = computed(() =>
   cities.value?.find(city => city.id == cityId.value)
)

export async function loadCities() {
   const response = await api.get('/cities')
   cities.value = response.data.data

   if (cityId.value === null && cities.value?.length) {
      cityId.value = cities.value[0].id
   }
}
