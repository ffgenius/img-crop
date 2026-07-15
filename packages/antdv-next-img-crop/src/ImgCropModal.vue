<script setup lang="ts">
import type { Area, Point } from 'vue-easy-crop'

import { Slider, Button } from 'antdv-next'
import { ref, watch, shallowRef, onMounted, onUnmounted } from 'vue'
import { Cropper } from 'vue-easy-crop'

import {
  PREFIX,
  ZOOM_INITIAL,
  ZOOM_STEP,
  ROTATION_INITIAL,
  ROTATION_MIN,
  ROTATION_MAX,
  ROTATION_STEP,
  ASPECT_STEP,
} from './constants'
import { cssStyles } from './styles'

const props = withDefaults(
  defineProps<{
    modalImage: string
    zoomSlider: boolean
    rotationSlider: boolean
    aspectSlider: boolean
    showReset: boolean
    resetBtnText: string
    aspect: number
    minZoom: number
    maxZoom: number
    minAspect: number
    maxAspect: number
    cropShape: 'rect' | 'round'
    showGrid: boolean
    cropperProps?: Record<string, unknown>
  }>(),
  {
    zoomSlider: true,
    rotationSlider: false,
    aspectSlider: false,
    showReset: false,
    aspect: 1,
    minZoom: 1,
    maxZoom: 3,
    minAspect: 0.5,
    maxAspect: 2,
    cropShape: 'rect',
    showGrid: false,
  }
)

const emit = defineEmits<{
  'update:rotation': [rotation: number]
}>()

// Cropper state
const crop = ref<Point>({ x: 0, y: 0 })
const zoom = ref(ZOOM_INITIAL)
const rotation = ref(ROTATION_INITIAL)
const innerAspect = ref(props.aspect)

// Store the latest crop pixels for canvas extraction
const cropPixelsRef = shallowRef<Area>({ width: 0, height: 0, x: 0, y: 0 })

// Track previous prop.aspect to detect external changes
let prevPropAspect = props.aspect

// Watch for external aspect prop changes
watch(
  () => props.aspect,
  (newVal) => {
    if (newVal !== prevPropAspect) {
      prevPropAspect = newVal
      innerAspect.value = newVal
    }
  }
)

// Sync rotation to parent for the canvas rotation logic
watch(rotation, (val) => {
  emit('update:rotation', val)
})

// Computed
const isResetActive =
  zoom.value !== ZOOM_INITIAL ||
  rotation.value !== ROTATION_INITIAL ||
  innerAspect.value !== props.aspect

// Methods
function onCropComplete(_croppedArea: Area, croppedAreaPixels: Area) {
  cropPixelsRef.value = croppedAreaPixels
}

function onReset() {
  zoom.value = ZOOM_INITIAL
  rotation.value = ROTATION_INITIAL
  innerAspect.value = props.aspect
}

defineExpose({
  rotation,
  cropPixelsRef,
  onReset,
})

// Inject scoped-equivalent CSS (matches vue-easy-crop pattern)
let styleEl: HTMLStyleElement | null = null

onMounted(() => {
  if (!document.querySelector('style[data-img-crop]')) {
    styleEl = document.createElement('style')
    styleEl.setAttribute('type', 'text/css')
    styleEl.setAttribute('data-img-crop', '')
    styleEl.innerHTML = cssStyles
    document.head.appendChild(styleEl)
  }
})

onUnmounted(() => {
  // Only remove if this was the only instance
  // (multiple ImgCrop instances can share the styles)
})
</script>

<template>
  <div :class="`${PREFIX}-body`">
    <Cropper
      v-bind="cropperProps"
      :image="modalImage"
      v-model:crop="crop"
      v-model:zoom="zoom"
      v-model:rotation="rotation"
      :aspect="innerAspect"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :crop-shape="cropShape"
      :show-grid="showGrid"
      :zoom-with-scroll="zoomSlider"
      :container-class="`${PREFIX}-container`"
      :media-class="`${PREFIX}-media`"
      @crop-complete="onCropComplete"
    />

    <!-- Zoom slider -->
    <section
      v-if="zoomSlider"
      :class="`${PREFIX}-control ${PREFIX}-control-zoom ${PREFIX}-slider-row`"
    >
      <button
        :class="`${PREFIX}-slider-btn`"
        :disabled="zoom - ZOOM_STEP < minZoom"
        @click="zoom = +(zoom - ZOOM_STEP).toFixed(1)"
      >
        －
      </button>
      <Slider
        :class="`${PREFIX}-slider`"
        :min="minZoom"
        :max="maxZoom"
        :step="ZOOM_STEP"
        :value="zoom"
        @change="zoom = $event"
      />
      <button
        :class="`${PREFIX}-slider-btn`"
        :disabled="zoom + ZOOM_STEP > maxZoom"
        @click="zoom = +(zoom + ZOOM_STEP).toFixed(1)"
      >
        ＋
      </button>
    </section>

    <!-- Rotation slider -->
    <section
      v-if="rotationSlider"
      :class="`${PREFIX}-control ${PREFIX}-control-rotation ${PREFIX}-slider-row`"
    >
      <button
        :class="`${PREFIX}-slider-btn ${PREFIX}-slider-btn-sm`"
        :disabled="rotation === ROTATION_MIN"
        @click="rotation = rotation - ROTATION_STEP"
      >
        ↺
      </button>
      <Slider
        :class="`${PREFIX}-slider`"
        :min="ROTATION_MIN"
        :max="ROTATION_MAX"
        :step="ROTATION_STEP"
        :value="rotation"
        @change="rotation = $event"
      />
      <button
        :class="`${PREFIX}-slider-btn ${PREFIX}-slider-btn-sm`"
        :disabled="rotation === ROTATION_MAX"
        @click="rotation = rotation + ROTATION_STEP"
      >
        ↻
      </button>
    </section>

    <!-- Aspect slider -->
    <section
      v-if="aspectSlider"
      :class="`${PREFIX}-control ${PREFIX}-control-aspect ${PREFIX}-slider-row`"
    >
      <button
        :class="`${PREFIX}-slider-btn`"
        :disabled="innerAspect - ASPECT_STEP < minAspect"
        @click="innerAspect = +(innerAspect - ASPECT_STEP).toFixed(2)"
      >
        ↕
      </button>
      <Slider
        :class="`${PREFIX}-slider`"
        :min="minAspect"
        :max="maxAspect"
        :step="ASPECT_STEP"
        :value="innerAspect"
        @change="innerAspect = $event"
      />
      <button
        :class="`${PREFIX}-slider-btn`"
        :disabled="innerAspect + ASPECT_STEP > maxAspect"
        @click="innerAspect = +(innerAspect + ASPECT_STEP).toFixed(2)"
      >
        ↔
      </button>
    </section>

    <!-- Reset button -->
    <Button
      v-if="showReset"
      :class="`${PREFIX}-reset-btn`"
      :style="isResetActive ? {} : { opacity: 0.3, pointerEvents: 'none' }"
      @click="onReset"
    >
      {{ resetBtnText }}
    </Button>
  </div>
</template>
