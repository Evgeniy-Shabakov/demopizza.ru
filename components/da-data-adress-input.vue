<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { getDaDataAddresses } from '~/js/axios-helper'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const adressData = ref()
const inputTextAdress = ref('')
const resultsDaData = ref([])

let timeoutId = null
onUnmounted(() => clearTimeout(timeoutId))

// Обработка начального значения
watch(() => props.modelValue, (newVal) => {
   if (newVal) inputTextAdress.value = newVal.valueModified
}, { immediate: true })

watch(inputTextAdress, () => {
   const foundItem = resultsDaData.value.find(item => item.valueModified === inputTextAdress.value)

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
   }, 250)
})

async function getDaDataResult() {
   if (!inputTextAdress.value) return

   const query = `${selectedCity.value.title} ${inputTextAdress.value}`

   try {
      const data = await getDaDataAddresses(query)

      resultsDaData.value = data.data.suggestions || []
      modifyResultsDaData()
   } catch (error) {
      console.error("Error fetching DaData:", error)
   }
}

function handleClickResultDaData(adress) {
   console.log(adress)

   if (inputTextAdress.value == adress.valueModified) resultsDaData.value = []

   inputTextAdress.value = adress.valueModified
   adressData.value = adress
   emit('update:modelValue', adressData.value)
}

function modifyResultsDaData() {
   resultsDaData.value.forEach((item) => {
      const cityWithType = item.data.city_with_type; // "г Нижний Новгород"
      const value = item.value; // "г Нижний Новгород, ул Бекетова, д 1"

      // Находим позицию города в строке
      const cityIndex = value.indexOf(cityWithType);

      // Вычисляем valueModified
      let valueModified = value;
      if (cityIndex >= 0) {
         valueModified = value.slice(cityIndex + cityWithType.length + 2).trim();
      }

      // Добавляем поле прямо в объект (мутация)
      item.valueModified = valueModified; // "ул Бекетова, д 1"
   });
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
               {{ address.valueModified }}
            </div>
         </div>
      </div>

   </div>
</template>