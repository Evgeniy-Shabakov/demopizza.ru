<script setup>
//для корректной передачи v-model в BaseInputText
const props = defineProps({ modelValue: String })

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
   emit('update:modelValue', event.target.value)
}
</script>

<template>

   <textarea class="border rounded-(--border-radius-main) w-full p-2"
             :value="modelValue"
             @input="onInput" />

</template>