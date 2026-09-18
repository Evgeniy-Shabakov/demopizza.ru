import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), '')

   return {
      plugins: [
         vue(),
         tailwindcss(),
         AutoImport({
            imports: [
               'vue',
               'vue-router',
               '@vueuse/core',
            ],
            dts: true,
         }),
         Components({
            dirs: ['src/shadcn/ui', 'src/components'],
            deep: true,
            extensions: ['vue'],
            dts: true,
         }),
         VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png', 'logo.png'],
            manifest: {
               name: env.VITE_BRAND_NAME,
               short_name: env.VITE_BRAND_NAME,
               start_url: '/',
               theme_color: '#ffffff',
               background_color: '#121212',
               display: 'standalone',
               icons: [
                  { src: '/pwa-icon-192x192.png', sizes: '192x192', type: 'image/png' },
                  { src: '/pwa-icon-512x512.png', sizes: '512x512', type: 'image/png' },
               ],
            },
         }),
      ],
      resolve: {
         alias: {
            '@': path.resolve(__dirname, './src'),
         },
      },
      server: {
         //выданы доп разрешения для node чтобы запускать на порту 80
         //отменить эти разрешения, если перестану работать с VKID и портом 80
         //sudo setcap 'cap_net_bind_service=+ep' $(which node) 
         port: 80,
      },
   }
})
