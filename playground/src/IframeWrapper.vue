<script setup lang="ts">
import { ref, onMounted } from 'vue'

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeBody = ref<HTMLElement | null>(null)

onMounted(() => {
  const iframe = iframeRef.value
  if (!iframe) return

  const checkReady = () => {
    const doc = iframe.contentDocument
    if (!doc || (doc.readyState !== 'interactive' && doc.readyState !== 'complete')) {
      return
    }
    iframeBody.value = doc.body
  }

  iframe.addEventListener('load', checkReady)
  // Also check immediately in case the iframe is already loaded
  checkReady()
})
</script>

<template>
  <iframe
    ref="iframeRef"
    srcdoc="<!doctype html>"
    title="test iframed"
    style="height: 100vh; width: 100vw"
    data-testid="cropper-iframe"
  >
    <Teleport v-if="iframeBody" :to="iframeBody">
      <slot />
    </Teleport>
  </iframe>
</template>
