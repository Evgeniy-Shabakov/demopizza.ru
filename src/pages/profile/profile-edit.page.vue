<script setup>
import { authUser, logoutUser } from '@/composables/useAuthUser'
import { formatPhone } from '@/helpers/formatPhone'
import router from '@/router/router'

const isLoggingOut = ref(false)
const isDialogOpen = ref(false)

async function handleLogout() {
   isLoggingOut.value = true
   isDialogOpen.value = false
   await logoutUser()
   router.push({ name: 'home' })
}
</script>

<template>
   <PageHeader>Управление профилем</PageHeader>
   <div class="-mt-2 mb-3 text-center">{{ formatPhone(authUser?.phone) }}</div>

   <Button variant="destructive"
           :disabled="isLoggingOut"
           @click="isDialogOpen = true">
      Выйти из профиля
   </Button>

   <SpinnerCenter v-if="isLoggingOut" />

   <Dialog v-model:open="isDialogOpen">
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Выход из профиля</DialogTitle>
            <DialogDescription>
               Вы уверены, что хотите выйти?
            </DialogDescription>
         </DialogHeader>

         <DialogFooter>
            <Button variant="outline"
                    :disabled="isLoggingOut"
                    @click="isDialogOpen = false">
               Отмена
            </Button>
            <Button variant="destructive"
                    :disabled="isLoggingOut"
                    @click="handleLogout">
               Выйти
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>

   <BottomBar />
</template>
