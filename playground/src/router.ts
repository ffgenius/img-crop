import { createRouter, createWebHashHistory } from 'vue-router'

import ImgCropDemo from './views/ImgCropDemo.vue'
import VueEasyCropDemo from './views/VueEasyCropDemo.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'cropper',
      component: VueEasyCropDemo,
      meta: { title: 'vue-easy-crop 演示' },
    },
    {
      path: '/img-crop',
      name: 'img-crop',
      component: ImgCropDemo,
      meta: { title: 'antdv-next-img-crop 演示' },
    },
  ],
})

// Update document title on route change
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Playground'
})

export default router
