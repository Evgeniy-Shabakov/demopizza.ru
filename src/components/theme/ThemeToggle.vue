<script setup>
import { Sun, Moon } from '@lucide/vue'

const isDark = useDark()
const toggleDark = useToggle(isDark) 
</script>

<template>
   <Button variant="outline"
           class="w-full justify-between gap-2"
           @click="toggleDark()">
      {{ !isDark ? 'Светлая тема' : 'Тёмная тема' }}
      <Sun v-if="!isDark"
           class="w-4 h-4" />
      <Moon v-else
            class="w-4 h-4" />
   </Button>
</template>
