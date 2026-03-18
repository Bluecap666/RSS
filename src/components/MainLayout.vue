<template>
  <div class="main-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed, 'mobile-visible': isMobile && showOverlay }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <div class="header-left">
          <button @click="toggleSidebar" class="menu-btn" v-if="isMobile">
            <van-icon name="cross" size="24" />
          </button>
          <h2 class="sidebar-title">RSS 源</h2>
        </div>
        <button @click="toggleSidebar" class="collapse-btn" v-if="!isMobile">
          <van-icon :name="sidebarCollapsed ? 'arrow-expand' : 'arrow-fold'" size="20" />
        </button>
      </div>

      <!-- RSS 源列表 -->
      <div class="sidebar-content">
        <!-- 空状态 -->
        <div v-if="feeds.length === 0 && !loading" class="empty-state">
          <div class="empty-state__icon">📰</div>
          <p v-if="!sidebarCollapsed" class="empty-state__text">暂无 RSS 源</p>
        </div>

        <!-- 加载中 -->
        <div v-else-if="loading" class="loading-state">
          <div class="spinner"></div>
        </div>

        <!-- RSS 源列表 -->
        <div v-else class="feeds-list">
          <div
            v-for="feed in feeds"
            :key="feed.id"
            :class="['feed-item', { active: currentFeedId === feed.id }]"
            @click="selectFeed(feed.id)"
          >
            <div class="feed-item__content">
              <h3 class="feed-item__title">{{ truncate(feed.title, sidebarCollapsed ? 1 : 25) }}</h3>
              <p v-if="!sidebarCollapsed" class="feed-item__meta">
                {{ feed.items?.length || 0 }} 篇文章
              </p>
            </div>
            
            <!-- 操作按钮 (只在展开时显示) -->
            <div v-if="!sidebarCollapsed" class="feed-item__actions">
              <button @click.stop="refreshFeed(feed)" class="action-btn">
                <van-icon name="replay-o" size="16" />
              </button>
              <button @click.stop="deleteFeed(feed)" class="action-btn danger">
                <van-icon name="delete-o" size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="sidebar-footer">
        <button @click="$router.push('/add-feed')" class="add-feed-btn" :title="sidebarCollapsed ? '添加 RSS 源' : ''">
          <van-icon name="plus-o" size="20" />
          <span v-if="!sidebarCollapsed">添加 RSS 源</span>
        </button>
        <button @click="showImportExport = true" class="import-export-btn" :title="sidebarCollapsed ? '导入导出' : ''" v-if="!sidebarCollapsed">
          <van-icon name="share-o" size="20" />
          <span v-if="!sidebarCollapsed">导入导出</span>
        </button>
      </div>
    </aside>

    <!-- 导入导出弹窗 -->
    <van-popup v-model:show="showImportExport" position="bottom" round class="ie-popup" :close-on-click-overlay="true">
      <div class="ie-panel">
        <div class="ie-header">
          <h3>导入导出 RSS 源</h3>
          <button @click="showImportExport = false" class="close-btn">
            <van-icon name="cross" size="20" />
          </button>
        </div>
        <div class="ie-content">
          <button @click="exportData" class="ie-btn export">
            <van-icon name="download-o" size="24" />
            <span>导出数据</span>
            <p>备份所有 RSS 源配置</p>
          </button>
          <button @click="triggerImport" class="ie-btn import">
            <van-icon name="upload-o" size="24" />
            <span>导入数据</span>
            <p>恢复之前备份的数据</p>
          </button>
        </div>
      </div>
    </van-popup>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部工具栏 -->
      <div class="top-toolbar" v-if="isMobile">
        <button @click="toggleSidebar" class="toolbar-btn">
          <van-icon name="bars" size="24" />
        </button>
        <h1 class="toolbar-title">RSS Reader</h1>
        <button @click="showImportExport = true" class="toolbar-btn">
          <van-icon name="share-o" size="22" />
        </button>
      </div>
      
      <slot></slot>
    </main>

    <!-- 遮罩层 (移动端使用) -->
    <div v-if="showOverlay" class="overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFeedStore } from '../stores/feed'
import { showToast, showLoadingToast, closeToast, showDialog } from 'vant'
import rssParser from '../services/rssParser'
import storage from '../services/storage'
import { truncate } from '../utils/helpers'

const router = useRouter()
const route = useRoute()
const feedStore = useFeedStore()

const sidebarCollapsed = ref(false)
const showOverlay = ref(false)
const loading = ref(false)
const currentFeedId = ref(null)
const showImportExport = ref(false)
const fileInputRef = ref(null)

