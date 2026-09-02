<script setup>
import { currentCity } from '@/composables/useCities'
import { currentUserAddress, userAddresses } from '@/composables/useUserAddresses'

const router = useRouter()

const address = ref(null)
const flat = ref(null)
const entrance = ref(null)
const floor = ref(null)
const entranceCode = ref(null)
const comment = ref(null)

watchEffect(() => {
   if (address.value?.flat) flat.value = address.value.flat
})

function saveAddress() {
   currentUserAddress.value = {
      id: Date.now(),

      ...address.value,

      cityId: currentCity.value?.id,
      flat: flat.value,
      entrance: entrance.value,
      floor: floor.value,
      entranceCode: entranceCode.value,
      comment: comment.value,
   }

   if (flat.value && !address.value?.flat) {
      currentUserAddress.value.addressAsString =
         currentUserAddress.value.addressAsString + ', кв ' + flat.value
   }

   userAddresses.value.push({ ...currentUserAddress.value })

   router.push('/cart')
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

   <BottomBar>
      <ButtonLgWfull :disabled="!address"
                     @click="saveAddress">
         Сохранить адрес
      </ButtonLgWfull>
   </BottomBar>
</template>
