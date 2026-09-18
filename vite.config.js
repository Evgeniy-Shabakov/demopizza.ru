import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { pwaViteConfig } from './src/pwa/pwa-vite-config'

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
         pwaViteConfig(env),
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
