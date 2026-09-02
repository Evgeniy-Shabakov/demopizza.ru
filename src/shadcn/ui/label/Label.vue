<script setup>
import { reactiveOmit } from "@vueuse/core";
import { Label } from "reka-ui";
import { cn } from '@/shadcn/lib/utils';

const props = defineProps({
   for: { type: String, required: false },
   asChild: { type: Boolean, required: false },
   as: { type: null, required: false },
   class: {
      type: [Boolean, null, String, Object, Array],
      required: false,
      skipCheck: true,
   },
   required: { type: Boolean, default: false },
});

// Исключаем required из delegatedProps, чтобы он не прокидывался в html-тег Label
const delegatedProps = reactiveOmit(props, ["class", "required"]);
</script>

<template>
   <Label data-slot="label"
          v-bind="delegatedProps"
          :class="cn(
            'flex items-center text-sm text-muted-foreground leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            props.class,
         )
            ">
      <slot />
      <span v-if="required"
            class="text-destructive font-semibold ml-0.5"
            aria-hidden="true">
         *
      </span>
   </Label>
</template>
