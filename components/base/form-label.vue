<script setup>
defineProps({
   required: {
      type: Boolean,
      default: true,
   }
})
</script>

<template>

   <label class="inline-block text-sm text-(--text-color-main)/60 whitespace-nowrap"
          :class="{
            'form-label--required': required,
         }">

      <slot />

   </label>

</template>

<style scoped>
.form-label--required::after {
   content: '*';
   color: var(--danger-color);
}
</style>