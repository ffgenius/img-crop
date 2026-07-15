import type { Ref } from 'vue'

import normalizeWheel from 'normalize-wheel'

import type { CropperInteractionSource, MediaSize, Point, Size } from './types'

import {
  clamp,
  getCenter,
  getDistanceBetweenPoints,
  getRotationBetweenPoints,
  restrictPosition,
} from './helpers'

export interface UseInteractionOptions {
  getCrop: () => Point
  zoom: Ref<number>
  rotation: Ref<number>
  minZoom: Ref<number>
  maxZoom: Ref<number>
  mediaSize: Ref<MediaSize>
  cropSize: Ref<Size | null>
  restrictPosition: Ref<boolean>
  zoomWithScroll: Ref<boolean>
  zoomSpeed: Ref<number>
  keyboardStep: Ref<number>
  /** container position in the viewport, updated on scroll/mousedown */
  getContainerPosition: () => Point
  getContainerRect: () => DOMRect | null

  // callbacks
  onCropChange: (point: Point) => void
  onZoomChange: (zoom: number) => void
  onRotationChange: (rotation: number) => void
  onInteractionStart: (source: CropperInteractionSource) => void
  onInteractionEnd: (source: CropperInteractionSource) => void
  onTouchRequest?: (e: TouchEvent) => boolean
  onWheelRequest?: (e: WheelEvent) => boolean
  onEmitCropData: () => void
  /** Called on document scroll to keep container position up to date */
  onScroll?: () => void
}

