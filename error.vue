<script setup>
defineProps(['error'])
</script>

<template>
   <div class="error">
      <div class="text-5xl">
         {{ error.statusCode }}
      </div>
      <div>
         {{ error.message }}
      </div>
      <BaseButton :click="() => navigateTo('/')">
         На главную
      </BaseButton>
   </div>
</template>

<style scoped>
.error {
   height: 100vh;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 15px;
   text-align: center;
}
</style>