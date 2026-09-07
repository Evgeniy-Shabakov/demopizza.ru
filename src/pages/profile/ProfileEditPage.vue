<script setup>
import { authUser, logoutUser } from '@/composables/useAuthUser'
import router from '@/router/router'

const isLoggingOut = ref(false)

async function handleLogout() {
   isLoggingOut.value = true
   await logoutUser()
   router.push({ name: 'home' })
}
</script>

<template>
   <PageHeader>Управление профилем</PageHeader>
   <div class="-mt-2 text-center">{{ formatPhone(authUser.phone) }}</div>

   <Button variant="destructive"
           :disabled="isLoggingOut"
           @click="handleLogout">
      Выйти из профиля
   </Button>

   <SpinnerCenter v-if="isLoggingOut" />

   <BottomBar />
</template>