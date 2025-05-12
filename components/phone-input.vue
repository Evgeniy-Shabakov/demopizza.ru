<script setup>

import { inputedPhone } from '~/js/login-panel-helper.js'
import IMask from 'imask'

const fieldInputPhone = ref()

watch(inputedPhone, () => {
   if (inputedPhone.value.length == 15) {
      fieldInputPhone.value.blur()
   }
})

onMounted(() => {
   const maskOptions = {
      mask: '(000) 000-00-00'
   };
   const mask = IMask(fieldInputPhone.value, maskOptions);

   if (inputedPhone.value.length < 15)
      fieldInputPhone.value.focus()
})

</script>

<template>
   <div class="phone-input">

      <span>+7</span>

      <input class="phone-input__input"
             ref="fieldInputPhone"
             v-model="inputedPhone"
             type="tel"
             placeholder="(000) 000-00-00" />

   </div>
</template>

<style scoped>
.phone-input {
   background-color: white;
   border: 1px solid orange;
   border-radius: 30px;
   padding: 10px;
   width: max-content;
   font-size: 22px;
}

.phone-input__input {
   width: 14ch;
}

.phone-input__input:focus {
   outline: none;
}
</style>
