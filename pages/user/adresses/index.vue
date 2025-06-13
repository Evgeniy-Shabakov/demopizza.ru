<script setup>
import axios from 'axios'
import { authUser } from '~/js/axios-helper.js'
import { userAddresses } from '~/js/address-index.js'

const userCities = computed(() => {
   const array = []

   userAddresses.value.forEach(address => {
      array.push(address.city.title)
   })

   return [...new Set(array)] //удаляем повторяющиеся города
})

async function deleteAddress(id) {
   try {
      const res = await axios.delete(`/users/${authUser.value.id}/addresses/${id}`);
      authUser.value = res.data.data;
   } catch (err) {
      console.log(err);
   }
}
</script>

<template>
   <PopupPageWrapper>

      <h1 class="text-xl text-center font-semibold">Адреса доставки</h1>

      <template v-if="authUser">

         <BaseButton :isIcon="true"
                     :click="() => navigateTo('/user/adresses/create')">
            Добавить новый адрес
         </BaseButton>

         <section v-for="city in userCities"
                  class="space-y-3">

            <div class="text-center font-semibold">{{ city }}</div>

            <template v-for="address in userAddresses">
               <template v-if="city === address.city.title">

                  <div class="border border-(--brand-color) rounded-(--border-radius-main) p-2">

                     <div class="mb-2">
                        <div v-if="address.title"
                             class="text-center mb-2">
                           {{ address.title }}
                        </div>
                        {{ address.value_string }}
                     </div>

                     <div class="flex justify-between">
                        <BaseButton :isIcon="true"
                                    :click="() => navigateTo(`/user/adresses/${address.id}`)">
                           Редактировать
                        </BaseButton>
                        <BaseButton :isIcon="true"
                                    :click="() => deleteAddress(address.id)">
                           Удалить
                        </BaseButton>
                     </div>

                  </div>

               </template>
            </template>


         </section>

      </template>

      <BaseSpinner v-else />

      <template #actions>

         <BaseButton class="base-btn-in-popup-page"
                     :click="() => navigateTo('/user')">
            Назад
         </BaseButton>

      </template>

   </PopupPageWrapper>
</template>