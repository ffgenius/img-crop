<script setup lang="ts">
import type { Area, Point } from '@antdv-next/vue-easy-crop'

import Cropper from '@antdv-next/vue-easy-crop'
import { ref, computed } from 'vue'

import { useI18n } from '../i18n'
import IframeWrapper from '../IframeWrapper.vue'

const { t } = useI18n()

const TEST_IMAGES: Record<string, string> = {
  '/images/dog.jpeg': 'Landscape',
  '/images/flower.jpeg': 'Portrait',
  '/images/cat.jpeg': 'Small portrait',
  '/images/2000x1200.jpeg': '2000x1200',
  '/images/1000x600.jpeg': '1000x600',
}

// --- URL query params ---
const urlParams = new URLSearchParams(window.location.search)
const imgFromQuery = urlParams.get('img')
const setInitialCrop = urlParams.get('setInitialCrop') === 'true'
const hideControls = urlParams.get('hideControls') === 'true'
const iframed = urlParams.get('iframed') === 'true'

const defaultImage = imgFromQuery || Object.keys(TEST_IMAGES)[0]
const demoImage = ref(defaultImage)

const crop = ref<Point>({ x: 0, y: 0 })
const zoom = ref(1)
const rotation = ref(0)
const aspect = ref(4 / 3)
const cropShape = ref<'rect' | 'round'>('rect')

const croppedArea = ref<Area | null>(null)
const croppedAreaPixels = ref<Area | null>(null)

const initialCroppedAreaPixels = setInitialCrop
  ? { width: 699, height: 524, x: 875, y: 157 }
  : undefined

const aspectLabel = computed(() => {
  if (aspect.value === 4 / 3) return t('demo.cropper.aspect4:3')
  if (aspect.value === 1) return t('demo.cropper.aspect1:1')
  if (aspect.value === 3 / 4) return t('demo.cropper.aspect3:4')
  if (aspect.value === 16 / 9) return t('demo.cropper.aspect16:9')
  return `${aspect.value.toFixed(2)}`
})

function onCropChange(point: Point) {
  crop.value = point
}

function onZoomChange(z: number) {
  zoom.value = z
}

function onRotationChange(r: number) {
  rotation.value = r
}

function isAreaValid(area: Area): boolean {
  return (
    !isNaN(area.x) &&
    !isNaN(area.y) &&
    !isNaN(area.width) &&
    !isNaN(area.height)
  )
}

function onCropComplete(area: Area, pixels: Area) {
  console.log('onCropComplete!', area, pixels)
  if (isAreaValid(area)) croppedArea.value = area
  if (isAreaValid(pixels)) croppedAreaPixels.value = pixels
}

function onCropAreaChange(area: Area, pixels: Area) {
  console.log('onCropAreaChange!', area, pixels)
  if (isAreaValid(area)) croppedArea.value = area
  if (isAreaValid(pixels)) croppedAreaPixels.value = pixels
}

function onInteractionStart(interaction: { source: string }) {
  console.log('user interaction started', interaction)
}

function onInteractionEnd(interaction: { source: string }) {
  console.log('user interaction ended', interaction)
}

function setAspect(value: number) {
  aspect.value = value
}

function centerHorizontally() {
  crop.value = { ...crop.value, x: 0 }
}

function resetAll() {
  crop.value = { x: 0, y: 0 }
  zoom.value = 1
  rotation.value = 0
  aspect.value = 4 / 3
  cropShape.value = 'rect'
}

function onImageChange(e: Event) {
  const select = e.target as HTMLSelectElement
  demoImage.value = select.value
}
</script>

