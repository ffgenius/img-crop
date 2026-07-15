import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import tsdownConfig from './tsdown.config'

export default defineConfig({
  plugins: [vue()],
  pack: tsdownConfig,
})
