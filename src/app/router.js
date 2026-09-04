import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import CartPage from '@/pages/CartPage.vue'
import CompanyDetailsPage from '@/pages/CompanyDetailsPage.vue'
import LegalDocumentsIndexPage from '@/pages/legal-documents/LegalDocumentsIndexPage.vue'
import LegalDocumentPage from '@/pages/legal-documents/LegalDocumentPage.vue'
import DeliveryAndPaymentsPage from '@/pages/DeliveryAndPaymentsPage.vue'
import MapPage from '@/pages/MapPage.vue'
import CreateAddressPage from '@/pages/CreateAddressPage.vue'
import OrderPanelPage from '@/pages/OrderPanelPage.vue'
import PhonePage from '@/pages/PhonePage.vue'
import OrderStatusPage from '@/pages/OrderStatusPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { authUser } from '@/composables/useAuthUser'

const scrollPositions = new Map()

const routes = [
   {
      path: '/',
      component: DefaultLayout,
      children: [
         { path: '', name: 'home', component: HomePage },
         { path: 'profile', name: 'profile', component: ProfilePage },
         { path: 'login', name: 'login', component: LoginPage },
         { path: 'cart', name: 'cart', component: CartPage },
         { path: 'phone', name: 'phone', component: PhonePage },
         { path: 'order-panel', name: 'order-panel', component: OrderPanelPage },
         { path: 'order-status', name: 'order-status', component: OrderStatusPage },
         { path: 'company-datails', name: 'company-datails', component: CompanyDetailsPage },
         { path: 'delivery-and-payments', name: 'delivery-and-payments', component: DeliveryAndPaymentsPage },
         { path: 'map', name: 'map', component: MapPage },
         { path: 'legal-documents', name: 'legal-documents', component: LegalDocumentsIndexPage },
         { path: 'legal-documents/:id', name: 'legal-document', component: LegalDocumentPage },
         { path: 'create-address', name: 'create-address', component: CreateAddressPage },
      ],
   },
]

const router = createRouter({
   history: createWebHistory(),
   routes,
   scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
         return savedPosition
      }
      const saved = scrollPositions.get(to.name)
      if (saved !== undefined) {
         return { top: saved, behavior: 'instant' }
      }
      return { top: 0 }
   },
})

router.beforeEach((to, from) => {
   if (from.name) {
      scrollPositions.set(from.name, window.scrollY)
   }
})

const PROTECTED_ROUTES = ['profile']

router.beforeEach((to) => {
   if (PROTECTED_ROUTES.includes(to.name) && !authUser.value) {
      return { name: 'login' }
   }

   if (to.name == 'login' && authUser.value) {
      return { name: 'profile' }
   }
})

export default router
