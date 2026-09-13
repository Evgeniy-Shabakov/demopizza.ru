import DefaultLayout from '@/layouts/default.layout.vue'
import HomePage from '@/pages/home.page.vue'
import ProfilePage from '@/pages/profile/profile.page.vue'
import DeliveryAddressesPage from '@/pages/profile/delivery-addresses.page.vue'
import ProfileEditPage from '@/pages/profile/profile-edit.page.vue'
import OrderHistoryPage from '@/pages/profile/order-history.page.vue'
import CartPage from '@/pages/cart.page.vue'
import CompanyDetailsPage from '@/pages/info/company-details.page.vue'
import LegalDocumentsIndexPage from '@/pages/info/legal-documents-index.page.vue'
import LegalDocumentPage from '@/pages/info/legal-document.page.vue'
import DeliveryAndPaymentsPage from '@/pages/info/delivery-and-payments.page.vue'
import MapPage from '@/pages/info/map.page.vue'
import CreateAddressPage from '@/pages/create-address.page.vue'
import OrderPanelPage from '@/pages/order-panel.page.vue'
import PhonePage from '@/pages/phone.page.vue'
import OrderSuccessPage from '@/pages/order-success.page.vue'
import LoginPage from '@/pages/login.page.vue'
import ProductPage from '@/pages/product.page.vue'

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
         { path: 'products/:id', name: 'product', component: ProductPage },
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
