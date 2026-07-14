declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.css' {
  const content: string
  export default content
}

declare module '*.css?raw' {
  const content: string
  export default content
}

declare module 'normalize-wheel' {
  const normalizeWheel: (
    event: WheelEvent
  ) => { spinX: number; spinY: number; pixelX: number; pixelY: number }
  export default normalizeWheel
}
