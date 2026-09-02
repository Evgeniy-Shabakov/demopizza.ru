<script setup>
const isCheckedSoglasie = defineModel()
const isCheckedSoglasieError = computed(() => !isCheckedSoglasie.value)
</script>

<template>
   <div>
      
      <div class="flex items-center">
         <Checkbox v-model="isCheckedSoglasie"
                   id="idCheckbox"
                   class="size-7" />
         <Label for="idCheckbox"
                class="block pl-4 leading-4">
            Я согласен на
            <BaseLink to="/legal-documents">обработку персональных данных</BaseLink>
            и принимаю условия
            <BaseLink to="/legal-documents">пользовательского соглашения</BaseLink>
         </Label>
      </div>

      <div class="h-3.5 text-xs text-destructive text-center mt-2">
         <span v-if="isCheckedSoglasieError">Необходимо дать согласие</span>
      </div>

   </div>
</template>