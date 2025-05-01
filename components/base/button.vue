<script setup>
const { isRequestRunning, controlClick } = useBlockBtnForAsyncRequest()

const props = defineProps({
   click: {
      type: Function,
      default: () => { }
   },
   active: {
      type: Boolean,
      default: true
   },
   isIcon: {
      type: Boolean,
      default: false
   },
})

</script>

<template>

   <button @click="active ? controlClick(click) : null"
           class="btn"
           :class="{
            'btn--inactive': active === false,
            'btn--is-icon': isIcon,
         }"
           type="button">

      <BaseSpinner v-if="isRequestRunning" />
      <slot />

   </button>

</template>

<style scoped>
.btn {
   position: relative;
   white-space: nowrap;
   border-radius: var(--border-radius-main);
   background-color: var(--brand-color);
   color: var(--text-color-on-brand-color);
   padding: 7px 10px;
}

/*чтобы работало только на компе с мышкой */
@media (hover: hover) {
   .btn:hover {
      background-color: var(--brand-color-hover);
   }
}

.btn:active {
   background-color: var(--brand-color-active);
}

.btn--is-icon {
   padding: 5px;
}

/* неактивная  */
.btn--inactive {
   background-color: var(--inactive-color);
}

/*чтобы работало только на компе с мышкой */
@media (hover: hover) {
   .btn--inactive:hover {
      background-color: var(--inactive-color);
   }
}

.btn--inactive:active {
   background-color: var(--inactive-color);
}
</style>