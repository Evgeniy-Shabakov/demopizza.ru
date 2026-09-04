import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { routerGuardController } from './router.guard.controller'
import { saveScrollPosition, scrollBehavior } from './router.scroll.controller'

const router = createRouter({
   history: createWebHistory(),
   routes,
   scrollBehavior,
})

router.beforeEach(saveScrollPosition)
router.beforeEach((to) => routerGuardController(to))

export default router
