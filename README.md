# img-crop

> Vue 3 image cropping components with interactive preview. 🖼️

A monorepo of Vue 3 image cropping solutions built with **pnpm workspaces** and **Turborepo**.

## 📦 Packages

| Package                                                 | Description                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@antdv-next/vue-easy-crop`](./packages/vue-easy-crop) | Framework-agnostic Vue 3 cropper component for images and videos |
| [`@antdv-next/img-crop`](./packages/img-crop)           | Image cropper integrated with antdv-next Upload component        |

## ✨ Features

- **Cropper Component** — Drag, zoom, rotate, and crop images/videos with mouse, touch, and keyboard
- **Upload Integration** — Drop-in wrapper for antdv-next Upload with built-in crop modal
- **Round & Rectangular** — Support for both circular and rectangular crop shapes
- **Configurable Aspect Ratio** — Lock to fixed ratios or allow free-form cropping
- **TypeScript** — Fully typed with exported type definitions
- **Lightweight** — Minimal dependencies, tree-shakeable

## 🚀 Quick Start

```bash
# vue-easy-crop (standalone cropper)
pnpm add @antdv-next/vue-easy-crop

# img-crop (antdv-next Upload integration)
pnpm add @antdv-next/img-crop antdv-next
```

## 📖 Documentation

Run the docs site locally:

```bash
pnpm install
pnpm --filter docs dev
```

## 🛠️ Scripts

| Command       | Description                    |
| ------------- | ------------------------------ |
| `pnpm dev`    | Start all packages in dev mode |
| `pnpm build`  | Build all packages             |
| `pnpm lint`   | Lint all packages              |
| `pnpm format` | Format all packages            |
| `pnpm test`   | Run tests                      |

## 📄 License

[MIT](./LICENSE)
