<template>
  <div class="settings-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="nav-bar__left">
        <button @click="$router.back()" class="back-btn">
          <van-icon name="arrow-left" size="24" />
        </button>
      </div>
      <div class="nav-bar__title">设置</div>
      <div class="nav-bar__right"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 阅读设置 -->
      <van-cell-group inset title="阅读设置">
        <van-cell title="字体大小" is-link @click="showFontSize = true">
          <template #right-icon>
            <span class="setting-value">{{ settingsStore.fontSize }}px</span>
          </template>
        </van-cell>
        
        <van-cell title="行间距" is-link @click="showLineHeight = true">
          <template #right-icon>
            <span class="setting-value">{{ settingsStore.lineHeight }}</span>
          </template>
        </van-cell>
        
        <van-cell title="阅读主题" is-link @click="showThemePicker = true">
          <template #right-icon>
            <span class="setting-value">{{ themeLabel }}</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 数据管理 -->
      <van-cell-group inset title="数据管理">
        <van-cell title="导出 RSS 源" label="备份所有 RSS 源配置" is-link @click="exportData" />
        <van-cell title="导入 RSS 源" label="恢复之前备份的数据" is-link @click="importData" />
        <van-cell 
          title="清空缓存" 
          label="清除所有文章缓存" 
          is-link 
          @click="confirmClearCache"
        />
      </van-cell-group>

      <!-- 关于 -->
      <van-cell-group inset title="关于">
        <van-cell title="版本" value="v1.0.0" />
        <van-cell title="技术栈" value="Vue 3 + Vite" />
      </van-cell-group>

      <!-- 重置按钮 -->
      <div class="reset-section">
        <button @click="confirmResetAll" class="reset-btn">
          重置所有设置
        </button>
      </div>
    </div>

    <!-- 字体大小选择器 -->
    <van-popup v-model:show="showFontSize" position="bottom" round>
      <van-picker
        :columns="fontSizeColumns"
        :default-index="6"
        @confirm="onFontSizeConfirm"
        @cancel="showFontSize = false"
      />
    </van-popup>

    <!-- 行高选择器 -->
    <van-popup v-model:show="showLineHeight" position="bottom" round>
      <van-picker
        :columns="lineHeightColumns"
        :default-index="8"
        @confirm="onLineHeightConfirm"
        @cancel="showLineHeight = false"
      />
    </van-popup>

    <!-- 主题选择器 -->
    <van-popup v-model:show="showThemePicker" position="bottom" round>
      <van-picker
        :columns="themeColumns"
        @confirm="onThemeConfirm"
        @cancel="showThemePicker = false"
      />
    </van-popup>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useFeedStore } from '../stores/feed'
import { showToast, showLoadingToast, closeToast, showDialog } from 'vant'
import storage from '../services/storage'

const settingsStore = useSettingsStore()
const feedStore = useFeedStore()

const showFontSize = ref(false)
const showLineHeight = ref(false)
const showThemePicker = ref(false)
const fileInputRef = ref(null)

// 字体大小选项 (14-24px)
const fontSizeColumns = Array.from({ length: 11 }, (_, i) => ({
  text: `${14 + i}px`,
  value: 14 + i
}))

// 行高选项 (1.5-2.5)
const lineHeightColumns = Array.from({ length: 11 }, (_, i) => ({
  text: (1.5 + i * 0.1).toFixed(1),
  value: 1.5 + i * 0.1
}))

// 主题选项
const themeColumns = [
  { text: '日间模式', value: 'light' },
  { text: '夜间模式', value: 'dark' },
  { text: '复古模式', value: 'sepia' }
]

// 当前主题标签
const themeLabel = computed(() => {
  const themes = {
    light: '日间模式',
    dark: '夜间模式',
    sepia: '复古模式'
  }
  return themes[settingsStore.theme] || '日间模式'
})

// 确认字体大小
function onFontSizeConfirm({ selectedOptions }) {
  settingsStore.setFontSize(selectedOptions[0].value)
  showFontSize.value = false
  showToast('设置已保存')
}

// 确认行高
function onLineHeightConfirm({ selectedOptions }) {
  settingsStore.setLineHeight(selectedOptions[0].value)
  showLineHeight.value = false
  showToast('设置已保存')
}

// 确认主题
function onThemeConfirm({ selectedOptions }) {
  settingsStore.setTheme(selectedOptions[0].value)
  showThemePicker.value = false
  showToast('主题已切换')
}

// 导出数据
function exportData() {
  try {
    const success = storage.exportData()
    if (success) {
      showToast('导出成功')
    } else {
      showToast('导出失败')
    }
  } catch (error) {
    console.error('Export error:', error)
    showToast('导出失败')
  }
}

// 导入数据
function importData() {
  fileInputRef.value?.click()
}

// 处理文件选择
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const success = storage.importData(e.target.result)
      if (success) {
        showToast('导入成功')
        // 重新加载数据
        location.reload()
      } else {
        showToast('导入失败：文件格式不正确')
      }
    } catch (error) {
      console.error('Import error:', error)
      showToast('导入失败')
    }
  }
  reader.readAsText(file)
  
  // 清空 input
  event.target.value = ''
}

// 确认清空缓存
async function confirmClearCache() {
  showDialog({
    title: '确认清空',
    message: '确定要清空所有文章缓存吗？此操作不可恢复。',
    showCancelButton: true
  }).then(async () => {
    try {
      showLoadingToast('正在清空...')
      await storage.clearAllArticles()
      showToast('缓存已清空')
    } catch (error) {
      console.error('Clear cache error:', error)
      showToast('清空失败')
    } finally {
      closeToast()
    }
  }).catch(() => {})
}

// 确认重置所有设置
function confirmResetAll() {
  showDialog({
    title: '确认重置',
    message: '确定要重置所有设置和数据吗？此操作不可恢复！',
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '重置',
    confirmButtonColor: '#FF6B6B'
  }).then(() => {
    settingsStore.resetSettings()
    feedStore.clearAllFeeds()
    storage.clearAllArticles()
    localStorage.clear()
    showToast('已重置所有设置')
    setTimeout(() => {
      location.reload()
    }, 1000)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.settings-page {
  min-height: 100vh;
  background-color: $bg-color;
}

.content {
  padding: $spacing-md;
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
}

.setting-value {
  color: $text-secondary;
  font-size: $font-size-sm;
}

.reset-section {
  margin-top: $spacing-xl;
  text-align: center;
}

.reset-btn {
  padding: $spacing-sm $spacing-xl;
  background: $error-color;
  color: $text-light;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.back-btn {
  padding: $spacing-xs;
  color: $text-primary;
}
</style>
