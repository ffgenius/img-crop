<script setup lang="ts">
import { computed } from 'vue'

import type { ApiRow } from '../components/ApiTable.vue'

import ApiTable from '../components/ApiTable.vue'
import CodeBlock from '../components/CodeBlock.vue'
import { useI18n } from '../i18n'

const { t } = useI18n()

const basicUsageCode = `<ImgCrop :aspect="1" crop-shape="rect">
  <Upload :before-upload="handleUpload">
    <Button>Upload Image</Button>
  </Upload>
</ImgCrop>`

const propRows = computed<ApiRow[]>(() => [
  {
    name: 'quality',
    type: 'number',
    default: '0.4',
    description: t('imgCrop.prop.quality'),
  },
  {
    name: 'fillColor',
    type: 'string',
    default: `'white'`,
    description: t('imgCrop.prop.fillColor'),
  },
  {
    name: 'zoomSlider',
    type: 'boolean',
    default: 'true',
    description: t('imgCrop.prop.zoomSlider'),
  },
  {
    name: 'rotationSlider',
    type: 'boolean',
    default: 'false',
    description: t('imgCrop.prop.rotationSlider'),
  },
  {
    name: 'aspectSlider',
    type: 'boolean',
    default: 'false',
    description: t('imgCrop.prop.aspectSlider'),
  },
  {
    name: 'showReset',
    type: 'boolean',
    default: 'false',
    description: t('imgCrop.prop.showReset'),
  },
  {
    name: 'resetText',
    type: 'string',
    default: 'undefined',
    description: t('imgCrop.prop.resetText'),
  },
  {
    name: 'aspect',
    type: 'number',
    default: '1',
    description: t('imgCrop.prop.aspect'),
  },
  {
    name: 'minZoom',
    type: 'number',
    default: '1',
    description: t('imgCrop.prop.minZoom'),
  },
  {
    name: 'maxZoom',
    type: 'number',
    default: '3',
    description: t('imgCrop.prop.maxZoom'),
  },
  {
    name: 'minAspect',
    type: 'number',
    default: '0.5',
    description: t('imgCrop.prop.minAspect'),
  },
  {
    name: 'maxAspect',
    type: 'number',
    default: '2',
    description: t('imgCrop.prop.maxAspect'),
  },
  {
    name: 'cropShape',
    type: `'rect'<br>| 'round'`,
    default: `'rect'`,
    description: t('imgCrop.prop.cropShape'),
  },
  {
    name: 'showGrid',
    type: 'boolean',
    default: 'false',
    description: t('imgCrop.prop.showGrid'),
  },
  {
    name: 'cropperProps',
    type: 'Record&lt;string, unknown&gt;',
    default: 'undefined',
    description: t('imgCrop.prop.cropperProps'),
  },
  {
    name: 'modalClassName',
    type: 'string',
    default: 'undefined',
    description: t('imgCrop.prop.modalClassName'),
  },
  {
    name: 'modalTitle',
    type: 'string',
    default: `'裁剪图片' (中文) / 'Crop Image' (英文)`,
    description: t('imgCrop.prop.modalTitle'),
  },
  {
    name: 'modalWidth',
    type: 'number | string',
    default: 'undefined',
    description: t('imgCrop.prop.modalWidth'),
  },
  {
    name: 'modalOk',
    type: 'string',
    default: 'undefined',
    description: t('imgCrop.prop.modalOk'),
  },
  {
    name: 'modalCancel',
    type: 'string',
    default: 'undefined',
    description: t('imgCrop.prop.modalCancel'),
  },
  {
    name: 'onModalOk',
    type: '(value: BeforeUploadReturnType) => void',
    default: 'undefined',
    description: t('imgCrop.prop.onModalOk'),
  },
  {
    name: 'onModalCancel',
    type: '(resolve: (value: BeforeUploadReturnType) => void) => void',
    default: 'undefined',
    description: t('imgCrop.prop.onModalCancel'),
  },
  {
    name: 'modalProps',
    type: 'Record&lt;string, unknown&gt;',
    default: 'undefined',
    description: t('imgCrop.prop.modalProps'),
  },
  {
    name: 'beforeCrop',
    type: 'BeforeUpload',
    default: 'undefined',
    description: t('imgCrop.prop.beforeCrop'),
  },
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'modal-ok',
    type: '(value: BeforeUploadReturnType) => void',
    description: t('imgCrop.event.modal-ok'),
  },
  {
    name: 'modal-cancel',
    type: '() => void',
    description: t('imgCrop.event.modal-cancel'),
  },
])

const slotRows = computed<ApiRow[]>(() => [
  { name: 'default', type: '—', description: t('imgCrop.slot.default') },
])

const typeRows = computed<ApiRow[]>(() => [
  {
    name: 'BeforeUpload',
    type: '(file: File & { uid?: string }, fileList: (File & { uid?: string })[]) => boolean | Promise&lt;File | boolean | typeof Upload.LIST_IGNORE&gt;',
    description: t('imgCrop.type.BeforeUpload'),
  },
  {
    name: 'BeforeUploadReturnType',
    type: 'ReturnType&lt;BeforeUpload&gt;',
    description: t('imgCrop.type.BeforeUploadReturnType'),
  },
  {
    name: 'ImgCropProps',
    type: 'interface',
    description: t('imgCrop.type.ImgCropProps'),
  },
  {
    name: 'ImgCropEmits',
    type: 'interface',
    description: t('imgCrop.type.ImgCropEmits'),
  },
  {
    name: 'EasyCropRef',
    type: '{ rotation: number, cropPixelsRef: { value: Area }, onReset: () => void }',
    description: t('imgCrop.type.EasyCropRef'),
  },
  {
    name: 'EasyCropProps',
    type: 'interface',
    description: t('imgCrop.type.EasyCropProps'),
  },
])
</script>

<template>
  <div class="api-doc">
    <h1>{{ t('imgCrop.title') }}</h1>
    <p class="api-intro" v-html="t('imgCrop.intro')" />

    <div class="api-section">
      <h3 class="api-section-title">{{ t('imgCrop.basicUsage') }}</h3>
      <CodeBlock :code="basicUsageCode" language="xml" />
      <p class="api-note" v-html="t('imgCrop.note')" />
    </div>

    <ApiTable :title="t('imgCrop.props')" kind="props" :rows="propRows" />
    <ApiTable :title="t('imgCrop.events')" kind="events" :rows="eventRows" />
    <ApiTable :title="t('imgCrop.slots')" kind="slots" :rows="slotRows" />
    <ApiTable :title="t('imgCrop.types')" :rows="typeRows" />
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

.api-section {
  margin-bottom: 32px;
}

.api-section-title {
  margin: 0 0 12px;
  font-size: 1em;
  font-weight: 600;
  color: #ddd;
}

.api-note {
  font-size: 0.85em;
  color: #888;
  background: rgba(66, 184, 131, 0.06);
  border: 1px solid rgba(66, 184, 131, 0.15);
  padding: 10px 14px;
  border-radius: 6px;
}

.api-note :deep(code) {
  color: #42b883;
}
</style>
