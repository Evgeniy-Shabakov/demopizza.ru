import { loadCities } from '@/composables/use-cities'
import { loadRestaurants } from '@/composables/use-restaurants'
import { loadCompany } from '@/composables/use-company'
import { loadCategories } from '@/composables/use-categories'
import { loadAuthUser } from '@/composables/use-auth-user'
import { pwaBtnInitialize } from '@/pwa/helpers/pwa-btn-initialize'
import { serverOrigin } from '@/api/api'

import '@/api/api'
import '@/api/api.interceptor'

pwaBtnInitialize()

useDark()

useFavicon(`${serverOrigin}/images/favicon.png`)

loadCategories()
loadAuthUser()
loadCities()
loadRestaurants()
loadCompany()
