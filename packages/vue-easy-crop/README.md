# @antdv-next/vue-easy-crop

> A Vue 3 component to crop images and videos with easy interactions.

Inspired by [react-easy-crop](https://github.com/ValentinH/react-easy-crop). Works standalone with no UI framework dependency.

## ✨ Features

- 🖱️ **Drag** to move the crop area
- 🔍 **Zoom** via scroll wheel or pinch gesture
- 🔄 **Rotate** via pinch gesture or keyboard
- ⌨️ **Keyboard** arrow keys for precise positioning
- 📱 **Touch** support with multi-touch gestures
- 🟦 **Rectangular** and ⭕ **round** crop shapes
- 📐 **Fixed aspect ratio** or free-form
- 🎬 **Video** cropping support
- 🌐 **SSR** friendly (disable auto CSS injection)

## 📦 Installation

```bash
pnpm add @antdv-next/vue-easy-crop
```

## 🚀 Quick Start

```vue
<script setup>
import Cropper from '@antdv-next/vue-easy-crop'
import { ref } from 'vue'

const crop = ref({ x: 0, y: 0 })
const zoom = ref(1)
</script>

<template>
  <Cropper
    image="/photo.jpg"
    :crop="crop"
    :zoom="zoom"
    @update:crop="crop = $event"
    @update:zoom="zoom = $event"
  />
</template>
```

## 📖 API

See the [docs site](https://github.com/ffgenius/img-crop) or run locally:

```bash
pnpm --filter docs dev
```

## 📄 License

[MIT](../../LICENSE)
