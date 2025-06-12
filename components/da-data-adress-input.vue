<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { getDaDataAddresses } from '~/js/axios-helper'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const adressData = ref()
const inputTextAdress = ref('')
let query = ''
const resultsDaData = ref([])

let timeoutId = null
onUnmounted(() => clearTimeout(timeoutId))

// Обработка начального значения
watch(() => props.modelValue, (newVal) => {
   if (newVal) inputTextAdress.value = newVal.value
}, { immediate: true })

watch(inputTextAdress, () => {
   const foundItem = resultsDaData.value.find(item => item.value === inputTextAdress.value)

   if (foundItem) {
      adressData.value = foundItem
      emit('update:modelValue', adressData.value)

      resultsDaData.value = []
      return
   }

   if (!inputTextAdress.value) {
      resultsDaData.value = []
      adressData.value = null
      emit('update:modelValue', adressData.value)
      return
   }

   clearTimeout(timeoutId)
   timeoutId = setTimeout(() => {
      getDaDataResult()
   }, 500)
})

async function getDaDataResult() {
   if (!inputTextAdress.value) return

   const query = `${selectedCity.value.title} ${inputTextAdress.value}`

   try {
      const data = await getDaDataAddresses(query)
      resultsDaData.value = data.data.suggestions || []
   } catch (error) {
      console.error("Error fetching DaData:", error)
   }
}

function handleClickResultDaData(adress) {
   if (inputTextAdress.value == adress.value) resultsDaData.value = []

   inputTextAdress.value = adress.value
   adressData.value = adress
   emit('update:modelValue', adressData.value)
}
</script>

<template>
   <div>

      <div class="relative">
         <BaseFormLabel class="mb-1">Улица, дом, квартира</BaseFormLabel>
         <BaseInputText class="w-full"
                        v-model="inputTextAdress" />
         <div class="absolute z-10 w-full "
              v-if="resultsDaData.length > 0">
            <div v-for="address in resultsDaData"
                 class="border p-1 rounded-(--border-radius-input) bg-gray-200"
                 @click="handleClickResultDaData(address)">
               {{ address.value }}
            </div>
         </div>
      </div>

   </div>
</template>