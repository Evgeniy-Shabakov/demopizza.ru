import { loadCities } from '@/composables/use-cities'
import { loadRestaurants } from '@/composables/use-restaurants'
import { loadCompany } from '@/composables/use-company'
import { loadCategories } from '@/composables/use-categories'
import { loadAuthUser } from '@/composables/use-auth-user'

import '@/api/api'
import '@/api/api.interceptor'

useDark()

loadCategories()
loadAuthUser()
loadCities()
loadRestaurants()
loadCompany()
