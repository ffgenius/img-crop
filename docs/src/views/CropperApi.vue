<script setup lang="ts">
import { computed } from 'vue'

import type { ApiRow } from '../components/ApiTable.vue'

import ApiTable from '../components/ApiTable.vue'
import { useI18n } from '../i18n'

const { t } = useI18n()

const propRows = computed<ApiRow[]>(() => [
  {
    name: 'image',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.image'),
  },
  {
    name: 'video',
    type: 'string | VideoSrc[]',
    default: 'undefined',
    description: t('cropper.prop.video'),
  },
  { name: 'crop', type: 'Point', description: t('cropper.prop.crop') },
  {
    name: 'zoom',
    type: 'number',
    default: '1',
    description: t('cropper.prop.zoom'),
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: t('cropper.prop.rotation'),
  },
  {
    name: 'aspect',
    type: 'number',
    default: '4 / 3',
    description: t('cropper.prop.aspect'),
  },
  {
    name: 'minZoom',
    type: 'number',
    default: '1',
    description: t('cropper.prop.minZoom'),
  },
  {
    name: 'maxZoom',
    type: 'number',
    default: '3',
    description: t('cropper.prop.maxZoom'),
  },
  {
    name: 'cropShape',
    type: `'rect'<br>| 'round'`,
    default: `'rect'`,
    description: t('cropper.prop.cropShape'),
  },
  {
    name: 'cropSize',
    type: 'Size',
    default: 'undefined',
    description: t('cropper.prop.cropSize'),
  },
  {
    name: 'objectFit',
    type: `'contain'<br>| 'cover'<br>| 'horizontal-cover'<br>| 'vertical-cover'`,
    default: `'contain'`,
    description: t('cropper.prop.objectFit'),
  },
  {
    name: 'showGrid',
    type: 'boolean',
    default: 'false',
    description: t('cropper.prop.showGrid'),
  },
  {
    name: 'zoomSpeed',
    type: 'number',
    default: '1',
    description: t('cropper.prop.zoomSpeed'),
  },
  {
    name: 'zoomWithScroll',
    type: 'boolean',
    default: 'true',
    description: t('cropper.prop.zoomWithScroll'),
  },
  {
    name: 'roundCropAreaPixels',
    type: 'boolean',
    default: 'true',
    description: t('cropper.prop.roundCropAreaPixels'),
  },
  {
    name: 'restrictPosition',
    type: 'boolean',
    default: 'true',
    description: t('cropper.prop.restrictPosition'),
  },
  {
    name: 'mediaProps',
    type: 'Record&lt;string, unknown&gt;',
    default: 'undefined',
    description: t('cropper.prop.mediaProps'),
  },
  {
    name: 'disableAutomaticStylesInjection',
    type: 'boolean',
    default: 'false',
    description: t('cropper.prop.disableAutomaticStylesInjection'),
  },
  {
    name: 'initialCroppedAreaPixels',
    type: 'Area',
    default: 'undefined',
    description: t('cropper.prop.initialCroppedAreaPixels'),
  },
  {
    name: 'initialCroppedAreaPercentages',
    type: 'Area',
    default: 'undefined',
    description: t('cropper.prop.initialCroppedAreaPercentages'),
  },
  {
    name: 'nonce',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.nonce'),
  },
  {
    name: 'keyboardStep',
    type: 'number',
    default: '10',
    description: t('cropper.prop.keyboardStep'),
  },
  {
    name: 'onTouchRequest',
    type: '(e: TouchEvent) => boolean',
    default: 'undefined',
    description: t('cropper.prop.onTouchRequest'),
  },
  {
    name: 'onWheelRequest',
    type: '(e: WheelEvent) => boolean',
    default: 'undefined',
    description: t('cropper.prop.onWheelRequest'),
  },
  {
    name: 'transform',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.transform'),
  },
  {
    name: 'containerStyle',
    type: 'Record&lt;string, string | number&gt;',
    default: 'undefined',
    description: t('cropper.prop.containerStyle'),
  },
  {
    name: 'mediaStyle',
    type: 'Record&lt;string, string | number&gt;',
    default: 'undefined',
    description: t('cropper.prop.mediaStyle'),
  },
  {
    name: 'cropAreaStyle',
    type: 'Record&lt;string, string | number&gt;',
    default: 'undefined',
    description: t('cropper.prop.cropAreaStyle'),
  },
  {
    name: 'containerClass',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.containerClass'),
  },
  {
    name: 'mediaClass',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.mediaClass'),
  },
  {
    name: 'cropAreaClass',
    type: 'string',
    default: 'undefined',
    description: t('cropper.prop.cropAreaClass'),
  },
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:crop',
    type: '(point: Point) => void',
    description: t('cropper.event.update:crop'),
  },
  {
    name: 'update:zoom',
    type: '(zoom: number) => void',
    description: t('cropper.event.update:zoom'),
  },
  {
    name: 'update:rotation',
    type: '(rotation: number) => void',
    description: t('cropper.event.update:rotation'),
  },
  {
    name: 'crop-complete',
    type: '(croppedArea: Area, croppedAreaPixels: Area) => void',
    description: t('cropper.event.crop-complete'),
  },
  {
    name: 'crop-area-change',
    type: '(croppedArea: Area, croppedAreaPixels: Area) => void',
    description: t('cropper.event.crop-area-change'),
  },
  {
    name: 'crop-size-change',
    type: '(cropSize: Size) => void',
    description: t('cropper.event.crop-size-change'),
  },
  {
    name: 'interaction-start',
    type: '(interaction: CropperInteraction) => void',
    description: t('cropper.event.interaction-start'),
  },
  {
    name: 'interaction-end',
    type: '(interaction: CropperInteraction) => void',
    description: t('cropper.event.interaction-end'),
  },
  {
    name: 'media-loaded',
    type: '(mediaSize: MediaSize) => void',
    description: t('cropper.event.media-loaded'),
  },
])