// 获取所有 RSS 源
const feeds = computed(() => feedStore.getAllFeeds())

// 是否为移动设备
const isMobile = computed(() => window.innerWidth < 768)

onMounted(async () => {
  await loadFeeds()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  handleResize()
  
  // 默认选中第一个 RSS 源
  setTimeout(() => {
    if (feeds.value.length > 0 && !currentFeedId.value) {
      selectFeed(feeds.value[0].id)
    }
  }, 500)
})

// 加载 RSS 源
async function loadFeeds() {
  const savedFeeds = storage.getFeeds()
  if (savedFeeds.length > 0) {
    savedFeeds.forEach(feed => {
      feedStore.addFeed(feed)
    })
  }
}

// 选择 RSS 源
function selectFeed(feedId) {
  console.log('Selecting feed:', feedId)
  currentFeedId.value = feedId
  // 跳转到该 RSS 源的文章列表页面
  router.push(`/feed/${feedId}`)
  console.log('Navigated to:', `/feed/${feedId}`)
  
  // 移动端选择后自动关闭侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
    showOverlay.value = false
  }
}

// 切换侧边栏
function toggleSidebar() {
  if (isMobile.value) {
    showOverlay.value = !showOverlay.value
    sidebarCollapsed.value = !showOverlay.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

// 刷新 RSS 源
async function refreshFeed(feed) {
  try {
    showLoadingToast('正在刷新...')
    const result = await rssParser.parse(feed.url)
    feedStore.updateFeedItems(feed.id, result.items)
    await storage.saveArticles(feed.id, result.items)
    storage.setCacheTime(feed.id, Date.now())
    showToast('刷新成功')
  } catch (error) {
    console.error('Refresh error:', error)
    showToast('刷新失败，请检查网络连接')
  } finally {
    closeToast()
  }
}

// 删除 RSS 源
function deleteFeed(feed) {
  showDialog({
    title: '确认删除',
    message: `确定要删除 "${feed.title}" 吗？`,
    showCancelButton: true
  }).then(async () => {
    feedStore.removeFeed(feed.id)
    storage.removeFeedConfig(feed.id)
    await storage.removeArticles(feed.id)
    showToast('已删除')
    
    if (currentFeedId.value === feed.id) {
      currentFeedId.value = null
      router.push('/')
    }
  }).catch(() => {})
}

// 处理窗口大小变化
function handleResize() {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
}

// 导出数据
function exportData() {
  try {
    const success = storage.exportData()
    if (success) {
      showToast({ message: '导出成功', type: 'success' })
      showImportExport.value = false
    } else {
      showToast({ message: '导出失败', type: 'fail' })
    }
  } catch (error) {
    console.error('Export error:', error)
    showToast({ message: '导出失败', type: 'fail' })
  }
}

// 触发文件选择
function triggerImport() {
  fileInputRef.value?.click()
}

// 处理文件导入
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const success = storage.importData(e.target.result)
      if (success) {
        showToast({ message: '导入成功，正在刷新...', type: 'success' })
        showImportExport.value = false
        // 重新加载数据
        setTimeout(() => {
          location.reload()
        }, 1000)
      } else {
        showToast({ message: '导入失败：文件格式不正确', type: 'fail' })
      }
    } catch (error) {
      console.error('Import error:', error)
      showToast({ message: '导入失败', type: 'fail' })
    }
  }
  reader.readAsText(file)
  
  // 清空 input
  event.target.value = ''
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 280px;
  background: $card-bg;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  transition: transform $transition-normal, width $transition-normal;
  position: relative;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  flex-shrink: 0; // 防止被压缩
  
  &.collapsed {
    width: 60px;
    
    .sidebar-title {
      display: none;
    }
    
    .feed-item__meta,
    .feed-item__actions,
    .add-feed-btn span,
    .import-export-btn span {
      display: none;
    }
    
    .feed-item__content {
      justify-content: center;
      padding: $spacing-md $spacing-sm;
    }
    
    .feed-item__title {
      font-size: $font-size-xs;
      text-align: center;
      @include text-truncate(1);
    }
  }
}

.sidebar-header {
  height: 60px;
  padding: 0 $spacing-md;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex: 1;
    
    .menu-btn {
      padding: $spacing-xs;
      background: transparent;
      border: none;
      color: $text-primary;
      cursor: pointer;
      border-radius: $radius-sm;
      transition: background $transition-fast;
      
      &:hover {
        background: $bg-color;
      }
    }
  }
  
  .sidebar-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
    white-space: nowrap;
  }
  
  .collapse-btn {
    padding: $spacing-xs;
    background: transparent;
    border: none;
    color: $text-secondary;
    cursor: pointer;
    border-radius: $radius-sm;
    transition: background $transition-fast;
    
    &:hover {
      background: $bg-color;
    }
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
  @include scroll-container;
}

