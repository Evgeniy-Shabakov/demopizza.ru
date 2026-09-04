const scrollPositions = new Map()

export function saveScrollPosition(to, from) {
   if (from.name) {
      scrollPositions.set(from.name, window.scrollY)
   }
}

export function scrollBehavior(to, from, savedPosition) {
   if (savedPosition) {
      return savedPosition
   }
   const saved = scrollPositions.get(to.name)
   if (saved !== undefined) {
      return { top: saved, behavior: 'instant' }
   }
   return { top: 0 }
}
