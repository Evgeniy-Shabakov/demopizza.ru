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

loadCategories()
loadAuthUser()
loadCities()
loadRestaurants()
loadCompany()

setServerFavicon()

function setServerFavicon() {
   const serverFaviconUrl = `${serverOrigin}/images/favicon.png`

   const faviconProbe = new Image()
   faviconProbe.onload = () => useFavicon(serverFaviconUrl)
   faviconProbe.src = serverFaviconUrl
}
