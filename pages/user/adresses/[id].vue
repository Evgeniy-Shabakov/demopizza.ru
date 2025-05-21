<script setup>
import axios from 'axios'
import { authUser } from '~/js/axios-helper.js'
import { selectedCity, selectedAddressForDelivery } from '~/js/client-helper.js'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { previousRoute } from '~/middleware/previous-route.global'
import { findAdresseAuthUserByID } from '~/js/address-index.js'

const router = useRouter()
const id = useRoute().params.id

const addressInputedData = reactive({
   initialize(address) {
      this.user_id = authUser.value.id,
         this.city_id = selectedCity.value.id,
         this.street = address?.street || null,
         this.house_number = address?.house_number || null,
         this.corps_number = address?.corps_number || null,
         this.apartment_number = address?.apartment_number || null,
         this.entrance_number = address?.entrance_number || null,
         this.floor = address?.floor || null,
         this.entrance_code = address?.entrance_code || null,
         this.title = address?.title || null,
         this.comment = address?.comment || null
   }
})


watchEffect(() => {
   if (authUser.value) {
      addressInputedData.initialize(findAdresseAuthUserByID(id))
   }
})

const validationErrors = ref({})

async function addAddress() {
   try {
      const res = await axios.post(`/users/${addressInputedData.user_id}/addresses`, addressInputedData)
      selectedAddressForDelivery.value = res.data.data
      authUser.value.addresses.push(selectedAddressForDelivery.value)
      router.back()
   } catch (error) {
      if (error.response?.status === 422) {
         validationErrors.value = error.response.data.errors
         transformValidateErrorsForUI(validationErrors.value)
      }
   }
}

async function editAddress() {
   try {
      const res = await axios.patch(`/users/${authUser.value.id}/addresses/${id}`, addressInputedData)
      authUser.value = res.data.data
      router.back()
   }
   catch (error) {
      if (error.response?.status === 422) {
         validationErrors.value = error.response.data.errors
         transformValidateErrorsForUI(validationErrors.value)
      }
   }
}

</script>

<template>

   <PopupPageWrapper>

      <h1 v-if="selectedCity"
          class="text-xl text-center font-semibold">

         <template v-if="previousRoute.name == 'user-adresses'">
            Добавление адреса
         </template>

         <template v-else>
            <div>{{ selectedCity.title }}</div>
            <div class="font-normal text-base">
               (добавление адреса)
            </div>
         </template>

      </h1>

      <template v-if="selectedCity">

         <!-- изменение города только в личном кабинете, при оформлении заказа адрес добавляется только к текущему городу -->

         <CitySelecte v-if="previousRoute.name == 'user-adresses'" />

         <div>
            <BaseFormLabel class="mb-1">Улица/шоссе/проспект</BaseFormLabel>
            <BaseInputText class="w-full"
                           v-model="addressInputedData.street"
                           @click="validationErrors.street = ''" />
            <BaseInvalidateText>{{ validationErrors.street }}</BaseInvalidateText>
         </div>

         <div class="grid grid-cols-3 gap-5">

            <div>
               <BaseFormLabel class="mb-1">Номер дома</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.house_number"
                              @click="validationErrors.house_number = ''" />
               <BaseInvalidateText>{{ validationErrors.house_number }}</BaseInvalidateText>
            </div>

            <div>
               <BaseFormLabel class="mb-1"
                              :required="false">Корпус</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.corps_number"
                              @click="validationErrors.corps_number = ''" />
               <BaseInvalidateText>{{ validationErrors.corps_number }}</BaseInvalidateText>
            </div>

         </div>

         <div class="grid grid-cols-3 gap-5">

            <div>
               <BaseFormLabel class="mb-1" :required="false">Квартира/офис</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.apartment_number"
                              @click="validationErrors.apartment_number = ''" />
               <BaseInvalidateText>{{ validationErrors.apartment_number }}</BaseInvalidateText>
            </div>

            <div>
               <BaseFormLabel class="mb-1" :required="false">Подъезд</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.entrance_number"
                              @click="validationErrors.entrance_number = ''" />
               <BaseInvalidateText>{{ validationErrors.entrance_number }}</BaseInvalidateText>
            </div>

            <div>
               <BaseFormLabel class="mb-1" :required="false">Этаж</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.floor"
                              @click="validationErrors.floor = ''" />
               <BaseInvalidateText>{{ validationErrors.floor }}</BaseInvalidateText>
            </div>

         </div>

         <div class="grid grid-cols-3 gap-5">
            <div>
               <BaseFormLabel class="mb-1" :required="false">Код от подъезда</BaseFormLabel>
               <BaseInputText class="w-full"
                              v-model="addressInputedData.entrance_code"
                              @click="validationErrors.entrance_code = ''" />
               <BaseInvalidateText>{{ validationErrors.entrance_code }}</BaseInvalidateText>
            </div>
         </div>


         <div>
            <BaseFormLabel class="mb-1" :required="false">Название для адреса (дом, работа)</BaseFormLabel>
            <BaseInputText class="w-full"
                           v-model="addressInputedData.title"
                           @click="validationErrors.title = ''" />
            <BaseInvalidateText>{{ validationErrors.title }}</BaseInvalidateText>
         </div>

         <div>
            <BaseFormLabel class="mb-1" :required="false">Комментарий к адресу</BaseFormLabel>
            <BaseTextarea v-model="addressInputedData.comment"
                          @click.prevent="validationErrors.comment = ''" />
            <BaseInvalidateText>{{ validationErrors.comment }}</BaseInvalidateText>
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