export function useInteraction(opts: UseInteractionOptions) {
  const {
    getCrop,
    zoom,
    rotation,
    minZoom,
    maxZoom,
    mediaSize,
    cropSize,
    restrictPosition: restrictPositionRef,
    zoomSpeed,
    keyboardStep,
    getContainerPosition,
    getContainerRect,
    onCropChange,
    onZoomChange,
    onRotationChange,
    onInteractionStart,
    onInteractionEnd,
    onTouchRequest,
    onWheelRequest,
    onEmitCropData,
    onScroll: onScrollCb,
  } = opts

  // --- drag state ---
  const dragStartPosition: Point = { x: 0, y: 0 }
  const dragStartCrop: Point = { x: 0, y: 0 }
  let dragInteractionSource: CropperInteractionSource | null = null
  let rafDragTimeout: number | null = null

  // --- pinch state ---
  let isTouching = false
  let lastPinchDistance = 0
  let lastPinchRotation = 0
  let rafPinchTimeout: number | null = null

  // --- wheel state ---
  let wheelTimer: ReturnType<typeof setTimeout> | null = null
  let hasWheelJustStarted = false

  // --- gesture state (iOS Safari) ---
  let gestureZoomStart = 0
  let gestureRotationStart = 0

  // --- helpers ---

  function getMousePoint(e: MouseEvent | Touch): Point {
    return { x: e.clientX, y: e.clientY }
  }

  function getPointOnContainer(point: Point): Point {
    const rect = getContainerRect()
    if (!rect) throw new Error('The Cropper is not mounted')
    const containerPos = getContainerPosition()
    return {
      x: rect.width / 2 - (point.x - containerPos.x),
      y: rect.height / 2 - (point.y - containerPos.y),
    }
  }

  function getPointOnMedia(point: Point): Point {
    return {
      x: (point.x + getCrop().x) / zoom.value,
      y: (point.y + getCrop().y) / zoom.value,
    }
  }

  function setNewZoom(
    newZoom: number,
    point: Point,
    shouldUpdatePosition = true
  ) {
    const cs = cropSize.value
    if (!cs) return

    const clampedZoom = clamp(newZoom, minZoom.value, maxZoom.value)

    if (shouldUpdatePosition) {
      const zoomPoint = getPointOnContainer(point)
      const zoomTarget = getPointOnMedia(zoomPoint)
      const requestedPosition = {
        x: zoomTarget.x * clampedZoom - zoomPoint.x,
        y: zoomTarget.y * clampedZoom - zoomPoint.y,
      }

      const newPosition = restrictPositionRef.value
        ? restrictPosition(
            requestedPosition,
            mediaSize.value,
            cs,
            clampedZoom,
            rotation.value
          )
        : requestedPosition

      onCropChange(newPosition)
    }
    onZoomChange(clampedZoom)
  }

  // --- drag ---

  function onDragStart(point: Point, source: CropperInteractionSource) {
    dragStartPosition.x = point.x
    dragStartPosition.y = point.y
    dragStartCrop.x = getCrop().x
    dragStartCrop.y = getCrop().y
    dragInteractionSource = source
    onInteractionStart(source)
  }

  function onDrag(point: Point) {
    if (rafDragTimeout) cancelAnimationFrame(rafDragTimeout)

    rafDragTimeout = requestAnimationFrame(() => {
      const cs = cropSize.value
      if (!cs) return

      const offsetX = point.x - dragStartPosition.x
      const offsetY = point.y - dragStartPosition.y
      const requestedPosition = {
        x: dragStartCrop.x + offsetX,
        y: dragStartCrop.y + offsetY,
      }

      const newPosition = restrictPositionRef.value
        ? restrictPosition(
            requestedPosition,
            mediaSize.value,
            cs,
            zoom.value,
            rotation.value
          )
        : requestedPosition

      onCropChange(newPosition)
    })
  }

  function onDragStopped() {
    if (rafDragTimeout) {
      cancelAnimationFrame(rafDragTimeout)
      rafDragTimeout = null
    }
    isTouching = false
    cleanupDocumentEvents()
    onEmitCropData()
    if (dragInteractionSource) {
      onInteractionEnd(dragInteractionSource)
      dragInteractionSource = null
    }
  }

  // --- mouse ---

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onDragStopped)
    onDragStart(getMousePoint(e), 'mouse')
  }

  function onMouseMove(e: MouseEvent) {
    onDrag(getMousePoint(e))
  }

  // --- touch ---

  function handleTouchStart(e: TouchEvent) {
    isTouching = true
    if (onTouchRequest && !onTouchRequest(e)) return

    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onDragStopped)

    if (e.touches.length === 2) {
      onPinchStart(e)
    } else if (e.touches.length === 1) {
      onDragStart(getMousePoint(e.touches[0]), 'touch')
    }
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault()
    if (e.touches.length === 2) {
      onPinchMove(e)
    } else if (e.touches.length === 1) {
      onDrag(getMousePoint(e.touches[0]))
    }
  }

  // --- pinch ---

  function onPinchStart(e: TouchEvent) {
    const pointA = getMousePoint(e.touches[0])
    const pointB = getMousePoint(e.touches[1])
    lastPinchDistance = getDistanceBetweenPoints(pointA, pointB)
    lastPinchRotation = getRotationBetweenPoints(pointA, pointB)
    onDragStart(getCenter(pointA, pointB), 'touch')
  }

  function onPinchMove(e: TouchEvent) {
    const pointA = getMousePoint(e.touches[0])
    const pointB = getMousePoint(e.touches[1])
    const center = getCenter(pointA, pointB)
    onDrag(center)

    if (rafPinchTimeout) cancelAnimationFrame(rafPinchTimeout)
    rafPinchTimeout = requestAnimationFrame(() => {
      const distance = getDistanceBetweenPoints(pointA, pointB)
      const newZoom = zoom.value * (distance / lastPinchDistance)
      setNewZoom(newZoom, center, false)
      lastPinchDistance = distance

      const rot = getRotationBetweenPoints(pointA, pointB)
      const newRotation = rotation.value + (rot - lastPinchRotation)
      onRotationChange(newRotation)
      lastPinchRotation = rot
    })
  }

  // --- wheel ---

  function handleWheel(e: WheelEvent) {
    if (onWheelRequest && !onWheelRequest(e)) return

    e.preventDefault()
    const point = getMousePoint(e)
    const { pixelY } = normalizeWheel(e)
    const newZoom = zoom.value - (pixelY * zoomSpeed.value) / 200
    setNewZoom(newZoom, point, true)

    if (!hasWheelJustStarted) {
      hasWheelJustStarted = true
      onInteractionStart('wheel')
    }

    if (wheelTimer) clearTimeout(wheelTimer)
    wheelTimer = setTimeout(() => {
      hasWheelJustStarted = false
      onInteractionEnd('wheel')
    }, 250)
  }

  function setupWheelListener(container: HTMLElement) {
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (wheelTimer) clearTimeout(wheelTimer)
    }
  }

  // --- gesture (iOS Safari) ---

  function handleGestureStart(e: Event) {
    e.preventDefault()
    document.addEventListener('gesturechange', onGestureChange)
    document.addEventListener('gestureend', onGestureEnd)
    gestureZoomStart = zoom.value
    gestureRotationStart = rotation.value
  }

  function onGestureChange(e: Event) {
    const ge = e as unknown as {
      rotation: number
      scale: number
      clientX: number
      clientY: number
      preventDefault: () => void
    }
    e.preventDefault()
    if (isTouching) return // avoid conflict with touch events

    const point = getMousePoint(ge as unknown as MouseEvent)
    const newZoom = gestureZoomStart - 1 + ge.scale
    setNewZoom(newZoom, point, true)
    const newRotation = gestureRotationStart + ge.rotation
    onRotationChange(newRotation)
  }

  function onGestureEnd(_e: Event) {
    cleanupDocumentEvents()
  }

  function setupGestureListener(container: HTMLElement) {
    container.addEventListener('gesturestart', handleGestureStart)
    return () => {
      container.removeEventListener('gesturestart', handleGestureStart)
    }
  }

  // --- keyboard ---

  function handleKeyDown(e: KeyboardEvent) {
    const cs = cropSize.value
    if (!cs) return

    let step = keyboardStep.value
    if (e.shiftKey) step *= 0.2

    let newCrop = { ...getCrop() }

    switch (e.key) {
      case 'ArrowUp':
        newCrop.y -= step
        e.preventDefault()
        break
      case 'ArrowDown':
        newCrop.y += step
        e.preventDefault()
        break
      case 'ArrowLeft':
        newCrop.x -= step
        e.preventDefault()
        break
      case 'ArrowRight':
        newCrop.x += step
        e.preventDefault()
        break
      default:
        return
    }

    if (restrictPositionRef.value) {
      newCrop = restrictPosition(
        newCrop,
        mediaSize.value,
        cs,
        zoom.value,
        rotation.value
      )
    }

    if (!e.repeat) {
      onInteractionStart('keyboard')
    }

    onCropChange(newCrop)
  }

  function handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault()
        break
      default:
        return
    }
    onEmitCropData()
    onInteractionEnd('keyboard')
  }

  // --- scroll ---

  function handleScroll(e: Event) {
    e.preventDefault()
    onScrollCb?.()
  }

  function setupScrollListener(doc: Document) {
    doc.addEventListener('scroll', handleScroll, { passive: true })
    return () => doc.removeEventListener('scroll', handleScroll)
  }

  // --- cleanup ---

  function cleanupDocumentEvents() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onDragStopped)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onDragStopped)
    document.removeEventListener('gesturechange', onGestureChange)
    document.removeEventListener('gestureend', onGestureEnd)
  }

  function cleanup() {
    cleanupDocumentEvents()
    if (rafDragTimeout) {
      cancelAnimationFrame(rafDragTimeout)
      rafDragTimeout = null
    }
    if (rafPinchTimeout) {
      cancelAnimationFrame(rafPinchTimeout)
      rafPinchTimeout = null
    }
    if (wheelTimer) {
      clearTimeout(wheelTimer)
      wheelTimer = null
    }
  }

  return {
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    handleKeyUp,
    setupWheelListener,
    setupGestureListener,
    setupScrollListener,
    cleanup,
    // expose for useCropper
    saveContainerPosFromInteraction: () => {}, // handled by useMediaSize
  }
}
