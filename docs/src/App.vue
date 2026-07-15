<script setup lang="ts">
import DocSidebar from './components/DocSidebar.vue'
import { useI18n } from './i18n'

const { locale, t, toggleLocale } = useI18n()
</script>

<template>
  <div class="app-shell">
    <header class="app-nav">
      <span class="app-logo">{{ t('nav.logo') }}</span>
      <span class="app-version">v1.0.0</span>
      <div class="app-nav-spacer" />
      <button
        class="locale-btn"
        :title="locale === 'zh-CN' ? 'Switch to English' : '切换中文'"
        @click="toggleLocale"
      >
        {{ locale === 'zh-CN' ? 'EN' : '中' }}
      </button>
    </header>
    <div class="app-body">
      <DocSidebar />
      <main class="app-main">
        <router-view :key="locale" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 48px;
  background: #141414;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
  z-index: 20;
}

.app-logo {
  font-weight: 700;
  font-size: 1em;
  color: #42b883;
}

.app-version {
  font-size: 0.75em;
  color: #555;
  background: #1e1e1e;
  padding: 1px 6px;
  border-radius: 3px;
}

.app-nav-spacer {
  flex: 1;
}

.locale-btn {
  padding: 4px 10px;
  font-size: 0.78em;
  font-weight: 600;
  color: #888;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.locale-btn:hover {
  color: #42b883;
  border-color: #42b883;
}

.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.app-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
</style>
