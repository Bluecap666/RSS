<template>
  <div class="article-reader-page" :class="[`theme-${currentTheme}`]">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="nav-bar__left">
        <button @click="$router.back()" class="back-btn">
          <van-icon name="arrow-left" size="24" />
        </button>
      </div>
      <div class="nav-bar__title">阅读</div>
      <div class="nav-bar__right">
        <button @click="toggleSettings" class="setting-btn">
          <van-icon name="font-o" size="24" />
        </button>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content" ref="contentRef">
      <!-- 标题区域 -->
      <h1 class="article-title">{{ article?.title }}</h1>
      
      <!-- 元信息 -->
      <div v-if="article" class="article-meta">
        <div class="meta-item">
          <van-icon name="clock-o" size="16" />
          <span>{{ formatDate(article.pubDate, 'full') }}</span>
        </div>
        <div v-if="article.author" class="meta-item">
          <van-icon name="manager-o" size="16" />
          <span>{{ article.author }}</span>
        </div>
        <div v-if="readingTime" class="meta-item">
          <van-icon name="underway-o" size="16" />
          <span>约{{ readingTime }}分钟</span>
        </div>
      </div>

      <!-- 封面图 -->
      <img 
        v-if="article?.image" 
        :src="article.image" 
        class="article-cover"
        loading="lazy"
      />

      <!-- 正文内容 -->
      <div 
        v-if="articleContent" 
        class="article-body"
        :style="bodyStyle"
        v-html="articleContent"
      ></div>

      <!-- 无内容时显示描述 -->
      <div v-else-if="article?.description" class="article-description">
        <p v-html="article.description"></p>
      </div>

      <!-- 阅读原文链接 -->
      <div v-if="article?.link" class="article-source">
        <a :href="article.link" target="_blank" class="source-link">
          查看原文 <van-icon name="share-o" size="16" />
        </a>
      </div>
    </div>

    <!-- 设置面板 -->
    <van-popup v-model:show="showSettings" position="bottom" round class="settings-popup">
      <div class="settings-panel">
        <div class="settings-header">
          <h3>阅读设置</h3>
          <button @click="toggleSettings" class="close-btn">
            <van-icon name="cross" size="20" />
          </button>
        </div>

        <!-- 字体大小 -->
        <div class="setting-item">
          <div class="setting-label">字体大小</div>
          <van-slider
            v-model="fontSize"
            :min="14"
            :max="24"
            :step="1"
            bar-height="4"
            @change="saveSettings"
          />
          <div class="setting-value">{{ fontSize }}px</div>
        </div>

        <!-- 行高 -->
        <div class="setting-item">
          <div class="setting-label">行间距</div>
          <van-slider
            v-model="lineHeight"
            :min="1.5"
            :max="2.5"
            :step="0.1"
            bar-height="4"
            @change="saveSettings"
          />
          <div class="setting-value">{{ lineHeight }}</div>
        </div>

        <!-- 主题切换 -->
        <div class="setting-item">
          <div class="setting-label">阅读主题</div>
          <div class="theme-options">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="setTheme(theme.value)"
              :class="['theme-option', theme.value, { active: currentTheme === theme.value }]"
            >
              {{ theme.label }}
            </button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '../stores/feed'
import { formatDate, getReadingTime, stripHtml } from '../utils/helpers'

const route = useRoute()
const settingsStore = useSettingsStore()

const showSettings = ref(false)
const contentRef = ref(null)
const article = ref(null)

// 读取设置
const fontSize = ref(settingsStore.fontSize)
const lineHeight = ref(settingsStore.lineHeight)
const currentTheme = ref(settingsStore.theme)

// 主题选项
const themes = [
  { value: 'light', label: '日间' },
  { value: 'dark', label: '夜间' },
  { value: 'sepia', label: '复古' }
]

// 计算正文字体样式
const bodyStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: lineHeight.value.toString()
}))

// 计算阅读时间
const readingTime = computed(() => {
  if (!article.value?.content) return null
  return getReadingTime(article.value.content)
})

// 获取文章内容 (优先显示完整内容)
const articleContent = computed(() => {
  if (!article.value) return null
  return article.value.content || null
})

onMounted(() => {
  // 模拟加载文章 (实际应该从 store 或 API 获取)
  loadArticle()
})

