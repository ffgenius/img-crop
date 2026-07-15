# @antdv-next/img-crop

> Image cropper for antdv-next Upload component.

Wraps [@antdv-next/vue-easy-crop](https://github.com/ffgenius/img-crop) into an antdv-next `<Upload>` component. Select an image → crop it in a modal → get the cropped file in `beforeUpload`.

## ✨ Features

- 🔌 **Drop-in** — Just wrap your `<Upload>` with `<ImgCrop>`
- 🪟 **Modal crop UI** — Built-in controls for zoom, rotation, and aspect ratio
- 🎚️ **Configurable sliders** — Toggle zoom, rotation, and aspect sliders
- 🔲 **Rect / Round** crop shapes
- 🪝 **beforeCrop hook** — Validate files before cropping
- 📐 **Custom aspect ratio** — Set initial ratio or let users adjust

## 📦 Installation

```bash
pnpm add @antdv-next/img-crop antdv-next
```

## 🚀 Quick Start

```vue
<script setup>
import { ImgCrop } from '@antdv-next/img-crop'
import { Upload, Button } from 'antdv-next'

function handleUpload(file) {
  // file is already cropped!
  console.log(file)
  return false // prevent actual upload in demo
}
</script>

<template>
  <ImgCrop :aspect="1" crop-shape="rect">
    <Upload :before-upload="handleUpload">
      <Button>Upload &amp; Crop</Button>
    </Upload>
  </ImgCrop>
</template>
```

## 📖 API

See the [docs site](https://github.com/ffgenius/img-crop) or run locally:

```bash
pnpm --filter docs dev
```

## 📄 License

[MIT](../../LICENSE)
