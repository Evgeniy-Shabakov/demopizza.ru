<script setup>
import { authUser, editUserName } from '~/js/axios-helper.js'
import { transformValidateErrorsForUI } from '~/js/validation-helper.js'
import { formatPhone } from '~/js/phone-helper'

const fieldInputName = ref(null)

const inputedName = ref()

const validationErrors = ref({})

let unwatchFn = watch(fieldInputName, () => {
   // fieldInputName.value.focus()
   unwatchFn() // отключаем watch после установки фокуса

   if (authUser.value && authUser.value.name) inputedName.value = authUser.value.name
   else inputedName.value = 'Гость'
})

async function save() {
   try {
      await editUserName(authUser.value.id, inputedName.value)
      navigateTo('/user')
   }
   catch (err) {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
   }
}
</script>

<template>

   <PopupPageWrapper>

      <h1 class="text-xl text-center">
         <div class="font-semibold">Редактирование профиля</div>
         <div v-if="authUser"
              class="text-base">
            {{ formatPhone(authUser.phone) }}
         </div>
      </h1>


      <div v-if="authUser">

         <div class="flex items-center">
            <BaseFormLabel class="mr-2">Имя</BaseFormLabel>
            <BaseInputText ref="fieldInputName"
                           class="flex-1"
                           v-model="inputedName"
                           @click.prevent="validationErrors.name = ''" />
            <BaseInvalidateText>{{ validationErrors.name }}</BaseInvalidateText>
         </div>

      </div>

      <BaseSpinner v-else />

      <template #actions>

         <BaseButton :click=save
                     class="base-btn-in-popup-page">
            Сохранить
         </BaseButton>

      </template>

   </PopupPageWrapper>

</template>