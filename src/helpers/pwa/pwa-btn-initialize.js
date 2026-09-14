export let installPrompt = ref(null)

export function pwaBtnInitialize() {
   window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      installPrompt.value = e
   })
}