<script setup>
import { Home, Trash2 } from '@lucide/vue'
import { userAddresses, deleteAddress } from '@/composables/useUserAddresses'
import { cities } from '@/composables/useCities'

const addressesByCity = computed(() =>
   (cities.value ?? [])
      .filter(city => userAddresses.value.some(a => a.cityId == city.id))
      .map(city => ({
         cityId: city.id,
         cityName: city.name,
         addresses: userAddresses.value.filter(a => a.cityId == city.id),
      }))
)

const addressToDelete = ref(null)
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref(null)

async function handleDelete() {
   if (!addressToDelete.value) return
   isDeleting.value = true
   deleteError.value = null
   try {
      await deleteAddress(addressToDelete.value.id)
      isDeleteDialogOpen.value = false
   } catch (error) {
      deleteError.value = error.response?.data?.message || 'Ошибка при удалении адреса!'
   } finally {
      isDeleting.value = false
   }
}
</script>

<template>
   <PageHeader>Адреса доставки</PageHeader>

   <div v-if="userAddresses.length == 0"
        class="flex flex-col items-center gap-3 py-14 text-center">
      <div class="flex size-14 items-center justify-center rounded-full bg-muted">
         <Home class="size-6 text-muted-foreground" />
      </div>
      <p class="text-sm text-muted-foreground">
         Нет сохранённых адресов
      </p>
   </div>

   <div v-else
        class="flex flex-col gap-8">
      <section v-for="group in addressesByCity"
               :key="group.cityId">
         <h2 class="mb-3 text-center text-muted-foreground">
            {{ group.cityName }}
         </h2>

         <div class="flex flex-col gap-3">
            <Card v-for="address in group.addresses"
                  :key="address.id"
                  class="gap-2 p-4 text-sm">
               <div class="flex items-start justify-between gap-2">
                  <CardTitle>
                     {{ address.addressAsString }}
                  </CardTitle>
                  <ButtonIconSm variant="outline"
                                @click="() => { addressToDelete = address; isDeleteDialogOpen = true }">
                     <Trash2 class="text-destructive" />
                  </ButtonIconSm>
               </div>

               <div v-if="address.flat || address.entrance || address.floor || address.entranceCode"
                    class="flex flex-wrap gap-2">
                  <Badge v-if="address.flat"
                         variant="secondary">
                     Кв {{ address.flat }}
                  </Badge>
                  <Badge v-if="address.entrance"
                         variant="secondary">
                     Подъезд {{ address.entrance }}
                  </Badge>
                  <Badge v-if="address.floor"
                         variant="secondary">
                     Этаж {{ address.floor }}
                  </Badge>
                  <Badge v-if="address.entranceCode"
                         variant="secondary">
                     Код {{ address.entranceCode }}
                  </Badge>
               </div>

               <Badge v-if="address.comment"
                      variant="outline"
                      class="whitespace-normal">
                  {{ address.comment }}
               </Badge>
            </Card>
         </div>
      </section>
   </div>

   <BottomBar />

   <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Удалить адрес?</DialogTitle>
            <DialogDescription>
               Вы уверены, что хотите удалить адрес «{{ addressToDelete?.addressAsString }}»?
            </DialogDescription>
         </DialogHeader>

         <div v-if="deleteError"
              class="text-sm text-destructive">
            {{ deleteError }}
         </div>

         <DialogFooter>
            <Button variant="outline"
                    :disabled="isDeleting"
                    @click="isDeleteDialogOpen = false">
               Отмена
            </Button>
            <Button variant="destructive"
                    :disabled="isDeleting"
                    @click="handleDelete">
               Удалить
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>

   <SpinnerCenter v-if="isDeleting" />
</template>