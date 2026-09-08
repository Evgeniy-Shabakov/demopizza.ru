<script setup>
import { api } from '@/api/api'
import { currentCity } from '@/composables/useCities'
import { currentUserAddress, userAddresses } from '@/composables/useUserAddresses'
import { authUser } from '@/composables/useAuthUser'

const router = useRouter()

const address = ref(null)
const flat = ref(null)
const entrance = ref(null)
const floor = ref(null)
const entranceCode = ref(null)
const comment = ref(null)

const isSaving = ref(false)
const errorMessage = ref(null)

watchEffect(() => {
   if (address.value?.flat) flat.value = address.value.flat
})

async function saveAddress() {
   isSaving.value = true
   errorMessage.value = null

   try {
      const addressData = {
         ...address.value,

         cityId: currentCity.value?.id,
         flat: flat.value,
         entrance: entrance.value,
         floor: floor.value,
         entranceCode: entranceCode.value,
         comment: comment.value,
      }

      if (flat.value && !address.value?.flat) {
         addressData.addressAsString = addressData.addressAsString + ', кв ' + flat.value
      }

      if (authUser.value) {
         const res = await api.post('/addresses', addressData)
         currentUserAddress.value = res.data.data
      } else {
         currentUserAddress.value = { id: Date.now(), ...addressData }
      }

      userAddresses.value.push({ ...currentUserAddress.value })

      router.push('/cart')
   } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка при сохранении адреса!'
   } finally {
      isSaving.value = false
   }
}
</script>

<template>
   <PageHeader>
      <div>
         Добавление адреса доставки
      </div>
      <div class="text-sm font-semibold">
         ({{ currentCity?.name }})
      </div>
   </PageHeader>

   <div class="flex flex-col gap-4">

      <div>
         <Label class="mb-1.5"
                required>Улица, дом</Label>
         <AddressInput v-model="address" />
      </div>

      <div class="grid grid-cols-3 gap-3 items-end"">
         <div>
            <Label class="
           mb-1.5">Квартира</Label>
         <Input v-model="flat" />
      </div>
      <div>
         <Label class="mb-1.5">Подъезд</Label>
         <Input type="number"
                v-model="entrance" />
      </div>
      <div>
         <Label class="mb-1.5">Этаж</Label>
         <Input type="number"
                v-model="floor" />
      </div>
      <div>
         <Label class="mb-1.5">Код от подъезда</Label>
         <Input v-model="entranceCode" />
      </div>
   </div>

   <div>
      <Label class="mb-1.5">Комментарий к адресу</Label>
      <Textarea v-model="comment" />
   </div>

   </div>

   <div class="text-destructive">
      {{ errorMessage }}
   </div>

   <BottomBar>
      <ButtonLgWfull :disabled="!address || isSaving"
                     @click="saveAddress">
         Сохранить адрес
      </ButtonLgWfull>
   </BottomBar>

   <SpinnerCenter v-if="isSaving" />
</template>
