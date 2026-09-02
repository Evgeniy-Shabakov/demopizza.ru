<script setup>
const props = defineProps({
   categories: {
      type: Array,
      required: true
   }
})

const activeCategoryId = ref(null)
const navRef = ref(null)
let isProgrammaticScrolling = false
let ticking = false
let centerRaf = null

function updateActiveCategory() {
   if (isProgrammaticScrolling || !props.categories.length) return

   const midPoint = window.innerHeight / 2
   let bestId = props.categories[0].id
   let bestDistance = Infinity

   for (const cat of props.categories) {
      const el = document.getElementById('cat-' + cat.id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const sectionMid = rect.top + rect.height / 2
      const dist = Math.abs(sectionMid - midPoint)
      if (dist < bestDistance) {
         bestDistance = dist
         bestId = cat.id
      }
   }

   activeCategoryId.value = bestId
}

function onScroll() {
   if (!ticking) {
      requestAnimationFrame(() => {
         updateActiveCategory()
         ticking = false
      })
      ticking = true
   }
}

function scrollNavToCenter() {
   if (!navRef.value || activeCategoryId.value === null) return
   const btn = navRef.value.querySelector(`button[data-category-id="${activeCategoryId.value}"]`)
   if (!btn) return

   const navRect = navRef.value.getBoundingClientRect()
   const btnRect = btn.getBoundingClientRect()
   const scrollLeft = navRef.value.scrollLeft + btnRect.left - navRect.left - navRect.width / 2 + btnRect.width / 2

   navRef.value.scrollTo({ left: scrollLeft, behavior: 'smooth' })
}

function scrollToCategory(id) {
   isProgrammaticScrolling = true
   activeCategoryId.value = id

   if (id === props.categories[0]?.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
   } else {
      document.getElementById('cat-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
   }

   const onEnd = () => {
      isProgrammaticScrolling = false
      updateActiveCategory()
      window.removeEventListener('scrollend', onEnd)
   }
   window.addEventListener('scrollend', onEnd)
}

onMounted(() => {
   window.addEventListener('scroll', onScroll, { passive: true })
   updateActiveCategory()
})

onUnmounted(() => {
   window.removeEventListener('scroll', onScroll)
   if (centerRaf) cancelAnimationFrame(centerRaf)
})

watch(() => props.categories, async () => {
   await nextTick()
   updateActiveCategory()
}, { immediate: true })

watch(activeCategoryId, () => {
   if (centerRaf) cancelAnimationFrame(centerRaf)
   centerRaf = requestAnimationFrame(() => {
      scrollNavToCenter()
      centerRaf = null
   })
})
</script>

<template>
   <nav ref="navRef"
        class="sticky top-0 py-2 z-10 bg-background overflow-x-auto -mx-2 px-2 scroll-smooth">
      <div class="flex gap-2">
         <button v-for="cat in categories"
                 :key="cat.id"
                 :data-category-id="cat.id"
                 class="shrink-0 px-3 py-1 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
                 :class="activeCategoryId === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
                 @click="scrollToCategory(cat.id)">
            {{ cat.name }}
         </button>
         <div class="text-[1px]">1</div>
      </div>
   </nav>
</template>
