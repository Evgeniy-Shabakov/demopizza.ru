import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
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
})
