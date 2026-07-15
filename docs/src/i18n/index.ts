import { ref } from 'vue'

export type Locale = 'zh-CN' | 'en-US'

const locale = ref<Locale>(
  typeof navigator !== 'undefined' && navigator.language.startsWith('en')
    ? 'en-US'
    : 'zh-CN'
)

const messages: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    // Nav
    'nav.logo': '🖼️ img-crop',
    'nav.group.cropper': 'vue-easy-crop',
    'nav.group.imgCrop': 'antdv-next-img-crop',
    'nav.cropper.demo': '演示',
    'nav.cropper.demo.desc': '交互式裁剪器演示',
    'nav.cropper.api': 'API',
    'nav.cropper.api.desc': 'Props / Events / 类型',
    'nav.imgCrop.demo': '演示',
    'nav.imgCrop.demo.desc': 'Upload 裁剪演示',
    'nav.imgCrop.api': 'API',
    'nav.imgCrop.api.desc': 'Props / Events / 类型',

    // API Table
    'api.table.propName': '属性名',
    'api.table.eventName': '事件名',
    'api.table.type': '类型',
    'api.table.default': '默认值',
    'api.table.desc': '说明',
    'api.table.slotName': '插槽名',

    // Cropper API
    'cropper.title': 'Cropper API',
    'cropper.intro':
      '<code>Cropper</code> 是 <strong>@antdv-next/vue-easy-crop</strong> 的唯一组件，提供可交互的图像/视频裁剪功能。它没有 UI 框架依赖，可独立使用。',
    'cropper.props': 'Props',
    'cropper.events': 'Events',
    'cropper.types': '类型定义',
    'cropper.utils': '工具函数',
    'cropper.expose': 'Expose',

    'cropper.prop.image': '要裁剪的图片 URL',
    'cropper.prop.video':
      '要裁剪的视频 URL 或视频源数组。设置后 image 将被忽略',
    'cropper.prop.crop': '裁剪位置 (x, y)，必填，支持 v-model',
    'cropper.prop.zoom': '缩放级别（1 = 原始大小）',
    'cropper.prop.rotation': '旋转角度（度），范围 -180 ~ 180',
    'cropper.prop.aspect': '裁剪框的宽高比。例如 1（正方形）、4/3、16/9',
    'cropper.prop.minZoom': '最小缩放级别',
    'cropper.prop.maxZoom': '最大缩放级别',
    'cropper.prop.cropShape': '裁剪区域形状',
    'cropper.prop.cropSize': '裁剪区域固定像素大小',
    'cropper.prop.objectFit':
      '媒体在容器内的适配模式。horizontal-cover / vertical-cover 允许一个方向溢出',
    'cropper.prop.showGrid': '是否在裁剪区域上显示九宫格参考线',
    'cropper.prop.zoomSpeed': '缩放速度乘数',
    'cropper.prop.zoomWithScroll': '是否允许鼠标滚轮缩放',
    'cropper.prop.roundCropAreaPixels': '是否对 crop-complete 返回的像素值取整',
    'cropper.prop.restrictPosition': '是否限制裁剪区域始终在媒体范围内',
    'cropper.prop.mediaProps': '传递给原生 <img> 或 <video> 元素的额外属性',
    'cropper.prop.disableAutomaticStylesInjection':
      '禁用自动 CSS 注入，用于 SSR 场景',
    'cropper.prop.initialCroppedAreaPixels':
      '初始裁剪区域（像素坐标），用于恢复上次的裁剪状态',
    'cropper.prop.initialCroppedAreaPercentages':
      '初始裁剪区域（百分比坐标），用于恢复上次的裁剪状态',
    'cropper.prop.nonce': '注入的 <style> 元素的 nonce 属性值（CSP 安全策略）',
    'cropper.prop.keyboardStep': '键盘方向键每次移动的像素步长',
    'cropper.prop.onTouchRequest': '触摸事件过滤器。返回 false 可阻止触摸交互',
    'cropper.prop.onWheelRequest': '滚轮事件过滤器。返回 false 可阻止滚轮缩放',
    'cropper.prop.transform':
      '自定义 CSS transform 字符串，会与本组件的 transform 合并',
    'cropper.prop.containerStyle': '裁剪容器内联样式',
    'cropper.prop.mediaStyle': '媒体元素（img/video）内联样式',
    'cropper.prop.cropAreaStyle': '裁剪区域覆盖层内联样式',
    'cropper.prop.containerClass': '裁剪容器的额外 CSS class',
    'cropper.prop.mediaClass': '媒体元素的额外 CSS class',
    'cropper.prop.cropAreaClass': '裁剪区域覆盖层的额外 CSS class',

    'cropper.event.update:crop': '裁剪位置改变时触发，用于 v-model:crop',
    'cropper.event.update:zoom': '缩放级别改变时触发，用于 v-model:zoom',
    'cropper.event.update:rotation':
      '旋转角度改变时触发，用于 v-model:rotation',
    'cropper.event.crop-complete':
      '用户停止拖拽/缩放后触发。返回百分比区域和像素区域两个坐标',
    'cropper.event.crop-area-change':
      '裁剪区域实时变化时触发（拖拽过程中持续触发）',
    'cropper.event.crop-size-change': '裁剪区域尺寸改变时触发',
    'cropper.event.interaction-start':
      '用户开始交互时触发（鼠标按下/触摸开始/滚轮/键盘）',
    'cropper.event.interaction-end': '用户结束交互时触发',
    'cropper.event.media-loaded':
      '图片或视频加载完成后触发，携带媒体实际尺寸信息',

    'cropper.type.Point': '二维坐标点',
    'cropper.type.Size': '宽度/高度尺寸',
    'cropper.type.MediaSize':
      '媒体元素尺寸。width/height 为渲染尺寸，natural* 为原始像素尺寸',
    'cropper.type.Area': '裁剪区域，x/y 为左上角坐标',
    'cropper.type.VideoSrc': '视频源描述，type 为 MIME 类型（如 "video/mp4"）',
    'cropper.type.CropperInteraction': '交互事件对象，包含交互来源',
    'cropper.type.CropperInteractionSource': '交互来源类型',

    'cropper.util.getInitialCropFromCroppedAreaPixels':
      '根据上一次裁剪的像素坐标和媒体尺寸，恢复裁剪位置和缩放级别',
    'cropper.util.getInitialCropFromCroppedAreaPercentages':
      '根据上一次裁剪的百分比坐标和媒体尺寸，恢复裁剪位置和缩放级别',

    'cropper.expose.cropperRef': '外层裁剪容器的 DOM 引用',
    'cropper.expose.imageRef': '图片元素的 DOM 引用',
    'cropper.expose.videoRef': '视频元素的 DOM 引用',

    // ImgCrop API
    'imgCrop.title': 'ImgCrop API',
    'imgCrop.intro':
      '<code>ImgCrop</code> 是 <strong>@antdv-next/img-crop</strong> 的唯一组件，它将图像裁剪功能集成到 antdv-next 的 <code>&lt;Upload&gt;</code> 组件中。用户选择图片后自动弹出裁剪 Modal，裁剪完成后将结果传递给 Upload 的 <code>beforeUpload</code> 钩子。',
    'imgCrop.basicUsage': '基础用法',
    'imgCrop.note':
      '⚠️ <strong>注意：</strong>ImgCrop 只支持单个子元素（必须是 Upload 组件），且会自动为 Upload 设置 <code>accept="image/*"</code>。',
    'imgCrop.props': 'Props',
    'imgCrop.events': 'Events',
    'imgCrop.slots': 'Slots',
    'imgCrop.types': '类型定义',

    'imgCrop.prop.quality': '裁剪后图片的输出质量，范围 0–1',
    'imgCrop.prop.fillColor': 'Canvas 背景填充色（处理旋转产生的空白区域）',
    'imgCrop.prop.zoomSlider': '是否在 Modal 中显示缩放滑块',
    'imgCrop.prop.rotationSlider': '是否在 Modal 中显示旋转滑块',
    'imgCrop.prop.aspectSlider': '是否在 Modal 中显示宽高比滑块',
    'imgCrop.prop.showReset': '是否在 Modal 中显示重置按钮',
    'imgCrop.prop.resetText': '重置按钮的文本',
    'imgCrop.prop.aspect': '初始宽高比。1 表示正方形，4/3、16/9 等',
    'imgCrop.prop.minZoom': '最小缩放级别',
    'imgCrop.prop.maxZoom': '最大缩放级别',
    'imgCrop.prop.minAspect': '宽高比滑块的最小值',
    'imgCrop.prop.maxAspect': '宽高比滑块的最大值',
    'imgCrop.prop.cropShape': '裁剪区域形状',
    'imgCrop.prop.showGrid': '是否在裁剪区域上显示网格',
    'imgCrop.prop.cropperProps': '透传给底层 Cropper 组件的额外 props',
    'imgCrop.prop.modalClassName': 'Modal 外层容器的额外 CSS class',
    'imgCrop.prop.modalTitle':
      'Modal 标题。默认会根据浏览器语言自动选择中/英文',
    'imgCrop.prop.modalWidth': 'Modal 宽度',
    'imgCrop.prop.modalOk': 'Modal 确认按钮文本',
    'imgCrop.prop.modalCancel': 'Modal 取消按钮文本',
    'imgCrop.prop.onModalOk':
      'Modal 确认后的回调，参数为 beforeUpload 的返回值',
    'imgCrop.prop.onModalCancel': 'Modal 取消时的回调',
    'imgCrop.prop.modalProps': '透传给 antdv-next Modal 组件的额外 props',
    'imgCrop.prop.beforeCrop':
      '裁剪前钩子。返回 false 可跳过裁剪，直接进入上传流程',

    'imgCrop.event.modal-ok': '用户点击确认裁剪后触发',
    'imgCrop.event.modal-cancel': '用户点击取消裁剪后触发',

    'imgCrop.slot.default':
      '插槽内容，应放入一个 antdv-next <code>&lt;Upload&gt;</code> 组件（仅支持单个子元素）',

    'imgCrop.type.BeforeUpload': 'antdv-next Upload 的 beforeUpload 函数类型',
    'imgCrop.type.BeforeUploadReturnType': 'beforeUpload 返回类型的快捷引用',
    'imgCrop.type.ImgCropProps': 'ImgCrop 组件的完整 props 类型，详见上表',
    'imgCrop.type.ImgCropEmits': 'ImgCrop 组件的 emits 类型',
    'imgCrop.type.EasyCropRef': '内部 Modal 组件暴露的方法和状态引用',
    'imgCrop.type.EasyCropProps': '传递给内部 Modal 组件的 props 类型',

    // Cropper Demo
    'demo.cropper.title': '参数控制',
    'demo.cropper.zoom': '缩放',
    'demo.cropper.rotation': '旋转',
    'demo.cropper.aspect': '宽高比',
    'demo.cropper.cropShape': '裁剪形状',
    'demo.cropper.shape.rect': '矩形',
    'demo.cropper.shape.round': '圆形',
    'demo.cropper.image': '图片',
    'demo.cropper.center': 'Center Horizontally',
    'demo.cropper.reset': '重置所有参数',
    'demo.cropper.cropData': '裁剪数据',
    'demo.cropper.percentageArea': '百分比区域',
    'demo.cropper.pixelArea': '像素区域',
    'demo.cropper.width': '宽度',
    'demo.cropper.height': '高度',
    'demo.cropper.tips': '操作提示',
    'demo.cropper.tip.drag': '🖱️ 拖拽图片移动裁剪区域',
    'demo.cropper.tip.zoom': '🔄 滚轮缩放图片',
    'demo.cropper.tip.pinch': '📱 双指捏合缩放 / 旋转',
    'demo.cropper.tip.keyboard': '⌨️ 方向键微调位置',
    'demo.cropper.aspect4:3': '4:3（横向）',
    'demo.cropper.aspect1:1': '1:1（正方形）',
    'demo.cropper.aspect3:4': '3:4（纵向）',
    'demo.cropper.aspect16:9': '16:9（宽屏）',

    // ImgCrop Demo
    'demo.imgCrop.title': 'antdv-next-img-crop 演示',
    'demo.imgCrop.upload': '上传图片',
    'demo.imgCrop.uploadBtn': '选择图片并裁剪',
    'demo.imgCrop.quality': '输出质量',
    'demo.imgCrop.aspect': '裁剪比例',
    'demo.imgCrop.cropShape': '裁剪形状',
    'demo.imgCrop.shape.rect': '矩形',
    'demo.imgCrop.shape.round': '圆形',
    'demo.imgCrop.toggles': '功能开关',
    'demo.imgCrop.toggle.zoom': '缩放滑块',
    'demo.imgCrop.toggle.rotation': '旋转滑块',
    'demo.imgCrop.toggle.aspect': '宽高比滑块',
    'demo.imgCrop.toggle.grid': '显示网格',
    'demo.imgCrop.toggle.reset': '显示重置按钮',
    'demo.imgCrop.preview': '裁剪结果预览',
    'demo.imgCrop.eventLog': '事件日志',
    'demo.imgCrop.waiting': '等待操作...',
    'demo.imgCrop.aspectOpt.free': '自由比例',
    'demo.imgCrop.aspectOpt.1:1': '1:1 (正方形)',
    'demo.imgCrop.aspectOpt.16:9': '16:9 (宽屏)',
    'demo.imgCrop.aspectOpt.3:4': '3:4 (纵向)',
    'demo.imgCrop.cancelLog': 'modal-cancel: 用户取消了裁剪',
  },

  'en-US': {
    // Nav
    'nav.logo': '🖼️ img-crop',
    'nav.group.cropper': 'vue-easy-crop',
    'nav.group.imgCrop': 'antdv-next-img-crop',
    'nav.cropper.demo': 'Demo',
    'nav.cropper.demo.desc': 'Interactive cropper demo',
    'nav.cropper.api': 'API',
    'nav.cropper.api.desc': 'Props / Events / Types',
    'nav.imgCrop.demo': 'Demo',
    'nav.imgCrop.demo.desc': 'Upload crop demo',
    'nav.imgCrop.api': 'API',
    'nav.imgCrop.api.desc': 'Props / Events / Types',

    // API Table
    'api.table.propName': 'Property',
    'api.table.eventName': 'Event',
    'api.table.type': 'Type',
    'api.table.default': 'Default',
    'api.table.desc': 'Description',
    'api.table.slotName': 'Slot',

    // Cropper API
    'cropper.title': 'Cropper API',
    'cropper.intro':
      '<code>Cropper</code> is the main component of <strong>@antdv-next/vue-easy-crop</strong>, providing interactive image/video cropping. It has no UI framework dependency and can be used standalone.',
    'cropper.props': 'Props',
    'cropper.events': 'Events',
    'cropper.types': 'Type Definitions',
    'cropper.utils': 'Utility Functions',
    'cropper.expose': 'Expose',

    'cropper.prop.image': 'Image URL to crop',
    'cropper.prop.video':
      'Video URL or array of video sources. When set, image is ignored',
    'cropper.prop.crop': 'Crop position (x, y). Required, supports v-model',
    'cropper.prop.zoom': 'Zoom level (1 = original size)',
    'cropper.prop.rotation': 'Rotation angle in degrees, range -180 ~ 180',
    'cropper.prop.aspect':
      'Aspect ratio of the crop area. e.g. 1 (square), 4/3, 16/9',
    'cropper.prop.minZoom': 'Minimum zoom level',
    'cropper.prop.maxZoom': 'Maximum zoom level',
    'cropper.prop.cropShape': 'Crop area shape',
    'cropper.prop.cropSize': 'Fixed pixel size of the crop area',
    'cropper.prop.objectFit':
      'How the media fits in the container. horizontal-cover / vertical-cover allow overflow in one direction',
    'cropper.prop.showGrid': 'Show rule-of-thirds grid lines on the crop area',
    'cropper.prop.zoomSpeed': 'Zoom speed multiplier',
    'cropper.prop.zoomWithScroll': 'Allow mouse wheel zooming',
    'cropper.prop.roundCropAreaPixels':
      'Round pixel values returned by crop-complete',
    'cropper.prop.restrictPosition':
      'Keep the crop area within the media bounds',
    'cropper.prop.mediaProps':
      'Extra attributes passed to the native <img> or <video> element',
    'cropper.prop.disableAutomaticStylesInjection':
      'Disable automatic CSS injection, useful for SSR',
    'cropper.prop.initialCroppedAreaPixels':
      'Initial crop area in pixel coordinates, for restoring previous crop state',
    'cropper.prop.initialCroppedAreaPercentages':
      'Initial crop area in percentage coordinates, for restoring previous crop state',
    'cropper.prop.nonce':
      'nonce attribute value for the injected <style> element (CSP)',
    'cropper.prop.keyboardStep': 'Pixel step for keyboard arrow key movement',
    'cropper.prop.onTouchRequest':
      'Touch event filter. Return false to prevent touch interaction',
    'cropper.prop.onWheelRequest':
      'Wheel event filter. Return false to prevent wheel zoom',
    'cropper.prop.transform':
      'Custom CSS transform string, merged with the component transform',
    'cropper.prop.containerStyle': 'Crop container inline styles',
    'cropper.prop.mediaStyle': 'Media element (img/video) inline styles',
    'cropper.prop.cropAreaStyle': 'Crop area overlay inline styles',
    'cropper.prop.containerClass': 'Extra CSS class for the crop container',
    'cropper.prop.mediaClass': 'Extra CSS class for the media element',
    'cropper.prop.cropAreaClass': 'Extra CSS class for the crop area overlay',

    'cropper.event.update:crop':
      'Emitted when crop position changes, for v-model:crop',
    'cropper.event.update:zoom':
      'Emitted when zoom level changes, for v-model:zoom',
    'cropper.event.update:rotation':
      'Emitted when rotation changes, for v-model:rotation',
    'cropper.event.crop-complete':
      'Emitted after user stops dragging/zooming. Returns both percentage and pixel area coordinates',
    'cropper.event.crop-area-change':
      'Emitted continuously while the crop area is being changed (during drag)',
    'cropper.event.crop-size-change': 'Emitted when the crop area size changes',
    'cropper.event.interaction-start':
      'Emitted when user interaction starts (mousedown/touchstart/wheel/keyboard)',
    'cropper.event.interaction-end': 'Emitted when user interaction ends',
    'cropper.event.media-loaded':
      'Emitted after image or video loads, carrying the actual media dimensions',

    'cropper.type.Point': 'A 2D coordinate point',
    'cropper.type.Size': 'Width/height dimensions',
    'cropper.type.MediaSize':
      'Media element size. width/height are rendered size, natural* are original pixel dimensions',
    'cropper.type.Area': 'Crop area, x/y are top-left corner coordinates',
    'cropper.type.VideoSrc':
      'Video source descriptor, type is the MIME type (e.g. "video/mp4")',
    'cropper.type.CropperInteraction':
      'Interaction event object containing the interaction source',
    'cropper.type.CropperInteractionSource': 'Interaction source type',

    'cropper.util.getInitialCropFromCroppedAreaPixels':
      'Restore crop position and zoom from previous pixel-based crop coordinates and media size',
    'cropper.util.getInitialCropFromCroppedAreaPercentages':
      'Restore crop position and zoom from previous percentage-based crop coordinates and media size',

    'cropper.expose.cropperRef': 'DOM reference to the outer crop container',
    'cropper.expose.imageRef': 'DOM reference to the image element',
    'cropper.expose.videoRef': 'DOM reference to the video element',

    // ImgCrop API
    'imgCrop.title': 'ImgCrop API',
    'imgCrop.intro':
      "<code>ImgCrop</code> is the main component of <strong>@antdv-next/img-crop</strong>. It integrates image cropping into antdv-next's <code>&lt;Upload&gt;</code> component. A crop modal opens automatically after file selection; on confirm, the cropped result is passed to Upload's <code>beforeUpload</code> hook.",
    'imgCrop.basicUsage': 'Basic Usage',
    'imgCrop.note':
      '⚠️ <strong>Note:</strong> ImgCrop only accepts a single child element (must be an Upload component), and automatically sets <code>accept="image/*"</code> on the Upload.',
    'imgCrop.props': 'Props',
    'imgCrop.events': 'Events',
    'imgCrop.slots': 'Slots',
    'imgCrop.types': 'Type Definitions',

    'imgCrop.prop.quality': 'Output image quality, range 0–1',
    'imgCrop.prop.fillColor':
      'Canvas background fill color (for empty areas caused by rotation)',
    'imgCrop.prop.zoomSlider': 'Show zoom slider in the modal',
    'imgCrop.prop.rotationSlider': 'Show rotation slider in the modal',
    'imgCrop.prop.aspectSlider': 'Show aspect ratio slider in the modal',
    'imgCrop.prop.showReset': 'Show reset button in the modal',
    'imgCrop.prop.resetText': 'Reset button text',
    'imgCrop.prop.aspect':
      'Initial aspect ratio. 1 for square, 4/3, 16/9, etc.',
    'imgCrop.prop.minZoom': 'Minimum zoom level',
    'imgCrop.prop.maxZoom': 'Maximum zoom level',
    'imgCrop.prop.minAspect': 'Minimum value for the aspect ratio slider',
    'imgCrop.prop.maxAspect': 'Maximum value for the aspect ratio slider',
    'imgCrop.prop.cropShape': 'Crop area shape',
    'imgCrop.prop.showGrid': 'Show grid lines on the crop area',
    'imgCrop.prop.cropperProps':
      'Extra props passed through to the underlying Cropper component',
    'imgCrop.prop.modalClassName': 'Extra CSS class for the modal wrapper',
    'imgCrop.prop.modalTitle':
      'Modal title. Defaults to auto-detect based on browser language',
    'imgCrop.prop.modalWidth': 'Modal width',
    'imgCrop.prop.modalOk': 'Modal OK button text',
    'imgCrop.prop.modalCancel': 'Modal cancel button text',
    'imgCrop.prop.onModalOk':
      'Callback after modal OK, receives the beforeUpload return value',
    'imgCrop.prop.onModalCancel': 'Callback after modal cancel',
    'imgCrop.prop.modalProps': 'Extra props passed through to antdv-next Modal',
    'imgCrop.prop.beforeCrop':
      'Hook before cropping. Return false to skip cropping and proceed to upload',

    'imgCrop.event.modal-ok': 'Emitted when the user confirms the crop',
    'imgCrop.event.modal-cancel': 'Emitted when the user cancels cropping',

    'imgCrop.slot.default':
      'Slot content, should contain an antdv-next <code>&lt;Upload&gt;</code> component (single child only)',

    'imgCrop.type.BeforeUpload':
      'antdv-next Upload beforeUpload function signature',
    'imgCrop.type.BeforeUploadReturnType':
      'Shorthand for the return type of beforeUpload',
    'imgCrop.type.ImgCropProps':
      'Full props type of the ImgCrop component, see Props table above',
    'imgCrop.type.ImgCropEmits': 'Emits type of the ImgCrop component',
    'imgCrop.type.EasyCropRef':
      'Methods and state refs exposed by the inner modal component',
    'imgCrop.type.EasyCropProps':
      'Props type passed to the inner modal component',

    // Cropper Demo
    'demo.cropper.title': 'Controls',
    'demo.cropper.zoom': 'Zoom',
    'demo.cropper.rotation': 'Rotation',
    'demo.cropper.aspect': 'Aspect Ratio',
    'demo.cropper.cropShape': 'Crop Shape',
    'demo.cropper.shape.rect': 'Rect',
    'demo.cropper.shape.round': 'Round',
    'demo.cropper.image': 'Image',
    'demo.cropper.center': 'Center Horizontally',
    'demo.cropper.reset': 'Reset All',
    'demo.cropper.cropData': 'Crop Data',
    'demo.cropper.percentageArea': 'Percentage Area',
    'demo.cropper.pixelArea': 'Pixel Area',
    'demo.cropper.width': 'Width',
    'demo.cropper.height': 'Height',
    'demo.cropper.tips': 'Tips',
    'demo.cropper.tip.drag': '🖱️ Drag image to move crop area',
    'demo.cropper.tip.zoom': '🔄 Scroll wheel to zoom',
    'demo.cropper.tip.pinch': '📱 Pinch to zoom / rotate',
    'demo.cropper.tip.keyboard': '⌨️ Arrow keys to nudge position',
    'demo.cropper.aspect4:3': '4:3 (Landscape)',
    'demo.cropper.aspect1:1': '1:1 (Square)',
    'demo.cropper.aspect3:4': '3:4 (Portrait)',
    'demo.cropper.aspect16:9': '16:9 (Widescreen)',

    // ImgCrop Demo
    'demo.imgCrop.title': 'antdv-next-img-crop Demo',
    'demo.imgCrop.upload': 'Upload Image',
    'demo.imgCrop.uploadBtn': 'Select & Crop',
    'demo.imgCrop.quality': 'Quality',
    'demo.imgCrop.aspect': 'Aspect Ratio',
    'demo.imgCrop.cropShape': 'Crop Shape',
    'demo.imgCrop.shape.rect': 'Rect',
    'demo.imgCrop.shape.round': 'Round',
    'demo.imgCrop.toggles': 'Toggles',
    'demo.imgCrop.toggle.zoom': 'Zoom Slider',
    'demo.imgCrop.toggle.rotation': 'Rotation Slider',
    'demo.imgCrop.toggle.aspect': 'Aspect Slider',
    'demo.imgCrop.toggle.grid': 'Show Grid',
    'demo.imgCrop.toggle.reset': 'Show Reset',
    'demo.imgCrop.preview': 'Crop Preview',
    'demo.imgCrop.eventLog': 'Event Log',
    'demo.imgCrop.waiting': 'Waiting for actions...',
    'demo.imgCrop.aspectOpt.free': 'Free',
    'demo.imgCrop.aspectOpt.1:1': '1:1 (Square)',
    'demo.imgCrop.aspectOpt.16:9': '16:9 (Widescreen)',
    'demo.imgCrop.aspectOpt.3:4': '3:4 (Portrait)',
    'demo.imgCrop.cancelLog': 'modal-cancel: user cancelled cropping',
  },
}

export function useI18n() {
  function t(key: string): string {
    return messages[locale.value][key] ?? key
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  }

  return { locale, t, toggleLocale }
}
