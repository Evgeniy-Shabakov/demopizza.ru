<script setup>
const props = defineProps({
   isActive: {
      type: Boolean,
      default: false
   }
})

</script>

<template>

   <div v-if="isActive"
        class="dialog-standart"
        @click="$emit('closeDialog')">

      <div @click.stop
           class="dialog-standart__inner">

         <h3 class="text-xl font-semibold leading-6">
            <slot name="title" />
         </h3>

         <div class="text-center">
            <slot />
         </div>

         <slot name="actions" />

      </div>

   </div>

</template>

<style scoped>
.dialog-standart {
   position: fixed;
   inset: 0;
   background-color: rgba(211, 211, 211, 0.35);

   z-index: 100;

   display: flex;
   align-items: center;
   justify-content: center;
}

.dialog-standart__inner {
   margin: 5px;
   padding: 15px;
   border: 1px solid var(--brand-color);
   border-radius: var(--border-radius-main);
   background-color: white;
   max-height: 80%;
   overflow: auto;

   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 25px;
}
</style>