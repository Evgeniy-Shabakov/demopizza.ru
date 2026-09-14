const DARK_THEME_COLOR = '#0a0a0a'
const LIGHT_THEME_COLOR = '#ffffff'

export const isDark = useDark()

function updateThemeColor(value) {
   const meta = document.querySelector('meta[name="theme-color"]')
   if (meta) meta.setAttribute('content', value)
}

watch(isDark, (dark) => {
   updateThemeColor(dark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
}, { immediate: true })