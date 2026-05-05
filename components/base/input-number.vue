<script setup>
//для корректной передачи v-model в BaseInputText
const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
   emit('update:modelValue', event.target.value)
}
</script>

<template>

   <input type="number"
          class="base-input-text"
          :value="modelValue"
          @input="onInput">

</template>

<style scoped>
.base-input-text {
   background-color: white;
   padding: 5px 10px;
   border: 1px solid black;
   border-radius: var(--border-radius-input);
}
</style>