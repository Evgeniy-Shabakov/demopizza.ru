import { loadCities } from '@/composables/useCities'
import { loadRestaurants } from '@/composables/useRestaurants'
import { loadCompany } from '@/composables/useCompany'
import { loadCategories } from '@/composables/useCategories'

useDark()

loadCategories()
loadCities()
loadRestaurants()
loadCompany()
