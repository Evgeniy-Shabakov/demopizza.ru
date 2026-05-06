<script setup>
import axios from 'axios'
import { authUser, getAuthUser } from '~/js/axios-helper.js'
import { selectedCity, selectedAddressForDelivery } from '~/js/client-helper.js'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { previousRoute } from '~/middleware/previous-route.global'
import { findAdresseAuthUserByID } from '~/js/address-index.js'

const router = useRouter()
const id = useRoute().params.id

const addressInputedData = reactive({
   initialize(address) {
      this.userId = authUser.value.id,

         this.cityId = selectedCity.value.id,
         this.street = address?.street || null,
         this.house = address?.house || null,
         this.corps = address?.corps || null,
         this.flat = address?.flat || null,
         this.entrance = address?.entrance || null,
         this.floor = address?.floor || null,
         this.entranceCode = address?.entranceCode || null,
         this.name = address?.name || null,
         this.comment = address?.comment || null,

         this.latitude = address?.latitude || null,
         this.longitude = address?.longitude || null,
         this.addressAsString = address?.addressAsString || null
   }
})

watchEffect(() => {
   if (authUser.value) {
      addressInputedData.initialize(findAdresseAuthUserByID(id))
   }
})

const validationErrors = ref({})
const validationError = ref()  //общая ошибка - временное решение

async function addAddress() {
   try {
      if (addressInputedData.entrance) addressInputedData.entrance = Number(addressInputedData.entrance)
      if (addressInputedData.floor) addressInputedData.floor = Number(addressInputedData.floor)

      const res = await axios.post(`/users/${addressInputedData.userId}/addresses`, addressInputedData)

      selectedAddressForDelivery.value = res.data.data
      authUser.value.addresses.push(selectedAddressForDelivery.value)

      if (previousRoute.name == 'login') navigateTo('/cart')
      else router.back()
   } catch (error) {
      if (error.response?.status === 422) {

         validationError.value = error.response.data.message
         // transformValidateErrorsForUI(validationErrors.value)
         console.log(error)
      }
   }
}

async function editAddress() {
   try {
      if (addressInputedData.entrance) addressInputedData.entrance = Number(addressInputedData.entrance)
      if (addressInputedData.floor) addressInputedData.floor = Number(addressInputedData.floor)

      await axios.put(`/users/${authUser.value.id}/addresses/${id}`, addressInputedData)
      await getAuthUser()

      router.back()
   }
   catch (error) {
      if (error.response?.status === 422) {
         // validationErrors.value = error.response.data.errors
         // transformValidateErrorsForUI(validationErrors.value)
         validationError.value = error.response.data.message
         console.log(error)
      }
   }
}

const daDataAddress = ref()

// инициализация daDataAdress для редактирования адреса (имитируем json с бекенда)
if (addressInputedData.addressAsString) {
   daDataAddress.value = {}
   daDataAddress.value.value = addressInputedData.addressAsString
   daDataAddress.value.valueModified = addressInputedData.addressAsString
   daDataAddress.value.street = addressInputedData.street
   daDataAddress.value.house = addressInputedData.house
   daDataAddress.value.flat = addressInputedData.flat
   daDataAddress.value.latitude = addressInputedData.latitude
   daDataAddress.value.longitude = addressInputedData.longitude
}

watchEffect(() => {
   addressInputedData.street = daDataAddress.value?.street
   addressInputedData.house = daDataAddress.value?.house
   addressInputedData.flat = daDataAddress.value?.flat
   addressInputedData.latitude = daDataAddress.value?.latitude
   addressInputedData.longitude = daDataAddress.value?.longitude
   addressInputedData.addressAsString = daDataAddress.value?.valueModified
})
</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="selectedCity"
          class="text-xl text-center font-semibold">

         <template v-if="previousRoute.name == 'user-adresses'">
            Добавление адреса
         </template>

         <template v-else>
            <div>{{ selectedCity.name }}</div>
            <div class="font-normal text-base">
               (добавление адреса)
            </div>
         </template>

      </h1>

      <template v-if="selectedCity">

         <!-- изменение города только в личном кабинете, при оформлении заказа адрес добавляется только к текущему городу -->

         <CitySelecte v-if="previousRoute.name == 'user-adresses'" />

         <div>
            <DaDataAdressInput v-model="daDataAddress"
                               @click="validationErrors.street = null; validationErrors.house = null" />
            <!-- <BaseInvalidateText>{{ validationErrors.street }}</BaseInvalidateText>
            <BaseInvalidateText>{{ validationErrors.house_number }}</BaseInvalidateText> -->
            <BaseInvalidateText>{{ validationError }}</BaseInvalidateText>
         </div>


         <div class="grid grid-cols-3 gap-5">

            <div>
               <BaseFormLabel class="mb-1"
                              :required="false">Подъезд</BaseFormLabel>
               <BaseInputNumber class="w-full"
                                v-model="addressInputedData.entrance"
                                @click="validationErrors.entrance = ''" />
               <!-- <BaseInvalidateText>{{ validationErrors.entrance_number }}</BaseInvalidateText> -->
            </div>

            <div>
               <BaseFormLabel class="mb-1"
                              :required="false">Этаж</BaseFormLabel>
               <BaseInputNumber class="w-full"
                                v-model="addressInputedData.floor"
                                @click="validationErrors.floor = ''" />
               <!-- <BaseInvalidateText>{{ validationErrors.floor }}</BaseInvalidateText> -->
            </div>

            <div>
               <BaseFormLabel class="mb-1"
                              :required="false">Код от подъезда</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.entranceCode"
                              @click="validationErrors.entranceCode = ''" />
               <!-- <BaseInvalidateText>{{ validationErrors.entranceCode }}</BaseInvalidateText> -->
            </div>

         </div>

         <div>
            <BaseFormLabel class="mb-1"
                           :required="false">Название для адреса (дом, работа)</BaseFormLabel>
            <BaseInputText class="w-full"
                           v-model="addressInputedData.name"
                           @click="validationErrors.name = ''" />
            <!-- <BaseInvalidateText>{{ validationErrors.name }}</BaseInvalidateText> -->
         </div>

         <div>
            <BaseFormLabel class="mb-1"
                           :required="false">Комментарий к адресу</BaseFormLabel>
            <BaseTextarea v-model="addressInputedData.comment"
                          @click.prevent="validationErrors.comment = ''" />
            <!-- <BaseInvalidateText>{{ validationErrors.comment }}</BaseInvalidateText> -->
         </div>

      </template>

      <BaseSpinner v-else />

      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="id == 'create' ? addAddress : editAddress">
            {{ id == 'create' ? 'Добавить' : 'Редактировать' }}
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>