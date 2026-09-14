//для изменения темы кнопок на самом телефоне
const DARK_THEME_COLOR = '#0a0a0a'
const LIGHT_THEME_COLOR = '#ffffff'

export const isDark = useDark()

let manifestPromise = null
let manifestUrl = null

function updateThemeColor(value) {
   const metas = document.querySelectorAll('meta[name="theme-color"]')
   metas.forEach((meta) => meta.setAttribute('content', value))
}

function loadManifest() {
   if (!manifestPromise) {
      manifestPromise = fetch('/manifest.webmanifest')
         .then((response) => response.json())
         .catch(() => null)
   }
   return manifestPromise
}

async function updateManifestColors(value) {
   const manifest = await loadManifest()
   if (!manifest) return

   manifest.theme_color = value
   manifest.background_color = value

   if (manifestUrl) URL.revokeObjectURL(manifestUrl)

   const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })
   const link = document.querySelector('link[rel="manifest"]')
   if (!link) return
   manifestUrl = URL.createObjectURL(blob)
   link.href = manifestUrl
}

watch(isDark, (dark) => {
   const color = dark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR
   updateThemeColor(color)
   updateManifestColors(color)
}, { immediate: true })