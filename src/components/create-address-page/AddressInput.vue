<script setup>
import { api } from '@/api/api'
import { currentCity } from '@/composables/useCities'

const vmodel = defineModel({ type: Object, default: null })

const inputText = ref('')
const inputRef = ref(null)

const suggestions = ref(null)
const isLoading = ref(false)
const loadingError = ref(null)

const getAddressesFromApi = useDebounceFn(getAddressesFromDaDataApi, 300)

const lastSearchQuery = ref('')

async function getAddressesFromDaDataApi(searchQuery) {
   const trimmedQuery = searchQuery?.trim() || ''

   if (trimmedQuery.length < 2 || trimmedQuery === lastSearchQuery.value) {
      return
   }

   lastSearchQuery.value = trimmedQuery

   isLoading.value = true
   loadingError.value = null

   try {
      const res = await api.post(`/dadata/addresses`, {
         query: `${currentCity.value.name} ${trimmedQuery}`
      })

      suggestions.value = res.data
      formAddressAsStringForDaDataSuggestions()
   } catch (error) {
      console.error("Ошибка при запросе в DaData: ", error)
      loadingError.value = 'Ошибка при поиске адреса'
   } finally {
      isLoading.value = false
   }
}

function selectAddress(result) {
   inputText.value = result.addressAsString + ' '
   lastSearchQuery.value = result.addressAsString
   suggestions.value = null

   vmodel.value = result

   nextTick(() => {
      if (result.street && !result.house) {
         inputRef.value?.$el?.focus()
      }
   })
}

function formAddressAsStringForDaDataSuggestions() {
   suggestions.value.forEach((item) => {
      const cityWithType = item.cityWithType  // "г Нижний Новгород"
      const value = item.value  // "г Нижний Новгород, ул Бекетова, д 1"

      let addressAsString = value

      const cityIndex = value.indexOf(cityWithType) // Находим позицию города в строке

      if (cityIndex >= 0) {
         addressAsString = value.slice(cityIndex + cityWithType.length + 2).trim()
      }

      item.addressAsString = addressAsString // "ул Бекетова, д 1"
   })
}
</script>

<template>
   <div class="relative">
      <Input ref="inputRef"
             @keyup="getAddressesFromApi($event.target.value)"
             v-model="inputText" />

      <Spinner v-if="isLoading"
               class="absolute right-3 top-2.5 h-4 w-4 text-primary" />

      <div v-if="suggestions?.length > 0"
           class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
         <button v-for="(address, index) in suggestions"
                 :key="index"
                 type="button"
                 class="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                 @click="selectAddress(address)">
            {{ address.addressAsString }}
         </button>
      </div>

      <div v-if="suggestions?.length == 0"
           class="text-xs text-destructive">
         Не найдено ни одного результата
      </div>

      <div class="text-xs text-destructive">
         {{ loadingError }}
      </div>
   </div>
</template>