.empty-state,
.loading-state {
  @include flex-center;
  padding: $spacing-xl;
  
  &__icon {
    font-size: 3rem;
    opacity: 0.3;
  }
  
  &__text {
    font-size: $font-size-sm;
    color: $text-secondary;
    text-align: center;
  }
  
  .spinner {
    @include loading-spinner(30px, $primary-color);
  }
}

.feeds-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.feed-item {
  padding: $spacing-md;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  position: relative;
  
  &:hover {
    background: $bg-color;
  }
  
  &.active {
    background: rgba($primary-color, 0.1);
    border-left: 3px solid $primary-color;
    
    .feed-item__title {
      color: $primary-color;
      font-weight: 600;
    }
  }
  
  &__content {
    @include flex-vertical-center;
    gap: $spacing-xs;
  }
  
  &__title {
    font-size: $font-size-sm;
    color: $text-primary;
    margin: 0;
    @include text-truncate(2);
    flex: 1;
  }
  
  &__meta {
    font-size: $font-size-xs;
    color: $text-muted;
    margin: $spacing-xs 0 0 0;
  }
  
  &__actions {
    display: flex;
    gap: $spacing-xs;
    opacity: 0;
    transition: opacity $transition-fast;
  }
  
  &:hover &__actions {
    opacity: 1;
  }
}

.action-btn {
  padding: $spacing-xs;
  color: $text-secondary;
  border-radius: $radius-xs;
  transition: all $transition-fast;
  
  &:hover {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &.danger {
    &:hover {
      background: rgba($error-color, 0.1);
      color: $error-color;
    }
  }
}

.sidebar-footer {
  padding: $spacing-md;
  border-top: 1px solid $border-color;
  
  .add-feed-btn {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    background: $gradient-primary;
    color: $text-light;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    @include flex-center;
    gap: $spacing-xs;
    transition: transform $transition-fast, box-shadow $transition-fast;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: $bg-color;
  @include scroll-container;
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999; // 确保在侧边栏之下，主内容之上
  backdrop-filter: blur(2px); // 毛玻璃效果
}


.ie-popup {
  .ie-panel {
    padding: $spacing-lg;
    
    .ie-header {
      @include flex-between;
      align-items: center;
      margin-bottom: $spacing-lg;
      
      h3 {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
        margin: 0;
      }
      
      .close-btn {
        padding: $spacing-xs;
        color: $text-secondary;
      }
    }
    
    .ie-content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      
      .ie-btn {
        padding: $spacing-lg;
        border-radius: $radius-lg;
        text-align: center;
        transition: all $transition-fast;
        
        &.export {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        &.import {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        
        span {
          display: block;
          font-size: $font-size-md;
          font-weight: 600;
          margin-top: $spacing-xs;
        }
        
        p {
          font-size: $font-size-xs;
          opacity: 0.8;
          margin: $spacing-xs 0 0 0;
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 80%; // 占据屏幕 80% 宽度，更合理
    max-width: 300px; // 最大宽度限制
    transform: translateX(-100%); // 默认隐藏在左侧外
    box-shadow: $shadow-lg;
    z-index: 1000;
    
    &.mobile-visible {
      transform: translateX(0); // 显示时滑入
    }
    
    // 移动端不响应 collapsed 类
    &.collapsed {
      width: 80%;
      max-width: 300px;
      transform: translateX(-100%);
      
      .sidebar-title {
        display: block;
      }
      
      .feed-item__meta,
      .feed-item__actions,
      .add-feed-btn span,
      .import-export-btn span {
        display: block;
      }
    }
  }
  
  .main-content {
    flex: 1;
    width: 100%;
    overflow-y: auto;
  }
  
  .top-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 $spacing-md;
    background: $card-bg;
    border-bottom: 1px solid $border-color;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 50;
    
    .toolbar-btn {
      padding: $spacing-xs;
      background: transparent;
      border: none;
      color: $text-primary;
      cursor: pointer;
      border-radius: $radius-sm;
      transition: background $transition-fast;
      
      &:hover {
        background: $bg-color;
      }
      
      &:active {
        transform: scale(0.9);
      }
    }
    
    .toolbar-title {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
      flex: 1;
      text-align: center;
    }
  }
  
  .overlay {
    display: block;
  }
}

// 桌面端适配
@media (min-width: 769px) {
  .top-toolbar {
    display: none; // 桌面端隐藏工具栏
  }
}
</style>
