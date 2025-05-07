import type { RouterConfig } from "@nuxt/schema"
import { scrollPosition } from "~/middleware/scroll.global";

export default <RouterConfig>{
   scrollBehavior(to, from, savedPosition) {
       if (scrollPosition) {
         return { top: scrollPosition, behavior: 'instant' }
       } else {
           return {
               top: 0
           };
       }
   }
};