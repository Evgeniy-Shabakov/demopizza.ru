<script setup>
import { vMaska } from 'maska/vue'
import { inputedPhone } from '@/composables/usePhoneInput'

const fieldInputPhone = ref()

watchEffect(() => {
   if (inputedPhone.value.length == 14) {
      fieldInputPhone.value?.blur()
   }
})

</script>

<template>
   <div class="border border-primary bg-primary-foreground rounded-md px-4 py-3">

      <span class="font-mono text-lg md:text-xl mr-0.5">+7</span>

      <input ref="fieldInputPhone"
             v-model="inputedPhone"
             v-maska="'(###)###-##-##'"
             type="tel"
             placeholder="(999)999-99-99"
             class="w-[14ch] p-0 font-mono text-lg md:text-xl
                     bg-transparent focus-visible:outline-none focus-visible:ring-0" />
   </div>
</template>
