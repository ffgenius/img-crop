import { createRouter, createWebHashHistory } from 'vue-router'

import CropperApi from './views/CropperApi.vue'
import ImgCropApi from './views/ImgCropApi.vue'
import ImgCropDemo from './views/ImgCropDemo.vue'
import VueEasyCropDemo from './views/VueEasyCropDemo.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/cropper/demo',
    },
    {
      path: '/cropper/demo',
      name: 'cropper-demo',
      component: VueEasyCropDemo,
      meta: { title: 'vue-easy-crop 演示' },
    },
    {
      path: '/cropper/api',
      name: 'cropper-api',
      component: CropperApi,
      meta: { title: 'vue-easy-crop API' },
    },
    {
      path: '/img-crop/demo',
      name: 'img-crop-demo',
      component: ImgCropDemo,
      meta: { title: 'antdv-next-img-crop 演示' },
    },
    {
      path: '/img-crop/api',
      name: 'img-crop-api',
      component: ImgCropApi,
      meta: { title: 'antdv-next-img-crop API' },
    },
  ],
})

// Update document title on route change
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'img-crop Docs'
})

export default router
