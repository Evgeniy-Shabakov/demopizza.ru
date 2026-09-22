import { VitePWA } from 'vite-plugin-pwa'

export function pwaViteConfig(env) {
   return VitePWA({
      registerType: 'autoUpdate',
      manifest: false 
   })
}