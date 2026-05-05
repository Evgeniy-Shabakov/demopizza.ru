<script setup>
import { selectedCity } from '~/js/client-helper.js'
import { getDaDataAddresses } from '~/js/axios-helper'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const addressData = ref()
const inputTextAddress = ref('')
const resultsDaData = ref([])

let timeoutId = null
onUnmounted(() => clearTimeout(timeoutId))

// Обработка начального значения
watch(() => props.modelValue, (newVal) => {
   if (newVal) inputTextAddress.value = newVal.valueModified
}, { immediate: true })

watch(inputTextAddress, () => {
   const foundItem = resultsDaData.value.find(item => item.valueModified === inputTextAddress.value)

   if (foundItem) {
      addressData.value = foundItem
      emit('update:modelValue', addressData.value)

      resultsDaData.value = []
      return
   }

   if (!inputTextAddress.value) {
      resultsDaData.value = []
      addressData.value = null
      emit('update:modelValue', addressData.value)
      return
   }

   clearTimeout(timeoutId)
   timeoutId = setTimeout(() => {
      getDaDataResult()
   }, 250)
})

async function getDaDataResult() {
   if (!inputTextAddress.value) return

   const query = `${selectedCity.value.name} ${inputTextAddress.value}`

   try {
      const data = await getDaDataAddresses(query)

      resultsDaData.value = data.data || []
      modifyResultsDaData()
   } catch (error) {
      console.error("Error fetching DaData: ", error)
   }
}

function handleClickResultDaData(address) {
   if (inputTextAddress.value == address.valueModified) resultsDaData.value = []

   inputTextAddress.value = address.valueModified
   addressData.value = address
   emit('update:modelValue', addressData.value)
}

function modifyResultsDaData() {
   resultsDaData.value.forEach((item) => {
      const cityWithType = item.cityWithType; // "г Нижний Новгород"
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
                        v-model="inputTextAddress" />
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