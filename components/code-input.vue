<script setup>

import { inputedCode } from '~/js/login-panel-helper.js'
import IMask from 'imask'

const fieldInputCode = ref()

watch(inputedCode, () => {
   if (inputedCode.value.length < 4)
      fieldInputCode.value.focus()

   if (inputedCode.value.length === 4) {
      fieldInputCode.value.blur()
   }
})

onMounted(() => {
   const maskOptions = {
      mask: '0000'
   };
   const mask = IMask(fieldInputCode.value, maskOptions);

   if (inputedCode.value.length < 4)
      fieldInputCode.value.focus()
})

</script>

<template>
   <div class="code-input">

      <input class="code-input__input"
             ref="fieldInputCode"
             v-model="inputedCode"
             type="tel"
             placeholder="0000" />

   </div>
</template>

<style scoped>
.code-input {
   background-color: white;
   border: 1px solid orange;
   border-radius: 30px;
   padding: 10px;
   width: max-content;
   font-size: 22px;
}

.code-input__input {
   width: 4ch;
}

.code-input__input:focus {
   outline: none;
}
</style>
