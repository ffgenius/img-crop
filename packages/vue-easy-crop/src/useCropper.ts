import { type Ref, ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'

import type {
  Area,
  CropperInteraction,
  MediaSize,
  Point,
  Size,
  VideoSrc,
} from './types'

import { cssStyles } from './cssStyles'
import {
  computeCroppedArea,
  getInitialCropFromCroppedAreaPercentages,
  getInitialCropFromCroppedAreaPixels,
  restrictPosition,
  classNames,
} from './helpers'
import { useInteraction } from './useInteraction'
import { useMediaSize } from './useMediaSize'

// --- constants ---
const MIN_ZOOM = 1
const MAX_ZOOM = 3
const KEYBOARD_STEP = 1

// --- props interface (mirrors CropperProps from react-easy-crop) ---
export interface CropperProps {
  image?: string
  video?: string | VideoSrc[]
  transform?: string
  crop: Point
  zoom?: number
  rotation?: number
  aspect?: number
  minZoom?: number
  maxZoom?: number
  cropShape?: 'rect' | 'round'
  cropSize?: Size
  objectFit?: 'contain' | 'cover' | 'horizontal-cover' | 'vertical-cover'
  showGrid?: boolean
  zoomSpeed?: number
  zoomWithScroll?: boolean
  roundCropAreaPixels?: boolean
  restrictPosition?: boolean
  mediaProps?: Record<string, unknown>
  cropperProps?: Record<string, unknown>
  disableAutomaticStylesInjection?: boolean
  initialCroppedAreaPixels?: Area
  initialCroppedAreaPercentages?: Area
  onTouchRequest?: (e: TouchEvent) => boolean
  onWheelRequest?: (e: WheelEvent) => boolean
  nonce?: string
  keyboardStep?: number
  containerStyle?: Record<string, string | number>
  mediaStyle?: Record<string, string | number>
  cropAreaStyle?: Record<string, string | number>
  containerClass?: string
  mediaClass?: string
  cropAreaClass?: string
}

// --- emits interface ---
export interface CropperEmits {
  (e: 'update:crop', point: Point): void
  (e: 'update:zoom', zoom: number): void
  (e: 'update:rotation', rotation: number): void
  (e: 'crop-complete', croppedArea: Area, croppedAreaPixels: Area): void
  (e: 'crop-area-change', croppedArea: Area, croppedAreaPixels: Area): void
  (e: 'crop-size-change', cropSize: Size): void
  (e: 'interaction-start', interaction: CropperInteraction): void
  (e: 'interaction-end', interaction: CropperInteraction): void
  (e: 'media-loaded', mediaSize: MediaSize): void
}

export function useCropper(
  props: CropperProps,
  emit: CropperEmits,
  containerRef: Ref<HTMLElement | null>,
  imageRef: Ref<HTMLImageElement | null>,
  videoRef: Ref<HTMLVideoElement | null>
) {
  // --- normalize props with defaults ---
  const zoom = ref(props.zoom ?? 1)
  const rotation = ref(props.rotation ?? 0)
  const aspect = ref(props.aspect ?? 4 / 3)
  const minZoom = ref(props.minZoom ?? MIN_ZOOM)
  const maxZoom = ref(props.maxZoom ?? MAX_ZOOM)
  const cropShape = ref(props.cropShape ?? 'rect')
  const showGrid = ref(props.showGrid ?? true)
  const objectFit = ref(props.objectFit ?? 'contain')
  const zoomSpeed = ref(props.zoomSpeed ?? 1)
  const zoomWithScroll = ref(props.zoomWithScroll ?? true)
  const restrictPositionProp = ref(props.restrictPosition ?? true)
  const roundCropAreaPixels = ref(props.roundCropAreaPixels ?? false)
  const keyboardStep = ref(props.keyboardStep ?? KEYBOARD_STEP)
  const disableAutomaticStylesInjection = ref(
    props.disableAutomaticStylesInjection ?? false
  )

  // internal state
  const isInitialized = ref(false)
  let styleEl: HTMLStyleElement | null = null
  let previousCropSize: Size | null = null

  // clean-up fns from sub-composables
  let cleanupWheel: (() => void) | null = null
  let cleanupGesture: (() => void) | null = null
  let cleanupScroll: (() => void) | null = null

  // --- media size composable ---
  const mediaSizeModule = useMediaSize({
    containerRef,
    imageRef,
    videoRef,
    aspect: () => aspect.value,
    rotation: () => rotation.value,
    objectFit: () =>
      objectFit.value as
        | 'contain'
        | 'cover'
        | 'horizontal-cover'
        | 'vertical-cover'
        | undefined,
    cropSizeProp: () => props.cropSize,
    onCropSizeChange: (newCropSize) => {
      emit('crop-size-change', newCropSize)
    },
  })

  // --- reactive bindings for interaction ---
  const mediaSizeRef = mediaSizeModule.mediaSize
  const cropSizeRef = mediaSizeModule.cropSize

  // --- crop data computation ---
  function getAspect() {
    if (props.cropSize) {
      return props.cropSize.width / props.cropSize.height
    }
    return aspect.value
  }

  function getCropData() {
    const cs = cropSizeRef.value
    if (!cs) return null

    const restrictedPosition = restrictPositionProp.value
      ? restrictPosition(
          props.crop,
          mediaSizeRef.value,
          cs,
          zoom.value,
          rotation.value
        )
      : props.crop

    return computeCroppedArea(
      restrictedPosition,
      mediaSizeRef.value,
      cs,
      getAspect(),
      zoom.value,
      rotation.value,
      restrictPositionProp.value
    )
  }

  function emitCropData() {
    const cropData = getCropData()
    if (!cropData) return

    const { croppedAreaPercentages, croppedAreaPixels } = cropData
    emit('crop-complete', croppedAreaPercentages, croppedAreaPixels)
    emit('crop-area-change', croppedAreaPercentages, croppedAreaPixels)
  }

  function emitCropAreaChange() {
    const cropData = getCropData()
    if (!cropData) return

    const { croppedAreaPercentages, croppedAreaPixels } = cropData
    emit('crop-area-change', croppedAreaPercentages, croppedAreaPixels)
  }

  const debouncedEmitCropData = mediaSizeModule.debounce(emitCropData)

  // --- initial crop ---
  function setInitialCrop(cropSz: Size) {
    if (props.initialCroppedAreaPercentages) {
      const { crop, zoom: initZoom } = getInitialCropFromCroppedAreaPercentages(
        props.initialCroppedAreaPercentages,
        mediaSizeRef.value,
        rotation.value,
        cropSz,
        minZoom.value,
        maxZoom.value
      )
      emit('update:crop', crop)
      emit('update:zoom', initZoom)
    } else if (props.initialCroppedAreaPixels) {
      const { crop, zoom: initZoom } = getInitialCropFromCroppedAreaPixels(
        props.initialCroppedAreaPixels,
        mediaSizeRef.value,
        rotation.value,
        cropSz,
        minZoom.value,
        maxZoom.value
      )
      emit('update:crop', crop)
      emit('update:zoom', initZoom)
    }
  }

  // --- recompute position on prop changes ---
  function recomputeCropPosition({
    isResizeTriggered = false,
  }: { isResizeTriggered?: boolean } = {}) {
    const cs = cropSizeRef.value
    if (!cs) return

    let adjustedCrop = { ...props.crop }

    if (
      isInitialized.value &&
      previousCropSize?.width &&
      previousCropSize?.height
    ) {
      const sizeChanged =
        Math.abs(previousCropSize.width - cs.width) > 1e-6 ||
        Math.abs(previousCropSize.height - cs.height) > 1e-6

      if (sizeChanged) {
        const scaleX = cs.width / previousCropSize.width
        const scaleY = cs.height / previousCropSize.height
        adjustedCrop = {
          x: props.crop.x * scaleX,
          y: props.crop.y * scaleY,
        }
      }
    }

    const newPosition = restrictPositionProp.value
      ? restrictPosition(
          adjustedCrop,
          mediaSizeRef.value,
          cs,
          zoom.value,
          rotation.value
        )
      : adjustedCrop

    previousCropSize = cs

    emit('update:crop', newPosition)
    if (isResizeTriggered) {
      debouncedEmitCropData()
    } else {
      emitCropData()
    }
  }

  // --- media load handler ---
  function onMediaLoad() {
    mediaSizeModule.mediaObjectFit.value = mediaSizeModule.resolveObjectFit()
    const result = mediaSizeModule.computeSizes()

    if (result) {
      const { newCropSize } = result
      previousCropSize = newCropSize
      emitCropData()
      setInitialCrop(newCropSize)
      isInitialized.value = true
    }

    emit('media-loaded', { ...mediaSizeRef.value })
  }

  // --- interaction composable ---
  const interaction = useInteraction({
    getCrop: () => props.crop,
    zoom,
    rotation,
    minZoom,
    maxZoom,
    mediaSize: mediaSizeRef,
    cropSize: cropSizeRef,
    restrictPosition: restrictPositionProp,
    zoomWithScroll,
    zoomSpeed,
    keyboardStep,
    getContainerPosition: () => mediaSizeModule.containerPosition,
    getContainerRect: () => mediaSizeModule.containerRect.value,
    onCropChange: (point) => emit('update:crop', point),
    onZoomChange: (z) => emit('update:zoom', z),
    onRotationChange: (r) => emit('update:rotation', r),
    onInteractionStart: (source) => emit('interaction-start', { source }),
    onInteractionEnd: (source) => emit('interaction-end', { source }),
    onTouchRequest: props.onTouchRequest,
    onWheelRequest: props.onWheelRequest,
    onEmitCropData: emitCropData,
    onScroll: () => mediaSizeModule.saveContainerPosition(),
  })

  // --- on resize handler ---
  function onResize() {
    mediaSizeModule.computeSizes()
    recomputeCropPosition({ isResizeTriggered: true })
  }

  // --- CSS injection ---
  function injectStyles(doc: Document) {
    if (disableAutomaticStylesInjection.value) return
    styleEl = doc.createElement('style')
    styleEl.setAttribute('type', 'text/css')
    if (props.nonce) {
      styleEl.setAttribute('nonce', props.nonce)
    }
    styleEl.innerHTML = cssStyles
    doc.head.appendChild(styleEl)
  }

  function removeStyles() {
    if (styleEl?.parentNode) {
      styleEl.parentNode.removeChild(styleEl)
      styleEl = null
    }
  }

  // --- lifecycle ---
  onMounted(() => {
    const doc = containerRef.value?.ownerDocument ?? document

    // ResizeObserver
    mediaSizeModule.setupResizeObserver(onResize)
    mediaSizeModule.setupWindowResize(onResize)

    // Wheel
    if (zoomWithScroll.value && containerRef.value) {
      cleanupWheel = interaction.setupWheelListener(containerRef.value)
    }

    // Gesture (iOS)
    if (containerRef.value) {
      cleanupGesture = interaction.setupGestureListener(containerRef.value)
    }

    // Scroll — keeps containerPosition accurate when the page scrolls
    cleanupScroll = interaction.setupScrollListener(doc)

    // Inject styles
    injectStyles(doc)

    // SSR: image may already be loaded
    if (imageRef.value?.complete) {
      onMediaLoad()
    }
  })

  onUnmounted(() => {
    mediaSizeModule.cleanup()
    interaction.cleanup()
    cleanupWheel?.()
    cleanupGesture?.()
    cleanupScroll?.()
    removeStyles()
  })

  // --- watchers (componentDidUpdate equivalent) ---
  watch(
    () => props.rotation,
    (newVal, oldVal) => {
      if (newVal !== undefined && newVal !== oldVal) {
        rotation.value = newVal
        mediaSizeModule.computeSizes()
        recomputeCropPosition()
      }
    }
  )

  watch(
    () => props.aspect,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        aspect.value = newVal ?? 4 / 3
        mediaSizeModule.computeSizes()
      }
    }
  )

  watch(
    () => props.objectFit,
    (newVal) => {
      if (newVal !== undefined) {
        objectFit.value = newVal
        mediaSizeModule.computeSizes()
      }
    }
  )

  watch(
    () => props.zoom,
    (newVal) => {
      if (newVal !== undefined && newVal !== zoom.value) {
        zoom.value = newVal
        recomputeCropPosition()
      }
    }
  )

  watch(
    () => props.cropSize,
    (newVal, oldVal) => {
      if (
        newVal?.height !== oldVal?.height ||
        newVal?.width !== oldVal?.width
      ) {
        mediaSizeModule.computeSizes()
      }
    }
  )

  watch(
    () => props.crop,
    () => {
      emitCropAreaChange()
    }
  )

  watch(
    () => props.zoomWithScroll,
    (newVal) => {
      if (newVal !== undefined) {
        zoomWithScroll.value = newVal
        if (containerRef.value) {
          if (newVal) {
            cleanupWheel = interaction.setupWheelListener(containerRef.value)
          } else {
            cleanupWheel?.()
            cleanupWheel = null
          }
        }
      }
    }
  )

  // When video source changes, reload the video element (mirrors componentDidUpdate in react-easy-crop)
  watch(
    () => props.video,
    (newVal, oldVal) => {
      if (newVal !== oldVal && videoRef.value) {
        videoRef.value.load()
      }
    }
  )

  // Sync props → internal refs
  watch(
    () => props.rotation,
    (v) => {
      if (v !== undefined) rotation.value = v
    }
  )
  watch(
    () => props.minZoom,
    (v) => {
      if (v !== undefined) minZoom.value = v
    }
  )
  watch(
    () => props.maxZoom,
    (v) => {
      if (v !== undefined) maxZoom.value = v
    }
  )
  watch(
    () => props.cropShape,
    (v) => {
      if (v !== undefined) cropShape.value = v
    }
  )
  watch(
    () => props.showGrid,
    (v) => {
      if (v !== undefined) showGrid.value = v
    }
  )
  watch(
    () => props.zoomSpeed,
    (v) => {
      if (v !== undefined) zoomSpeed.value = v
    }
  )
  watch(
    () => props.restrictPosition,
    (v) => {
      if (v !== undefined) restrictPositionProp.value = v
    }
  )
  watch(
    () => props.roundCropAreaPixels,
    (v) => {
      if (v !== undefined) roundCropAreaPixels.value = v
    }
  )
  watch(
    () => props.keyboardStep,
    (v) => {
      if (v !== undefined) keyboardStep.value = v
    }
  )

  // — computed helpers for the template —
  function getImageClasses() {
    const fit =
      mediaSizeModule.mediaObjectFit.value ?? mediaSizeModule.resolveObjectFit()
    return classNames(
      'vueEasyCrop_Image',
      fit === 'contain' && 'vueEasyCrop_Contain',
      fit === 'horizontal-cover' && 'vueEasyCrop_Cover_Horizontal',
      fit === 'vertical-cover' && 'vueEasyCrop_Cover_Vertical',
      props.mediaClass
    )
  }

  function getVideoClasses() {
    const fit =
      mediaSizeModule.mediaObjectFit.value ?? mediaSizeModule.resolveObjectFit()
    return classNames(
      'vueEasyCrop_Video',
      fit === 'contain' && 'vueEasyCrop_Contain',
      fit === 'horizontal-cover' && 'vueEasyCrop_Cover_Horizontal',
      fit === 'vertical-cover' && 'vueEasyCrop_Cover_Vertical',
      props.mediaClass
    )
  }

  function getCropAreaClasses() {
    return classNames(
      'vueEasyCrop_CropArea',
      cropShape.value === 'round' && 'vueEasyCrop_CropAreaRound',
      showGrid.value && 'vueEasyCrop_CropAreaGrid',
      props.cropAreaClass
    )
  }

  function getMediaTransform() {
    return (
      props.transform ||
      `translate(${props.crop.x}px, ${props.crop.y}px) rotate(${rotation.value}deg) scale(${zoom.value})`
    )
  }

  function getVideoSources(): VideoSrc[] {
    if (!props.video) return []
    if (Array.isArray(props.video)) return props.video
    return [{ src: props.video }]
  }

  return {
    // refs (exposed to parent)
    cropperRef: shallowRef<HTMLElement | null>(null),
    // sizing
    cropSizeRef,
    mediaObjectFit: mediaSizeModule.mediaObjectFit,
    // event handlers for template
    onMouseDown: interaction.handleMouseDown,
    onTouchStart: interaction.handleTouchStart,
    onKeyDown: interaction.handleKeyDown,
    onKeyUp: interaction.handleKeyUp,
    onMediaLoad,
    // computed for template
    getImageClasses,
    getVideoClasses,
    getCropAreaClasses,
    getMediaTransform,
    getVideoSources,
    // crop area style
    roundCropAreaPixels,
    // expose
    mediaSizeRef,
  }
}
