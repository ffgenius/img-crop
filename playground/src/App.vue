<script setup lang="ts">
const navItems = [
  { path: '/', label: 'vue-easy-crop', title: '底层裁剪组件演示' },
  {
    path: '/img-crop',
    label: 'antdv-next-img-crop',
    title: 'Upload 图片裁剪演示',
  },
]
</script>

<template>
  <div class="app-shell">
    <header class="app-nav">
      <span class="app-logo">🖼️ Crop Demo</span>
      <nav class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :title="item.title"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  height: 48px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  z-index: 10;
}

.app-logo {
  font-weight: 700;
  font-size: 1em;
  color: #42b883;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 14px;
  font-size: 0.85em;
  color: #999;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.nav-link:hover {
  color: #ccc;
  background: #2a2a2a;
}

.nav-link.router-link-active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.app-main {
  flex: 1;
  min-height: 0;
}
</style>
