<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useI18n } from '../i18n'

const route = useRoute()
const { t } = useI18n()

const menuGroups = [
  {
    labelKey: 'nav.group.cropper',
    children: [
      {
        path: '/cropper/demo',
        labelKey: 'nav.cropper.demo',
        descKey: 'nav.cropper.demo.desc',
      },
      {
        path: '/cropper/api',
        labelKey: 'nav.cropper.api',
        descKey: 'nav.cropper.api.desc',
      },
    ],
  },
  {
    labelKey: 'nav.group.imgCrop',
    children: [
      {
        path: '/img-crop/demo',
        labelKey: 'nav.imgCrop.demo',
        descKey: 'nav.imgCrop.demo.desc',
      },
      {
        path: '/img-crop/api',
        labelKey: 'nav.imgCrop.api',
        descKey: 'nav.imgCrop.api.desc',
      },
    ],
  },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <div v-for="group in menuGroups" :key="group.labelKey" class="nav-group">
        <div class="nav-group-label">
          {{ t(group.labelKey) }}
        </div>
        <div class="nav-group-items">
          <router-link
            v-for="child in group.children"
            :key="child.path"
            :to="child.path"
            class="nav-item"
            :class="{ active: isActive(child.path) }"
            :title="t(child.descKey)"
          >
            <span class="nav-item-label">{{ t(child.labelKey) }}</span>
            <span class="nav-item-desc">{{ t(child.descKey) }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #141414;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-nav {
  padding: 8px;
  flex: 1;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-label {
  padding: 8px 10px 4px;
  font-size: 0.75em;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-group-items {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  padding: 7px 10px 7px 18px;
  color: #999;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.nav-item:hover {
  color: #ccc;
  background: #1e1e1e;
}

.nav-item.active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.08);
}

.nav-item-label {
  font-size: 0.88em;
}

.nav-item-desc {
  font-size: 0.7em;
  color: #555;
  margin-top: 1px;
}

.nav-item.active .nav-item-desc {
  color: rgba(66, 184, 131, 0.6);
}
</style>
