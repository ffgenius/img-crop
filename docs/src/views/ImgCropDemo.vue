<script setup lang="ts">
import { ImgCrop } from '@antdv-next/img-crop'
import { Upload, Button } from 'antdv-next'
import { ref, computed } from 'vue'

import { useI18n } from '../i18n'

const { t } = useI18n()

// --- Demo configuration ---
const quality = ref(0.8)
const cropShape = ref<'rect' | 'round'>('rect')
const showGrid = ref(true)
const zoomSlider = ref(true)
const rotationSlider = ref(true)
const aspectSlider = ref(true)
const showReset = ref(true)
const aspect = ref(4 / 3)

const aspectOptions = computed(() => [
  { label: t('demo.imgCrop.aspectOpt.free'), value: 4 / 3 },
  { label: t('demo.imgCrop.aspectOpt.1:1'), value: 1 },
  { label: t('demo.imgCrop.aspectOpt.16:9'), value: 16 / 9 },
  { label: t('demo.imgCrop.aspectOpt.3:4'), value: 3 / 4 },
])

// --- State ---
const croppedImageUrl = ref<string | null>(null)
const croppedFileName = ref('')
const modalLog = ref<string[]>([])

function addLog(msg: string) {
  modalLog.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (modalLog.value.length > 20) modalLog.value.shift()
}

function handleModalOk(result: unknown) {
  addLog(`modal-ok: ${JSON.stringify(result).slice(0, 80)}`)
}

function handleModalCancel() {
  addLog(t('demo.imgCrop.cancelLog'))
}

function handleBeforeUpload(file: File & { uid?: string }) {
  addLog(`beforeUpload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`)

  const url = URL.createObjectURL(file)
  croppedImageUrl.value = url
  croppedFileName.value = file.name

  return false
}

function handleBeforeCrop(file: File & { uid?: string }) {
  const isValid = file.type.startsWith('image/')
  if (!isValid) {
    addLog(`beforeCrop: ${t('demo.imgCrop.cancelLog').split(': ')[1]}`)
  }
  return isValid
}
</script>

<template>
  <div class="demo-app">
    <!-- Control Panel -->
    <aside class="control-panel">
      <h2>{{ t('demo.imgCrop.title') }}</h2>

      <!-- Upload area -->
      <div class="control-group">
        <label>{{ t('demo.imgCrop.upload') }}</label>
        <ImgCrop
          :quality="quality"
          :crop-shape="cropShape"
          :show-grid="showGrid"
          :zoom-slider="zoomSlider"
          :rotation-slider="rotationSlider"
          :aspect-slider="aspectSlider"
          :show-reset="showReset"
          :aspect="aspect"
          :before-crop="handleBeforeCrop"
          @modal-ok="handleModalOk"
          @modal-cancel="handleModalCancel"
        >
          <Upload :before-upload="handleBeforeUpload" :show-upload-list="false">
            <Button type="primary" class="upload-btn">
              {{ t('demo.imgCrop.uploadBtn') }}
            </Button>
          </Upload>
        </ImgCrop>
      </div>

      <!-- Quality -->
      <div class="control-group">
        <label>{{ t('demo.imgCrop.quality') }}：{{ quality }}</label>
        <input
          type="range"
          :value="quality"
          min="0.1"
          max="1"
          step="0.1"
          @input="quality = Number(($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Aspect ratio -->
      <div class="control-group">
        <label>{{ t('demo.imgCrop.aspect') }}</label>
        <div class="aspect-buttons">
          <button
            v-for="opt in aspectOptions"
            :key="opt.value"
            :class="{ active: aspect === opt.value }"
            @click="aspect = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Crop shape -->
      <div class="control-group">
        <label>{{ t('demo.imgCrop.cropShape') }}</label>
        <div class="aspect-buttons">
          <button
            :class="{ active: cropShape === 'rect' }"
            @click="cropShape = 'rect'"
          >
            {{ t('demo.imgCrop.shape.rect') }}
          </button>
          <button
            :class="{ active: cropShape === 'round' }"
            @click="cropShape = 'round'"
          >
            {{ t('demo.imgCrop.shape.round') }}
          </button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="control-group">
        <label>{{ t('demo.imgCrop.toggles') }}</label>
        <div class="toggle-list">
          <label class="toggle-item">
            <input type="checkbox" v-model="zoomSlider" />
            {{ t('demo.imgCrop.toggle.zoom') }}
          </label>
          <label class="toggle-item">
            <input type="checkbox" v-model="rotationSlider" />
            {{ t('demo.imgCrop.toggle.rotation') }}
          </label>
          <label class="toggle-item">
            <input type="checkbox" v-model="aspectSlider" />
            {{ t('demo.imgCrop.toggle.aspect') }}
          </label>
          <label class="toggle-item">
            <input type="checkbox" v-model="showGrid" />
            {{ t('demo.imgCrop.toggle.grid') }}
          </label>
          <label class="toggle-item">
            <input type="checkbox" v-model="showReset" />
            {{ t('demo.imgCrop.toggle.reset') }}
          </label>
        </div>
      </div>

      <!-- Preview -->
      <div class="control-group" v-if="croppedImageUrl">
        <label>{{ t('demo.imgCrop.preview') }}</label>
        <div class="preview-box">
          <img :src="croppedImageUrl" :alt="croppedFileName" />
        </div>
        <div class="preview-name">{{ croppedFileName }}</div>
      </div>
    </aside>

    <!-- Log panel -->
    <div class="log-panel">
      <h2>{{ t('demo.imgCrop.eventLog') }}</h2>
      <div class="log-list">
        <div v-if="modalLog.length === 0" class="log-empty">
          {{ t('demo.imgCrop.waiting') }}
        </div>
        <div v-for="(msg, i) in modalLog" :key="i" class="log-item">
          {{ msg }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-app {
  min-height: 100vh;
  display: flex;
}

.control-panel {
  width: 300px;
  flex-shrink: 0;
  background: #1e1e1e;
  padding: 16px;
  overflow-y: auto;
  max-height: 100vh;
}

.control-panel h2 {
  margin: 0 0 12px;
  font-size: 1.1em;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.control-group {
  margin-bottom: 14px;
}

.control-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.9em;
  color: #ccc;
}

.control-group input[type='range'] {
  width: 100%;
  accent-color: #42b883;
}

.upload-btn {
  width: 100%;
  margin-bottom: 8px;
}

.aspect-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.aspect-buttons button {
  padding: 4px 10px;
  font-size: 0.8em;
  border: 1px solid #444;
  background: transparent;
  color: #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.aspect-buttons button:hover {
  border-color: #42b883;
  color: #42b883;
}

.aspect-buttons button.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85em;
  color: #ccc;
  cursor: pointer;
}

.toggle-item input[type='checkbox'] {
  accent-color: #42b883;
}

.preview-box {
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #333;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-box img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.preview-name {
  font-size: 0.75em;
  color: #888;
  margin-top: 4px;
  text-align: center;
  word-break: break-all;
}

/* Log Panel */
.log-panel {
  flex: 1;
  min-width: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.log-panel h2 {
  margin: 0 0 12px;
  font-size: 1.1em;
}

.log-list {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  overflow-y: auto;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.82em;
  max-height: calc(100vh - 60px);
}

.log-empty {
  color: #555;
  text-align: center;
  padding-top: 40px;
}

.log-item {
  color: #42b883;
  padding: 3px 0;
  border-bottom: 1px solid #222;
}
</style>
