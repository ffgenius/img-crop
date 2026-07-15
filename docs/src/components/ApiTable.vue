<script setup lang="ts">
import { useI18n } from '../i18n'

export interface ApiRow {
  name: string
  type: string
  default?: string
  description: string
}

const props = defineProps<{
  title: string
  rows: ApiRow[]
  /** 'props' | 'events' | 'slots' */
  kind?: 'props' | 'events' | 'slots'
}>()

const { t } = useI18n()

function hasDefault(row: ApiRow): boolean {
  return row.default !== undefined && row.default !== 'undefined'
}
</script>

<template>
  <div class="api-section">
    <h3 class="api-section-title">{{ title }}</h3>
    <div class="api-table-wrap">
      <table class="api-table">
        <thead>
          <tr>
            <th class="col-name">
              {{
                kind === 'events'
                  ? t('api.table.eventName')
                  : kind === 'slots'
                    ? t('api.table.slotName')
                    : t('api.table.propName')
              }}
            </th>
            <th class="col-type">{{ t('api.table.type') }}</th>
            <th
              v-if="kind !== 'events' && kind !== 'slots'"
              class="col-default"
            >
              {{ t('api.table.default') }}
            </th>
            <th class="col-desc">{{ t('api.table.desc') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.name">
            <td class="col-name">
              <code>{{ row.name }}</code>
            </td>
            <td class="col-type"><code v-html="row.type" /></td>
            <td
              v-if="kind !== 'events' && kind !== 'slots'"
              class="col-default"
            >
              <code v-if="hasDefault(row)">{{ row.default }}</code>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="col-desc">{{ row.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.api-section {
  margin-bottom: 32px;
}

.api-section-title {
  margin: 0 0 12px;
  font-size: 1em;
  font-weight: 600;
  color: #ddd;
}

.api-table-wrap {
  overflow-x: auto;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
}

.api-table th {
  text-align: left;
  padding: 8px 12px;
  background: #1e1e1e;
  color: #888;
  font-weight: 600;
  font-size: 0.85em;
  border-bottom: 2px solid #2a2a2a;
  white-space: nowrap;
}

.api-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #1e1e1e;
  vertical-align: top;
}

.api-table tbody tr:hover {
  background: #161616;
}

.col-name {
  width: 22%;
  min-width: 150px;
}

.col-name code {
  color: #42b883;
  font-weight: 600;
  white-space: nowrap;
}

.col-type {
  width: 28%;
  min-width: 140px;
  color: #ccc;
  font-size: 0.82em;
}

.col-default {
  width: 14%;
  min-width: 80px;
  color: #ccc;
  font-size: 0.82em;
}

.col-desc {
  color: #999;
}

.text-muted {
  color: #555;
}
</style>
