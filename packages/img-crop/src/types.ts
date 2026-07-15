import type { Area } from '@antdv-next/vue-easy-crop'

import { Upload } from 'antdv-next'

/** The beforeUpload function from antdv-next Upload */
export type BeforeUpload = (
  file: File & { uid?: string },
  fileList: (File & { uid?: string })[]
) => boolean | Promise<File | boolean | typeof Upload.LIST_IGNORE>

export type BeforeUploadReturnType = ReturnType<BeforeUpload>

/** Props for ImgCrop wrapper component */
export interface ImgCropProps {
  /** Image quality of the cropped result (0–1), default 0.4 */
  quality?: number
  /** Fill color for the canvas background, default 'white' */
  fillColor?: string

  /** Show zoom slider, default true */
  zoomSlider?: boolean
  /** Show rotation slider, default false */
  rotationSlider?: boolean
  /** Show aspect ratio slider, default false */
  aspectSlider?: boolean
  /** Show reset button, default false */
  showReset?: boolean
  /** Reset button text */
  resetText?: string

  /** Initial aspect ratio, default 1 (1:1) */
  aspect?: number
  /** Minimum zoom, default 1 */
  minZoom?: number
  /** Maximum zoom, default 3 */
  maxZoom?: number
  /** Minimum aspect ratio for slider, default 0.5 */
  minAspect?: number
  /** Maximum aspect ratio for slider, default 2 */
  maxAspect?: number
  /** Crop shape: 'rect' or 'round', default 'rect' */
  cropShape?: 'rect' | 'round'
  /** Show grid lines on crop area, default false */
  showGrid?: boolean
  /** Additional props passed through to vue-easy-crop Cropper */
  cropperProps?: Record<string, unknown>

  /** Additional class name for modal wrapper */
  modalClassName?: string
  /** Modal title, auto-detects CN/EN if not provided */
  modalTitle?: string
  /** Modal width */
  modalWidth?: number | string
  /** OK button text for modal */
  modalOk?: string
  /** Cancel button text for modal */
  modalCancel?: string
  /** Called after modal OK, receives the result of beforeUpload */
  onModalOk?: (value: BeforeUploadReturnType) => void
  /** Called after modal cancel, receives a resolve function */
  onModalCancel?: (resolve: (value: BeforeUploadReturnType) => void) => void
  /** Additional props passed through to antdv-next Modal */
  modalProps?: Record<string, unknown>

  /** Hook before cropping, return false to skip cropping */
  beforeCrop?: BeforeUpload
}

export interface ImgCropEmits {
  (e: 'modal-ok', value: BeforeUploadReturnType): void
  (e: 'modal-cancel'): void
}

export interface EasyCropRef {
  rotation: number
  cropPixelsRef: { value: Area }
  onReset: () => void
}

export interface EasyCropProps {
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
}