<template>
  <div class="demo-app">
    <!-- Controls (hideable via ?hideControls=true) -->
    <aside v-if="!hideControls" class="control-panel">
      <h2>{{ t('demo.cropper.title') }}</h2>

      <!-- Zoom -->
      <div class="control-group">
        <label>{{ t('demo.cropper.zoom') }}：{{ zoom.toFixed(1) }}x</label>
        <input
          data-testid="zoom-slider"
          type="range"
          :value="zoom"
          min="1"
          max="3"
          step="0.1"
          @input="zoom = Number(($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Rotation -->
      <div class="control-group">
        <label>{{ t('demo.cropper.rotation') }}：{{ rotation }}°</label>
        <input
          data-testid="rotation-slider"
          type="range"
          :value="rotation"
          min="-180"
          max="180"
          step="1"
          @input="rotation = Number(($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Aspect ratio -->
      <div class="control-group">
        <label>{{ t('demo.cropper.aspect') }}：{{ aspectLabel }}</label>
        <div class="aspect-buttons">
          <button
            data-testid="aspect-4-3"
            :class="{ active: aspect === 4 / 3 }"
            @click="setAspect(4 / 3)"
          >
            4:3
          </button>
          <button
            data-testid="aspect-1-1"
            :class="{ active: aspect === 1 }"
            @click="setAspect(1)"
          >
            1:1
          </button>
          <button
            data-testid="aspect-3-4"
            :class="{ active: aspect === 3 / 4 }"
            @click="setAspect(3 / 4)"
          >
            3:4
          </button>
          <button
            data-testid="aspect-16-9"
            :class="{ active: aspect === 16 / 9 }"
            @click="setAspect(16 / 9)"
          >
            16:9
          </button>
        </div>
      </div>

      <!-- Crop shape -->
      <div class="control-group">
        <label>{{ t('demo.cropper.cropShape') }}</label>
        <div class="aspect-buttons">
          <button
            data-testid="shape-rect"
            :class="{ active: cropShape === 'rect' }"
            @click="cropShape = 'rect'"
          >
            {{ t('demo.cropper.shape.rect') }}
          </button>
          <button
            data-testid="shape-round"
            :class="{ active: cropShape === 'round' }"
            @click="cropShape = 'round'"
          >
            {{ t('demo.cropper.shape.round') }}
          </button>
        </div>
      </div>

      <!-- Picture select -->
      <div class="control-group">
        <label>{{ t('demo.cropper.image') }}</label>
        <select
          id="picture-select"
          data-testid="picture-select"
          :value="demoImage"
          @change="onImageChange"
        >
          <option v-for="(label, key) in TEST_IMAGES" :key="key" :value="key">
            {{ label }}
          </option>
        </select>
      </div>

      <!-- Center button -->
      <div class="control-group">
        <button
          id="horizontal-center-button"
          data-testid="horizontal-center-button"
          class="btn-center"
          @click="centerHorizontally"
        >
          {{ t('demo.cropper.center') }}
        </button>
      </div>

      <!-- Reset -->
      <div class="control-group">
        <button data-testid="btn-reset" class="btn-reset" @click="resetAll">
          {{ t('demo.cropper.reset') }}
        </button>
      </div>

      <!-- Crop data (with IDs for test assertions) -->
      <div class="control-group crop-data">
        <h3>{{ t('demo.cropper.cropData') }}</h3>
        <table>
          <tbody>
            <tr>
              <td colspan="2">
                <strong>{{ t('demo.cropper.percentageArea') }}</strong>
              </td>
            </tr>
            <tr>
              <td>X</td>
              <td :id="'crop-area-x'">
                {{ croppedArea?.x != null ? Math.round(croppedArea.x) : '-' }}%
              </td>
            </tr>
            <tr>
              <td>Y</td>
              <td :id="'crop-area-y'">
                {{ croppedArea?.y != null ? Math.round(croppedArea.y) : '-' }}%
              </td>
            </tr>
            <tr>
              <td>{{ t('demo.cropper.width') }}</td>
              <td :id="'crop-area-width'">
                {{
                  croppedArea?.width != null
                    ? Math.round(croppedArea.width)
                    : '-'
                }}%
              </td>
            </tr>
            <tr>
              <td>{{ t('demo.cropper.height') }}</td>
              <td :id="'crop-area-height'">
                {{
                  croppedArea?.height != null
                    ? Math.round(croppedArea.height)
                    : '-'
                }}%
              </td>
            </tr>
            <tr style="height: 8px">
              <td colspan="2"></td>
            </tr>
            <tr>
              <td colspan="2">
                <strong>{{ t('demo.cropper.pixelArea') }}</strong>
              </td>
            </tr>
            <tr>
              <td>X</td>
              <td>{{ croppedAreaPixels?.x ?? '-' }}px</td>
            </tr>
            <tr>
              <td>Y</td>
              <td>{{ croppedAreaPixels?.y ?? '-' }}px</td>
            </tr>
            <tr>
              <td>{{ t('demo.cropper.width') }}</td>
              <td>{{ croppedAreaPixels?.width ?? '-' }}px</td>
            </tr>
            <tr>
              <td>{{ t('demo.cropper.height') }}</td>
              <td>{{ croppedAreaPixels?.height ?? '-' }}px</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="control-group tips">
        <h3>{{ t('demo.cropper.tips') }}</h3>
        <ul>
          <li>{{ t('demo.cropper.tip.drag') }}</li>
          <li>{{ t('demo.cropper.tip.zoom') }}</li>
          <li>{{ t('demo.cropper.tip.pinch') }}</li>
          <li>{{ t('demo.cropper.tip.keyboard') }}</li>
        </ul>
      </div>
    </aside>

    <!-- Cropper area -->
    <div class="cropper-section" :class="{ 'cropper-full': hideControls }">
      <!-- Iframe mode -->
      <IframeWrapper v-if="iframed">
        <div class="cropper-wrapper">
          <Cropper
            :image="demoImage"
            :crop="crop"
            :zoom="zoom"
            :rotation="rotation"
            :aspect="aspect"
            :crop-shape="cropShape"
            :initial-cropped-area-pixels="initialCroppedAreaPixels"
            @update:crop="onCropChange"
            @update:zoom="onZoomChange"
            @update:rotation="onRotationChange"
            @crop-complete="onCropComplete"
            @crop-area-change="onCropAreaChange"
            @interaction-start="onInteractionStart"
            @interaction-end="onInteractionEnd"
          />
        </div>
      </IframeWrapper>

      <!-- Normal mode -->
      <div v-else class="cropper-wrapper">
        <Cropper
          :image="demoImage"
          :crop="crop"
          :zoom="zoom"
          :rotation="rotation"
          :aspect="aspect"
          :crop-shape="cropShape"
          :initial-cropped-area-pixels="initialCroppedAreaPixels"
          @update:crop="onCropChange"
          @update:zoom="onZoomChange"
          @update:rotation="onRotationChange"
          @crop-complete="onCropComplete"
          @crop-area-change="onCropAreaChange"
          @interaction-start="onInteractionStart"
          @interaction-end="onInteractionEnd"
        />
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
  width: 260px;
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