// 加载文章
function loadArticle() {
  // TODO: 从 store 获取文章详情
  // 这里暂时从 localStorage 模拟
  const articleId = route.params.id
  console.log('Loading article:', articleId)
  
  // 模拟数据
  article.value = {
    id: articleId,
    title: '示例文章标题 - 这是一个测试',
    description: '这是一篇示例文章的描述内容。由于 RSS 源的不同，有些文章可能只有描述而没有完整内容。',
    content: `
      <p>这是文章的正文内容。在实际应用中，这里会显示 RSS 源提供的完整文章内容。</p>
      <p>RSS（Really Simple Syndication）是一种消息来源格式规范，便于用户订阅网站内容。通过 RSS 阅读器，用户可以方便地获取多个网站的最新更新。</p>
      <p>本文展示了阅读页面的基本功能和样式设置。你可以调整字体大小、行间距和主题来获得最佳的阅读体验。</p>
    `,
    pubDate: Date.now(),
    author: '示例作者',
    link: '#'
  }
}

// 切换设置面板
function toggleSettings() {
  showSettings.value = !showSettings.value
}

// 设置主题
function setTheme(theme) {
  currentTheme.value = theme
  settingsStore.setTheme(theme)
}

// 保存设置
function saveSettings() {
  settingsStore.setFontSize(fontSize.value)
  settingsStore.setLineHeight(lineHeight.value)
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.article-reader-page {
  min-height: 100vh;
  background-color: $bg-color;
  transition: background-color $transition-normal;
  
  &.theme-light {
    background-color: #F5F7FA;
  }
  
  &.theme-dark {
    background-color: #1A1A1A;
    
    .nav-bar {
      background: #2C2C2C;
      
      .nav-bar__title {
        color: #E0E0E0;
      }
      
      .back-btn,
      .setting-btn {
        color: #E0E0E0;
      }
    }
    
    .article-title {
      color: #E0E0E0;
    }
    
    .article-meta {
      color: #999999;
    }
  }
  
  &.theme-sepia {
    background-color: #F8E7D9;
    
    .article-title {
      color: #5B4636;
    }
    
    .article-meta {
      color: #8B7355;
    }
  }
}

.article-content {
  padding: $spacing-md;
  max-width: 750px;
  margin: 0 auto;
}

.article-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-md;
  line-height: $line-height-lg;
}

.article-meta {
  margin-bottom: $spacing-md;
  @include flex-vertical-center;
  gap: $spacing-md;
  font-size: $font-size-xs;
  color: $text-secondary;
  
  .meta-item {
    @include flex-vertical-center;
    gap: $spacing-xs;
  }
}

.article-cover {
  width: 100%;
  border-radius: $radius-md;
  margin-bottom: $spacing-md;
}

.article-body {
  color: $text-primary;
  text-align: justify;
  
  :deep(p) {
    margin-bottom: $spacing-md;
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: $radius-sm;
    margin: $spacing-md 0;
  }
  
  :deep(a) {
    color: $primary-color;
    text-decoration: underline;
  }
}

.article-description {
  font-size: $font-size-md;
  line-height: $line-height-md;
  color: $text-secondary;
  
  p {
    margin-bottom: $spacing-md;
  }
}

.article-source {
  margin-top: $spacing-xl;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
  
  .source-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $primary-color;
    font-size: $font-size-sm;
  }
}

.settings-popup {
  :deep(.van-popup) {
    padding-top: $spacing-lg;
  }
}

.settings-panel {
  padding: $spacing-lg;
}

.settings-header {
  @include flex-between;
  margin-bottom: $spacing-lg;
  
  h3 {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
  }
  
  .close-btn {
    padding: $spacing-xs;
    color: $text-secondary;
  }
}

.setting-item {
  margin-bottom: $spacing-lg;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.setting-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.setting-value {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: right;
}

.theme-options {
  display: flex;
  gap: $spacing-sm;
}

.theme-option {
  flex: 1;
  padding: $spacing-sm;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  text-align: center;
  border: 2px solid $border-color;
  background: $card-bg;
  color: $text-primary;
  transition: all $transition-fast;
  
  &.active {
    border-color: $primary-color;
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    font-weight: 600;
  }
}

.back-btn,
.setting-btn {
  padding: $spacing-xs;
  color: $text-primary;
}
</style>