const typeRows = computed<ApiRow[]>(() => [
  {
    name: 'Point',
    type: '{ x: number, y: number }',
    description: t('cropper.type.Point'),
  },
  {
    name: 'Size',
    type: '{ width: number, height: number }',
    description: t('cropper.type.Size'),
  },
  {
    name: 'MediaSize',
    type: '{ width: number, height: number, naturalWidth: number, naturalHeight: number }',
    description: t('cropper.type.MediaSize'),
  },
  {
    name: 'Area',
    type: '{ width: number, height: number, x: number, y: number }',
    description: t('cropper.type.Area'),
  },
  {
    name: 'VideoSrc',
    type: '{ src: string, type?: string }',
    description: t('cropper.type.VideoSrc'),
  },
  {
    name: 'CropperInteraction',
    type: '{ source: CropperInteractionSource }',
    description: t('cropper.type.CropperInteraction'),
  },
  {
    name: 'CropperInteractionSource',
    type: `'mouse'<br>| 'touch'<br>| 'wheel'<br>| 'keyboard'`,
    description: t('cropper.type.CropperInteractionSource'),
  },
])

const utilRows = computed<ApiRow[]>(() => [
  {
    name: 'getInitialCropFromCroppedAreaPixels',
    type: '(croppedAreaPixels: Area, mediaSize: MediaSize) => { crop: Point, zoom: number } | null',
    description: t('cropper.util.getInitialCropFromCroppedAreaPixels'),
  },
  {
    name: 'getInitialCropFromCroppedAreaPercentages',
    type: '(croppedAreaPercentages: Area, mediaSize: MediaSize) => { crop: Point, zoom: number } | null',
    description: t('cropper.util.getInitialCropFromCroppedAreaPercentages'),
  },
])

const exposeRows = computed<ApiRow[]>(() => [
  {
    name: 'cropperRef',
    type: 'HTMLDivElement',
    description: t('cropper.expose.cropperRef'),
  },
  {
    name: 'imageRef',
    type: 'HTMLImageElement',
    description: t('cropper.expose.imageRef'),
  },
  {
    name: 'videoRef',
    type: 'HTMLVideoElement',
    description: t('cropper.expose.videoRef'),
  },
])
</script>

<template>
  <div class="api-doc">
    <h1>{{ t('cropper.title') }}</h1>
    <p class="api-intro" v-html="t('cropper.intro')" />

    <ApiTable :title="t('cropper.props')" kind="props" :rows="propRows" />
    <ApiTable :title="t('cropper.events')" kind="events" :rows="eventRows" />
    <ApiTable :title="t('cropper.types')" :rows="typeRows" />
    <ApiTable :title="t('cropper.utils')" :rows="utilRows" />
    <ApiTable :title="t('cropper.expose')" :rows="exposeRows" />
  </div>
</template>

<style scoped>
.api-doc {
  padding: 32px;
}

.api-doc h1 {
  margin: 0 0 8px;
  font-size: 1.6em;
  color: #e0e0e0;
}

.api-intro {
  margin: 0 0 32px;
  color: #999;
  font-size: 0.92em;
  line-height: 1.6;
}

.api-intro :deep(code) {
  color: #42b883;
  font-size: 0.95em;
}
</style>
