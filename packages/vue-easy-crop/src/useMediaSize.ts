import { type Ref, shallowRef, ref } from 'vue'
import type { MediaSize, Point, Size } from './types'
import { getCropSize } from './helpers'

const RESIZE_EMIT_DEBOUNCE_TIME = 250

export interface UseMediaSizeOptions {
  containerRef: Ref<HTMLElement | null>
  imageRef: Ref<HTMLImageElement | null>
  videoRef: Ref<HTMLVideoElement | null>
  aspect: () => number
  rotation: () => number
  objectFit: () => 'contain' | 'cover' | 'horizontal-cover' | 'vertical-cover' | undefined
  cropSizeProp: () => Size | undefined
  /** Called when the computed crop size changes (replaces setCropSize callback) */
  onCropSizeChange?: (cropSize: Size) => void
}

export function useMediaSize(opts: UseMediaSizeOptions) {
  const { containerRef, imageRef, videoRef, aspect, rotation, objectFit, cropSizeProp, onCropSizeChange } = opts

  const mediaSize = shallowRef<MediaSize>({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 })
  const cropSize = shallowRef<Size | null>(null)
  const mediaObjectFit = ref<string | undefined>(undefined)
  const containerRect = shallowRef<DOMRect | null>(null)

  const containerPosition: Point = { x: 0, y: 0 }

  let resizeObserver: ResizeObserver | null = null
  let resizeEmitTimer: ReturnType<typeof setTimeout> | null = null
  let windowResizeHandler: (() => void) | null = null

  function saveContainerPosition() {
    const el = containerRef.value
    if (el) {
      const bounds = el.getBoundingClientRect()
      containerPosition.x = bounds.left
      containerPosition.y = bounds.top
    }
  }

  /** Resolve the effective objectFit (cover → horizontal/vertical-cover based on media vs container aspect) */
  function resolveObjectFit(): string {
    const fit = objectFit()
    if (fit === 'cover') {
      const mediaEl = imageRef.value || videoRef.value
      const container = containerRef.value
      if (mediaEl && container) {
        const rect = container.getBoundingClientRect()
        containerRect.value = rect
        const containerAspect = rect.width / rect.height
        const nw = imageRef.value?.naturalWidth || videoRef.value?.videoWidth || 0
        const nh = imageRef.value?.naturalHeight || videoRef.value?.videoHeight || 0
        const mediaAspect = nw / nh
        return mediaAspect < containerAspect ? 'horizontal-cover' : 'vertical-cover'
      }
      return 'horizontal-cover'
    }
    return fit ?? 'contain'
  }

  /** Compute rendered media dimensions and crop size. Returns the new cropSize. */
  function computeSizes(): {
    newMediaSize: MediaSize
    newCropSize: Size
    containerWidth: number
    containerHeight: number
  } | null {
    const mediaEl = imageRef.value || videoRef.value
    if (!mediaEl || !containerRef.value) return null

    const rect = containerRef.value.getBoundingClientRect()
    containerRect.value = rect
    saveContainerPosition()

    const containerAspect = rect.width / rect.height
    const naturalWidth = imageRef.value?.naturalWidth || videoRef.value?.videoWidth || 0
    const naturalHeight = imageRef.value?.naturalHeight || videoRef.value?.videoHeight || 0
    const isMediaScaledDown = mediaEl.offsetWidth < naturalWidth || mediaEl.offsetHeight < naturalHeight
    const mediaAspect = naturalWidth / naturalHeight

    let renderedMediaSize: Size
    if (isMediaScaledDown) {
      switch (mediaObjectFit.value) {
        default:
        case 'contain':
          renderedMediaSize =
            containerAspect > mediaAspect
              ? { width: rect.height * mediaAspect, height: rect.height }
              : { width: rect.width, height: rect.width / mediaAspect }
          break
        case 'horizontal-cover':
          renderedMediaSize = { width: rect.width, height: rect.width / mediaAspect }
          break
        case 'vertical-cover':
          renderedMediaSize = { width: rect.height * mediaAspect, height: rect.height }
          break
      }
    } else {
      renderedMediaSize = { width: mediaEl.offsetWidth, height: mediaEl.offsetHeight }
    }

    const newMediaSize: MediaSize = { ...renderedMediaSize, naturalWidth, naturalHeight }
    mediaSize.value = newMediaSize

    const newCropSize = cropSizeProp()
      ? cropSizeProp()!
      : getCropSize(newMediaSize.width, newMediaSize.height, rect.width, rect.height, aspect(), rotation())

    if (
      !cropSize.value ||
      cropSize.value.height !== newCropSize.height ||
      cropSize.value.width !== newCropSize.width
    ) {
      onCropSizeChange?.(newCropSize)
    }

    cropSize.value = newCropSize
    return { newMediaSize, newCropSize, containerWidth: rect.width, containerHeight: rect.height }
  }

  /** Called when image/video finishes loading */
  function onMediaLoad() {
    mediaObjectFit.value = resolveObjectFit()
    return computeSizes()
  }

  /** Set up ResizeObserver on the container, with a skip for the initial fire */
  function setupResizeObserver(onResize: () => void) {
    if (typeof ResizeObserver === 'undefined' || !containerRef.value) return
    let isFirstResize = true
    resizeObserver = new ResizeObserver(() => {
      if (isFirstResize) { isFirstResize = false; return }
      onResize()
    })
    resizeObserver.observe(containerRef.value)
  }

  /** Fallback window resize listener when ResizeObserver is unavailable */
  function setupWindowResize(onResize: () => void) {
    if (typeof ResizeObserver !== 'undefined') return
    windowResizeHandler = () => onResize()
    window.addEventListener('resize', windowResizeHandler)
  }

  /** Create a debounced version of emitCropData for resize events */
  function debounce(fn: () => void, ms = RESIZE_EMIT_DEBOUNCE_TIME) {
    return () => {
      if (resizeEmitTimer) clearTimeout(resizeEmitTimer)
      resizeEmitTimer = setTimeout(fn, ms)
    }
  }

  function cleanup() {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (windowResizeHandler) {
      window.removeEventListener('resize', windowResizeHandler)
      windowResizeHandler = null
    }
    if (resizeEmitTimer) {
      clearTimeout(resizeEmitTimer)
      resizeEmitTimer = null
    }
  }

  return {
    mediaSize,
    cropSize,
    mediaObjectFit,
    containerRect,
    containerPosition,
    saveContainerPosition,
    resolveObjectFit,
    computeSizes,
    onMediaLoad,
    setupResizeObserver,
    setupWindowResize,
    debounce,
    cleanup,
  }
}
