import { VitePWA } from 'vite-plugin-pwa'

export function pwaViteConfig(env) {
   return VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo.png'],
      manifest: {
         name: env.VITE_PWA_NAME,
         short_name: env.VITE_PWA_NAME,
         start_url: '/',
         theme_color: '#ffffff',
         background_color: '#F5F5F5',
         display: 'standalone',
         icons: [
            { src: '/pwa-icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-icon-512x512.png', sizes: '512x512', type: 'image/png' },
         ],
      },
   })
}