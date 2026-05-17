<script setup>
const props = defineProps({
   description: { type: String, required: true },
   limit: { type: Number, default: 100 },
})

const expanded = ref(false)

const isLong = computed(() => props.description?.length > props.limit)

const truncated = computed(() => {
   if (!isLong.value) return props.description;
   let trimmed = props.description.slice(0, props.limit);
   const lastSpace = trimmed.lastIndexOf(' ');
   if (lastSpace > 0) trimmed = trimmed.slice(0, lastSpace);
   return trimmed + '…';
})

const displayText = computed(() => {
   if (!isLong.value) return props.description;
   return expanded.value ? props.description : truncated.value
})
</script>

<template>
   <div>
      <span class="mr-2">{{ displayText }}</span>
      <button v-if="isLong"
              @click="expanded = !expanded"
              class="text-(--text-color-main)/60 hover:text-(--text-color-main)">
         {{ expanded ? 'Свернуть' : 'Подробнее' }}
      </button>
   </div>
</template>