.control-panel h3 {
  margin: 0 0 4px;
  font-size: 0.95em;
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

.control-group select {
  width: 100%;
  padding: 4px 8px;
  font-size: 0.85em;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #ccc;
  border-radius: 4px;
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

.btn-center {
  width: 100%;
  padding: 6px;
  font-size: 0.85em;
  border: 1px solid #42b883;
  background: transparent;
  color: #42b883;
  border-radius: 4px;
  cursor: pointer;
}

.btn-center:hover {
  background: #42b883;
  color: #fff;
}

.btn-reset {
  width: 100%;
  padding: 6px;
  font-size: 0.85em;
  border: 1px solid #e55353;
  background: transparent;
  color: #e55353;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #e55353;
  color: #fff;
}

.crop-data table {
  width: 100%;
  font-size: 0.8em;
}

.crop-data td {
  padding: 1px 4px;
  color: #aaa;
}

.crop-data td:last-child {
  text-align: right;
  color: #42b883;
  font-family: monospace;
}

.tips ul {
  margin: 0;
  padding-left: 16px;
  font-size: 0.8em;
  color: #999;
}

.tips li {
  margin-bottom: 3px;
}

.cropper-section {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: stretch;
}

.cropper-section.cropper-full {
  position: fixed;
  inset: 0;
}

.cropper-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  background: #1a1a1a;
}

.cropper-full .cropper-wrapper {
  min-height: 0;
  position: absolute;
  inset: 0;
}

@media (max-width: 768px) {
  .demo-app {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
    max-height: none;
  }

  .cropper-wrapper {
    min-height: 300px;
  }
}
</style>
