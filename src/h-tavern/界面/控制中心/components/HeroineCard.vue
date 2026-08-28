<template>
  <div class="heroine">
    <div class="heroine-head">
      <span class="heroine-name">{{ which }}</span>
      <span class="heroine-status" :class="statusClass">{{ data.状态 }}</span>
      <span v-if="data.怀孕对象 !== '无'" class="heroine-preg">孕·{{ data.怀孕对象 }}</span>
    </div>

    <div class="stat-row">
      <span class="stat-label">♥ 好感</span>
      <div class="meter">
        <div class="fill" :style="{ width: pct(data.好感度, 999), background: 'var(--c-heart)' }"></div>
        <span class="meter-label">{{ data.好感度 }}</span>
      </div>
    </div>

    <div class="stat-row">
      <span class="stat-label">♨ 性欲</span>
      <div class="meter">
        <div class="fill" :style="{ width: pct(data.性欲, 999), background: 'var(--c-desire)' }"></div>
        <span class="meter-label">{{ data.性欲 }}</span>
      </div>
    </div>

    <div class="stat-row">
      <span class="stat-label">🍺 醉酒</span>
      <div class="meter">
        <div class="fill" :style="{ width: pct(data.醉酒度, 100), background: 'var(--c-drunk)' }"></div>
        <span class="meter-label">{{ data.醉酒度 }}</span>
      </div>
    </div>

    <div class="actions">
      <button class="btn" title="和{{ which }}聊几句" @click="addLove(1)">聊天+1</button>
      <button class="btn" title="送点小礼物" @click="addLove(5)">送礼+5</button>
      <button class="btn" title="约{{ which }}出去" @click="addLove(10)">约会+10</button>
      <button class="btn" title="给{{ which }}灌酒" @click="addDrunk(10)">灌酒+10</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useDataStore } from '../store';

const props = defineProps<{ which: '葵' | '美月' }>();
const store = useDataStore();
const data = computed(() => store.data[props.which]);

const statusClass = computed(() => {
  const s = data.value.状态;
  if (s === '淫乱') return 's-lewd';
  if (s === '色情') return 's-horny';
  return '';
});

function pct(v: number | undefined, max: number): string {
  return `${Math.round((_.clamp(v ?? 0, 0, max) / max) * 100)}%`;
}

function addLove(delta: number) {
  data.value.好感度 = _.clamp((data.value.好感度 ?? 0) + delta, 0, 999);
}

function addDrunk(delta: number) {
  data.value.醉酒度 = _.clamp((data.value.醉酒度 ?? 0) + delta, 0, 100);
}
</script>

<style scoped>
.heroine {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.heroine-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.heroine-name {
  font-weight: 700;
  color: var(--c-primary);
  font-size: 15px;
}

.heroine-status {
  font-size: 11px;
  color: var(--c-muted);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 1px 6px;
}

.heroine-status.s-horny {
  color: var(--c-desire);
  border-color: var(--c-desire);
}

.heroine-status.s-lewd {
  color: var(--c-heart);
  border-color: var(--c-heart);
}

.heroine-preg {
  font-size: 11px;
  color: var(--c-cuck);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  width: 46px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--c-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
