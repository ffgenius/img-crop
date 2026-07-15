<script lang="ts">
import { Upload, Modal } from 'antdv-next'
import {
  defineComponent,
  h,
  cloneVNode,
  ref,
  computed,
  type ComponentPublicInstance,
} from 'vue'

import { PREFIX, ROTATION_INITIAL } from './constants'
import ImgCropModal from './ImgCropModal.vue'

// Minimal type for what ImgCropModal exposes
interface EasyCropExposed {
  rotation: number
  cropPixelsRef: { width: number; height: number; x: number; y: number }
  onReset: () => void
}

export default defineComponent({
  name: 'ImgCrop',
  props: {
    quality: { type: Number, default: 0.4 },
    fillColor: { type: String, default: 'white' },
    zoomSlider: { type: Boolean, default: true },
    rotationSlider: { type: Boolean, default: false },
    aspectSlider: { type: Boolean, default: false },
    showReset: { type: Boolean, default: false },
    resetText: { type: String, default: undefined },
    aspect: { type: Number, default: 1 },
    minZoom: { type: Number, default: 1 },
    maxZoom: { type: Number, default: 3 },
    minAspect: { type: Number, default: 0.5 },
    maxAspect: { type: Number, default: 2 },
    cropShape: { type: String as () => 'rect' | 'round', default: 'rect' },
    showGrid: { type: Boolean, default: false },
    cropperProps: { type: Object, default: undefined },
    modalClassName: { type: String, default: undefined },
    modalTitle: { type: String, default: undefined },
    modalWidth: { type: [String, Number], default: undefined },
    modalOk: { type: String, default: undefined },
    modalCancel: { type: String, default: undefined },
    onModalOk: { type: Function, default: undefined },
    onModalCancel: { type: Function, default: undefined },
    modalProps: { type: Object, default: undefined },
    beforeCrop: { type: Function, default: undefined },
  },
  setup(props, { slots }) {
    // Stable callback refs (avoids stale closures in beforeUpload)
    const callbacks = {
      get onModalOk() {
        return props.onModalOk
      },
      get onModalCancel() {
        return props.onModalCancel
      },
      get beforeCrop() {
        return props.beforeCrop
      },
    }

    // ImgCropModal instance ref
    let easyCropInstance: (ComponentPublicInstance & EasyCropExposed) | null =
      null

    // Track rotation separately (for canvas logic)
    const modalRotation = ref(ROTATION_INITIAL)

    // Modal state
    const modalOpen = ref(false)
    const modalImage = ref('')
    const cropperVisible = ref(false)
    let pendingModalImage = ''

    // Pending promise state
    let pendingResolve: ((value: unknown) => void) | null = null
    let pendingReject: ((reason?: unknown) => void) | null = null
    let pendingFile: (File & { uid?: string }) | null = null
    let resolvedBeforeUpload:
      | ((
          file: File & { uid?: string },
          fileList: (File & { uid?: string })[]
        ) => unknown)
      | undefined

    // --- Helpers ---

    function runBeforeUpload(
      fn: typeof resolvedBeforeUpload,
      file: File & { uid?: string }
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        if (typeof fn !== 'function') {
          resolve(file)
          return
        }
        try {
          const r = fn(file, [file])
          if (r === false) resolve(false)
          else if (r instanceof Promise) r.then(resolve).catch(reject)
          else resolve(r === true ? file : r || file)
        } catch (err) {
          reject(err)
        }
      })
    }

    function getCropCanvas(): HTMLCanvasElement {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = document.querySelector(
        `.${PREFIX}-media`
      ) as HTMLImageElement | null
      if (!img) return canvas

      const px = easyCropInstance?.cropPixelsRef
      if (!px) return canvas

      const { width: cw, height: ch, x: cx, y: cy } = px

      if (props.rotationSlider && modalRotation.value !== ROTATION_INITIAL) {
        const { naturalWidth: iw, naturalHeight: ih } = img
        const angle = modalRotation.value * (Math.PI / 180)
        const s = Math.abs(Math.sin(angle))
        const c = Math.abs(Math.cos(angle))
        const sw = iw * c + ih * s
        const sh = ih * c + iw * s

        canvas.width = sw
        canvas.height = sh
        ctx.fillStyle = props.fillColor
        ctx.fillRect(0, 0, sw, sh)
        const shw = sw / 2
        const shh = sh / 2
        ctx.translate(shw, shh)
        ctx.rotate(angle)
        ctx.translate(-shw, -shh)
        const ix = (sw - iw) / 2
        const iy = (sh - ih) / 2
        ctx.drawImage(img, 0, 0, iw, ih, ix, iy, iw, ih)
        const data = ctx.getImageData(0, 0, sw, sh)
        canvas.width = cw
        canvas.height = ch
        ctx.putImageData(data, -cx, -cy)
      } else {
        canvas.width = cw
        canvas.height = ch
        ctx.fillStyle = props.fillColor
        ctx.fillRect(0, 0, cw, ch)
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch)
      }
      return canvas
    }

    // --- Modal handlers ---

    function onModalCancel() {
      modalOpen.value = false

      let resolved = false
      callbacks.onModalCancel?.(((v: unknown) => {
        pendingResolve?.(v)
        resolved = true
      }) as (value: unknown) => void)
      if (!resolved) pendingResolve?.(Upload.LIST_IGNORE)

      pendingResolve = null
      pendingReject = null
      pendingFile = null
    }

    async function onModalOk() {
      const file = pendingFile
      if (!file) {
        modalOpen.value = false
        return
      }

      const canvas = getCropCanvas()
      modalOpen.value = false
      const { type, name, uid } = file
      const blob = await new Promise<Blob | null>((r) =>
        canvas.toBlob(r, type, props.quality)
      )
      if (!blob) {
        pendingReject?.(new Error('Failed to create blob'))
        return
      }

      const newFile = new File([blob], name, { type })
      Object.assign(newFile, { uid })

      try {
        const result = await runBeforeUpload(
          resolvedBeforeUpload,
          newFile as File & { uid?: string }
        )
        pendingResolve?.(result)
        callbacks.onModalOk?.(result)
      } catch (err) {
        pendingReject?.(err)
        callbacks.onModalOk?.(err)
      }
      pendingResolve = null
      pendingReject = null
      pendingFile = null
    }

    function onModalAfterOpenChange(open: boolean) {
      if (open) {
        modalImage.value = pendingModalImage
      } else {
        easyCropInstance?.onReset()
        modalRotation.value = ROTATION_INITIAL
        modalImage.value = ''
        pendingModalImage = ''
        cropperVisible.value = false
      }

      const afterOpenChange = (
        props.modalProps as
          | { afterOpenChange?: (open: boolean) => void }
          | undefined
      )?.afterOpenChange
      afterOpenChange?.(open)
    }

    // --- Wrapped beforeUpload ---

    // Cache the wrapper keyed by the user's beforeUpload reference
    const wrapperCache = new Map<Function | undefined, Function>()

    function getWrappedBeforeUpload(
      userFn:
        | ((
            file: File & { uid?: string },
            fileList: (File & { uid?: string })[]
          ) => unknown)
        | undefined
    ) {
      const cached = wrapperCache.get(userFn)
      if (cached) return cached

      const wrapped = (
        file: File & { uid?: string },
        fileList: (File & { uid?: string })[]
      ) => {
        return new Promise((resolve, reject) => {
          pendingResolve = resolve
          pendingReject = reject
          pendingFile = file
          resolvedBeforeUpload = userFn

          let proc = file

          void (async () => {
            if (typeof callbacks.beforeCrop === 'function') {
              try {
                const r = await callbacks.beforeCrop(file, fileList as File[])
                if (r === false) {
                  const res = await runBeforeUpload(userFn, file)
                  return resolve(res)
                }
                if (r !== true && r !== undefined)
                  proc = (r as File & { uid?: string }) || file
              } catch {
                const res = await runBeforeUpload(userFn, file)
                return resolve(res)
              }
            }

            const reader = new FileReader()
            reader.addEventListener('load', () => {
              if (typeof reader.result === 'string') {
                pendingModalImage = reader.result
                cropperVisible.value = true
                modalOpen.value = true
              }
            })
            reader.readAsDataURL(proc as unknown as Blob)
          })()
        })
      }

      wrapperCache.set(userFn, wrapped)
      return wrapped
    }

    // --- Computed ---

    const wrapClassName = computed(
      () =>
        `${PREFIX}-modal${props.modalClassName ? ` ${props.modalClassName}` : ''}`
    )
    const modalTitleLabel = computed(() => {
      if (props.modalTitle) return props.modalTitle
      const lang = typeof window === 'undefined' ? '' : navigator.language
      return lang === 'zh-CN' ? '编辑图片' : 'Edit image'
    })
    const resetBtnLabel = computed(() => {
      if (props.resetText) return props.resetText
      const lang = typeof window === 'undefined' ? '' : navigator.language
      return lang === 'zh-CN' ? '重置' : 'Reset'
    })
    const modalExtra = computed(() => {
      const o: Record<string, unknown> = {}
      if (props.modalWidth !== undefined) o.width = props.modalWidth
      if (props.modalOk !== undefined) o.okText = props.modalOk
      if (props.modalCancel !== undefined) o.cancelText = props.modalCancel
      return o
    })

    // --- Ref callback for ImgCropModal ---

    function easyCropRefHandler(el: unknown) {
      easyCropInstance = el as
        | (ComponentPublicInstance & EasyCropExposed)
        | null
    }

    // --- Render ---

    return () => {
      const vnodes = slots.default?.()
      const uploadVNode = vnodes?.[0]
      if (!uploadVNode) return null

      const uploadProps = (uploadVNode.props || {}) as Record<string, unknown>
      const userBeforeUpload = uploadProps.beforeUpload as
        | ((
            file: File & { uid?: string },
            fileList: (File & { uid?: string })[]
          ) => unknown)
        | undefined

      const cloned = cloneVNode(uploadVNode, {
        accept: uploadProps.accept || 'image/*',
        beforeUpload: getWrappedBeforeUpload(userBeforeUpload),
      })

      const cropper = cropperVisible.value
        ? h(ImgCropModal, {
            ref: easyCropRefHandler,
            modalImage: modalImage.value,
            zoomSlider: props.zoomSlider,
            rotationSlider: props.rotationSlider,
            aspectSlider: props.aspectSlider,
            showReset: props.showReset,
            resetBtnText: resetBtnLabel.value,
            aspect: props.aspect,
            minZoom: props.minZoom,
            maxZoom: props.maxZoom,
            minAspect: props.minAspect,
            maxAspect: props.maxAspect,
            cropShape: props.cropShape,
            showGrid: props.showGrid,
            cropperProps: props.cropperProps,
            'onUpdate:rotation': (v: number) => {
              modalRotation.value = v
            },
          })
        : null

      const modal = h(
        Modal,
        {
          ...(props.modalProps as Record<string, unknown> | undefined),
          ...modalExtra.value,
          open: modalOpen.value,
          title: modalTitleLabel.value,
          wrapClassName: wrapClassName.value,
          destroyOnHidden: false,
          mask: { closable: false },
          onOk: onModalOk,
          onCancel: onModalCancel,
          afterOpenChange: onModalAfterOpenChange,
          'onUpdate:open': (v: boolean) => {
            modalOpen.value = v
          },
        },
        { default: () => cropper }
      )

      return [cloned, modal]
    }
  },
})
</script>
