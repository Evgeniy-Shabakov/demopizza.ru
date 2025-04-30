// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
import { serverUrl } from "./env"

export default defineNuxtConfig({
   compatibilityDate: '2024-11-01',
   devtools: { enabled: false },
   css: ['~/assets/css/main.css'],
   app: {
      head: {
         // title: 'Админка',
         link: [
            { rel: 'icon', type: 'image/x-icon', href: `${serverUrl}/storage/images/favicon.png` },
         ]
      }
   },
   vite: {
      plugins: [
         tailwindcss(),
      ],
   },
})
