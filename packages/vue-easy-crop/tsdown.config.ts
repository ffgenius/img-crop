import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
})
