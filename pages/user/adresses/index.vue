<script setup>
import axios from 'axios'
import { authUser, getAuthUser } from '~/js/axios-helper.js'
import { userAddresses } from '~/js/address-index.js'

const userCities = computed(() => {
   const array = []

   userAddresses.value.forEach(address => {
      array.push(address.city.name)
   })

   return [...new Set(array)] //удаляем повторяющиеся города
})

async function deleteAddress(id) {
   try {
      await axios.delete(`/users/${authUser.value.id}/addresses/${id}`)

      await getAuthUser()
      // authUser.value = res.data.data;
   } catch (err) {
      console.log(err)
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
               <template v-if="city === address.city.name">

                  <div class="border border-(--brand-color) rounded-(--border-radius-main) p-2">

                     <div class="mb-2">
                        <div v-if="address.name"
                             class="text-center mb-2">
                           {{ address.name }}
                        </div>
                        <div v-if="address.addressAsString">
                           {{ address.addressAsString }}
                        </div>
                        <div v-else>
                           {{ address.street }} д.{{ address.house }}  кв.{{ address.flat }}
                        </div>
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