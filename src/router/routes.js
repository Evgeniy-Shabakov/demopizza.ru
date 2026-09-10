import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
import DeliveryAddressesPage from '@/pages/profile/DeliveryAddressesPage.vue'
import ProfileEditPage from '@/pages/profile/ProfileEditPage.vue'
import OrderHistoryPage from '@/pages/profile/OrderHistoryPage.vue'
import CartPage from '@/pages/CartPage.vue'
import CompanyDetailsPage from '@/pages/info/CompanyDetailsPage.vue'
import LegalDocumentsIndexPage from '@/pages/info/LegalDocumentsIndexPage.vue'
import LegalDocumentPage from '@/pages/info/LegalDocumentPage.vue'
import DeliveryAndPaymentsPage from '@/pages/info/DeliveryAndPaymentsPage.vue'
import MapPage from '@/pages/info/MapPage.vue'
import CreateAddressPage from '@/pages/CreateAddressPage.vue'
import OrderPanelPage from '@/pages/OrderPanelPage.vue'
import PhonePage from '@/pages/PhonePage.vue'
import OrderSuccessPage from '@/pages/OrderSuccessPage.vue'
import LoginPage from '@/pages/LoginPage.vue'

export const routes = [
   {
      path: '/',
      component: DefaultLayout,
      children: [
         { path: '', name: 'home', component: HomePage },
         { path: 'profile', name: 'profile', component: ProfilePage },
         { path: 'profile/delivery-addresses', name: 'profile-delivery-addresses', component: DeliveryAddressesPage },
         { path: 'profile/edit', name: 'profile-edit', component: ProfileEditPage },
         { path: 'profile/order-history', name: 'profile-order-history', component: OrderHistoryPage },
         { path: 'login', name: 'login', component: LoginPage },
         { path: 'cart', name: 'cart', component: CartPage },
         { path: 'phone', name: 'phone', component: PhonePage },
         { path: 'order-panel', name: 'order-panel', component: OrderPanelPage },
         { path: 'order-success', name: 'order-success', component: OrderSuccessPage },
         { path: 'company-datails', name: 'company-datails', component: CompanyDetailsPage },
          { path: 'delivery-and-payments', name: 'delivery-and-payments', component: DeliveryAndPaymentsPage },
          { path: 'map', name: 'map', component: MapPage },
         { path: 'legal-documents', name: 'legal-documents', component: LegalDocumentsIndexPage },
         { path: 'legal-documents/:id', name: 'legal-document', component: LegalDocumentPage },
         { path: 'create-address', name: 'create-address', component: CreateAddressPage },
      ],
   },
]
