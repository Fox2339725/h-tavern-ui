<template>
  <div class="cc">
    <!-- 顶部：时间与切换 -->
    <div class="cc-head">
      <div class="cc-title">🍻 H 酒馆控制台</div>
      <div class="cc-time">
        <span class="time-text">{{ store.data.当前时间 }}</span>
        <span class="time-scene">· {{ store.data.当前场景 }}</span>
      </div>
      <div class="time-btns">
        <button class="btn" @click="switchTime('白天')">☀ 白天</button>
        <button class="btn" @click="switchTime('夜晚')">🌙 夜晚</button>
      </div>
    </div>

    <!-- 经营 -->
    <div class="cc-section">
      <div class="cc-sec-head">🏪 经营</div>
      <div class="mgmt-grid">
        <div class="mgmt-item"><span class="k">资金</span><span class="v">{{ money(store.data.经营.资金) }}</span></div>
        <div class="mgmt-item"><span class="k">欠款</span><span class="v">{{ money(store.data.经营.欠款) }}</span></div>
        <div class="mgmt-item"><span class="k">剩余天数</span><span class="v">{{ store.data.经营.剩余天数 }}</span></div>
        <div class="mgmt-item"><span class="k">评价</span><span class="v">{{ store.data.经营.评价 }}</span></div>
        <div class="mgmt-item"><span class="k">色情评价</span><span class="v">{{ store.data.经营.色情评价 }}</span></div>
      </div>
    </div>

    <!-- 女主角 -->
    <div class="cc-section">
      <div class="cc-sec-head">👧 女主角</div>
      <div class="heroines">
        <HeroineCard which="葵" />
        <HeroineCard which="美月" />
      </div>
    </div>

    <!-- 里菜单 -->
    <div class="cc-section">
      <button class="btn primary menu-btn" :disabled="loadingMenu" @click="showMenu">
        📜 {{ loadingMenu ? '正在生成…' : '里菜单' }}
      </button>
      <details v-if="menuText" class="menu-panel">
        <summary>展开菜单结果</summary>
        <div class="menu-content" v-html="menuText"></div>
      </details>
    </div>

    <!-- 佑树 + NTR -->
    <div class="cc-section">
      <div class="cc-sec-head">💍 佑树 · NTR</div>
      <div class="stat-row">
        <span class="stat-label">绿帽度</span>
        <div class="meter">
          <div class="fill" :style="{ width: pct(store.data.佑树.绿帽度, 100), background: 'var(--c-cuck)' }"></div>
          <span class="meter-label">{{ store.data.佑树.绿帽度 }}</span>
        </div>
        <span class="badge">{{ store.data.佑树.知情度 }}</span>
      </div>
      <div class="ntr-list">
        <div v-for="man in ntrMen" :key="man.key" class="ntr-item">
          <span class="ntr-name">{{ man.label }}</span>
          <span class="ntr-val">♥ {{ man.data.好感度 }}</span>
          <span class="ntr-target" :class="{ tset: man.data.目标 !== '无' }">目标 {{ man.data.目标 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref } from 'vue';
import HeroineCard from './components/HeroineCard.vue';
import { useDataStore } from './store';

const store = useDataStore();

const menuText = ref('');
const loadingMenu = ref(false);

const ntrMen = computed(() => [
  { key: '罗伊', label: '🔪 罗伊', data: store.data.罗伊 },
  { key: '客人', label: '🍺 客人', data: store.data.客人 },
  { key: '托米', label: '👨‍🏫 托米', data: store.data.托米 },
  { key: '雷纳德', label: '👑 雷纳德', data: store.data.雷纳德 },
]);

function pct(v: number | undefined, max: number): string {
  return `${Math.round((_.clamp(v ?? 0, 0, max) / max) * 100)}%`;
}

function money(v: number | undefined): string {
  const n = v ?? 0;
  return n >= 100000000 ? `${(n / 100000000).toFixed(1)}亿` : n >= 10000 ? `${(n / 10000).toFixed(1)}万` : `${n}`;
}

function switchTime(period: '白天' | '夜晚') {
  const m = (store.data.当前时间 ?? '第1天 黄昏').match(/第(\d+)天/);
  const day = m ? parseInt(m[1], 10) : 1;
  if (period === '夜晚') {
    store.data.当前时间 = `第${day}天 夜晚`;
  } else {
    store.data.当前时间 = `第${day + 1}天 白天`;
    store.data.经营.剩余天数 = _.clamp((store.data.经营.剩余天数 ?? 0) - 1, 0, 999);
  }
}

async function showMenu() {
  if (loadingMenu.value) return;
  loadingMenu.value = true;
  try {
    const result = await generate({
      user_input: '请完整列出里菜单的全部分类、项目和价格',
      should_silence: true,
    });
    menuText.value = typeof result === 'string' ? result : '（已请求，请查看聊天记录）';
  } catch (e) {
    toastr.error('请求里菜单失败');
    menuText.value = '';
  } finally {
    loadingMenu.value = false;
  }
}
</script>

<style scoped>
.cc {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 12px;
}

.cc-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.cc-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--c-primary);
}

.cc-time {
  flex: 1;
  color: var(--c-muted);
  font-size: 12px;
}

.time-btns {
  display: flex;
  gap: 6px;
}

.cc-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cc-sec-head {
  font-weight: 700;
  color: var(--c-primary);
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 3px;
}

.mgmt-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mgmt-item {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 4px 8px;
  display: flex;
  gap: 6px;
}

.mgmt-item .k {
  color: var(--c-muted);
  font-size: 11px;
}

.mgmt-item .v {
  color: var(--c-text);
  font-weight: 600;
}

.heroines {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.menu-btn {
  width: 100%;
}

.menu-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
}

.menu-panel summary {
  cursor: pointer;
  padding: 6px 10px;
  color: var(--c-primary);
  font-weight: 600;
}

.menu-content {
  padding: 8px 12px;
  font-size: 12px;
  white-space: pre-wrap;
  border-top: 1px solid var(--c-border);
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

.badge {
  font-size: 11px;
  color: var(--c-muted);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 1px 6px;
}

.ntr-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.ntr-item {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.ntr-name {
  font-weight: 600;
}

.ntr-val {
  color: var(--c-heart);
}

.ntr-target {
  color: var(--c-muted);
  margin-left: auto;
}

.ntr-target.tset {
  color: var(--c-cuck);
  font-weight: 600;
}

@media (max-width: 480px) {
  .heroines {
    grid-template-columns: 1fr;
  }
  .ntr-list {
    grid-template-columns: 1fr;
  }
}
</style>
