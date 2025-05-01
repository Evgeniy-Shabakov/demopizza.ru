<script setup>
const props = defineProps(['isActive'])

</script>

<template>

   <div v-if="isActive"
        class="dialog-standart"
        @click="$emit('closeDialog', false)">

      <div @click.stop
           class="dialog-standart__inner">

         <h3 class="dialog-standart__inner-title">
            <slot name="title"></slot>
         </h3>


         <slot></slot>

         <slot name="actions"></slot>

      </div>

   </div>

</template>

<style scoped>
.dialog-standart {
   position: fixed;
   inset: 0;
   background-color: rgba(211, 211, 211, 0.35);

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

.dialog-standart__inner-title {
   text-align: center;
   font-size: 20px;
   font-weight: 600;
}
</style>