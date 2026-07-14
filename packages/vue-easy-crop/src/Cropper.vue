<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { Area, CropperInteraction, MediaSize, Point, Size, VideoSrc } from './types'
import { useCropper } from './useCropper'
import type { CropperProps, CropperEmits } from './useCropper'

// Re-export types for convenience
export type { Area, CropperInteraction, MediaSize, Point, Size, VideoSrc }

const props = withDefaults(defineProps<CropperProps>(), {
  zoom: 1,
  rotation: 0,
  aspect: 4 / 3,
  maxZoom: 3,
  minZoom: 1,
  cropShape: 'rect',
  objectFit: 'contain',
  showGrid: true,
  zoomSpeed: 1,
  restrictPosition: true,
  zoomWithScroll: true,
  keyboardStep: 1,
  roundCropAreaPixels: false,
  disableAutomaticStylesInjection: false,
})

const emit = defineEmits<CropperEmits>()

// Template refs
const containerRef = useTemplateRef<HTMLElement>('containerRef')
const imageRef = useTemplateRef<HTMLImageElement>('imageRef')
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

const cropper = useCropper(props, emit, containerRef, imageRef, videoRef)

// Expose refs to parent
defineExpose({
  cropperRef: cropper.cropperRef,
  imageRef,
  videoRef,
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['vueEasyCrop_Container', props.containerClass]"
    :style="props.containerStyle"
    data-testid="container"
    @mousedown="cropper.onMouseDown"
    @touchstart="cropper.onTouchStart"
  >
    <!-- Image -->
    <img
      v-if="props.image"
      ref="imageRef"
      alt=""
      :src="props.image"
      :class="cropper.getImageClasses()"
      :style="[props.mediaStyle, { transform: cropper.getMediaTransform() }]"
      v-bind="props.mediaProps"
      @load="cropper.onMediaLoad"
    />

    <!-- Video -->
    <video
      v-else-if="props.video"
      ref="videoRef"
      autoplay
      playsinline
      loop
      muted
      :class="cropper.getVideoClasses()"
      :style="[props.mediaStyle, { transform: cropper.getMediaTransform() }]"
      v-bind="props.mediaProps"
      @loadedmetadata="cropper.onMediaLoad"
    >
      <source
        v-for="item in cropper.getVideoSources()"
        :key="item.src"
        :src="item.src"
        :type="item.type"
      />
    </video>

    <!-- Crop Area -->
    <div
      v-if="cropper.cropSizeRef.value"
      ref="cropper.cropperRef"
      :class="cropper.getCropAreaClasses()"
      :style="{
        ...props.cropAreaStyle,
        width: cropper.roundCropAreaPixels
          ? `${Math.round(cropper.cropSizeRef.value.width)}px`
          : `${cropper.cropSizeRef.value.width}px`,
        height: cropper.roundCropAreaPixels
          ? `${Math.round(cropper.cropSizeRef.value.height)}px`
          : `${cropper.cropSizeRef.value.height}px`,
      }"
      tabindex="0"
      data-testid="cropper"
      v-bind="props.cropperProps"
      @keydown="cropper.onKeyDown"
      @keyup="cropper.onKeyUp"
    />
  </div>
</template>
