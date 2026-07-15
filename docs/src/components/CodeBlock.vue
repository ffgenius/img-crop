<script setup lang="ts">
import hljs from 'highlight.js'
import { computed } from 'vue'

const props = defineProps<{
  code: string
  language?: string
}>()

const html = computed(() => {
  const lang = props.language || 'xml'
  if (hljs.getLanguage(lang)) {
    const result = hljs.highlight(props.code, { language: lang })
    return result.value
  }
  // Auto-detect
  const result = hljs.highlightAuto(props.code)
  return result.value
})
</script>

<template>
  <div class="code-block">
    <pre><code class="hljs" v-html="html" /></pre>
  </div>
</template>

<style scoped>
.code-block {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 14px 18px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
}

.code-block :deep(.hljs) {
  color: #ccc;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.85em;
  background: transparent;
}
</style>
