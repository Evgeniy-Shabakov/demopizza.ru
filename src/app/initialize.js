import { loadCities } from '@/composables/use-cities'
import { loadRestaurants } from '@/composables/use-restaurants'
import { loadCompany } from '@/composables/use-company'
import { loadCategories } from '@/composables/use-categories'
import { loadAuthUser } from '@/composables/use-auth-user'
import { pwaBtnInitialize } from '@/helpers/pwa/pwa-btn-initialize'
import '@/composables/use-theme-color'

import '@/api/api'
import '@/api/api.interceptor'

pwaBtnInitialize()

useDark()

loadCategories()
loadAuthUser()
loadCities()
loadRestaurants()
loadCompany()
