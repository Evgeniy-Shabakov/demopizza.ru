export let installPrompt  = ref(null)

export default defineNuxtPlugin(() => {
   window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      installPrompt.value  = e
   })
});