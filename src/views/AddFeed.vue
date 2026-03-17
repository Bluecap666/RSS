<template>
  <div class="add-feed-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <div class="nav-bar__left">
        <button @click="$router.back()" class="back-btn">
          <van-icon name="arrow-left" size="24" />
        </button>
      </div>
      <div class="nav-bar__title">添加 RSS 源</div>
      <div class="nav-bar__right">
        <button @click="submitFeed" class="submit-btn" :disabled="!url || loading">
          添加
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="form-group">
        <label class="form-label">RSS 源地址</label>
        <van-field
          v-model="url"
          placeholder="请输入 RSS/Atom 订阅地址"
          clearable
          autofocus
          @blur="validateUrl"
        />
        <div v-if="urlError" class="field-error">{{ urlError }}</div>
      </div>

      <!-- 预览区域 -->
      <div v-if="previewData" class="preview-section">
        <h3 class="preview-title">预览</h3>
        <div class="preview-card">
          <h4 class="preview-card__title">{{ previewData.title }}</h4>
          <p v-if="previewData.description" class="preview-card__desc">
            {{ truncate(previewData.description, 100) }}
          </p>
          <div class="preview-card__meta">
            <van-icon name="underway-o" size="16" />
            <span>{{ previewData.items.length }} 篇文章</span>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tips-section">
        <div class="tips-title">💡 提示</div>
        <div class="tips-content">
          <p>• 支持 RSS 2.0、Atom 1.0、RSS 1.0 格式</p>
          <p>• 确保链接可以公开访问</p>
          <p>• 常见 RSS 源：博客、新闻网站等</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFeedStore } from '../stores/feed'
import { showToast, showLoadingToast, closeToast } from 'vant'
import rssParser from '../services/rssParser'
import storage from '../services/storage'
import { isValidUrl, truncate } from '../utils/helpers'

const router = useRouter()
const feedStore = useFeedStore()

const url = ref('')
const urlError = ref('')
const loading = ref(false)
const previewData = ref(null)

// 验证 URL
function validateUrl() {
  if (!url.value) {
    urlError.value = ''
    previewData.value = null
    return
  }

  if (!isValidUrl(url.value)) {
    urlError.value = '请输入有效的 URL 地址'
    previewData.value = null
  } else {
    urlError.value = ''
  }
}

// 提交 RSS 源
async function submitFeed() {
  if (!url.value) {
    showToast('请输入 RSS 地址')
    return
  }

  if (!isValidUrl(url.value)) {
    showToast('请输入有效的 URL 地址')
    return
  }

  try {
    loading.value = true
    showLoadingToast({
      message: '正在解析 RSS 源...',
      duration: 3000,
      forbidClick: true
    })

    // 解析 RSS
    const result = await rssParser.parse(url.value)
    
    console.log('RSS 解析成功:', result)
    
    // 验证结果
    if (!result || !result.title) {
      throw new Error('无法识别的 RSS 格式')
    }
    
    // 保存数据
    const newFeed = feedStore.addFeed({
      title: result.title,
      url: url.value,
      description: result.description,
      imageUrl: result.imageUrl
    })

    // 更新文章列表
    feedStore.updateFeedItems(newFeed.id, result.items)
    
    // 持久化存储
    storage.saveFeeds(feedStore.getAllFeeds())
    await storage.saveArticles(newFeed.id, result.items)
    storage.setCacheTime(newFeed.id, Date.now())

    showToast({
      message: '添加成功',
      type: 'success'
    })
    
    // 延迟跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error) {
    console.error('Add feed error:', error)
    let errorMessage = '解析失败，请检查链接是否正确'
    
    // 根据错误类型提供更详细的提示
    if (error.message.includes('522')) {
      errorMessage = '连接超时 (522): 源服务器响应过慢，请稍后重试或更换 RSS 源'
    } else if (error.message.includes('403')) {
      errorMessage = '访问被拒绝 (403): 该网站禁止代理访问，请使用 RSSHub 或其他订阅源'
    } else if (error.message.includes('404')) {
      errorMessage = '地址不存在 (404): 请检查 RSS 链接是否正确'
    } else if (error.message.includes('CORS')) {
      errorMessage = '网络错误：跨域访问被阻止，请尝试更换 RSS 源'
    } else if (error.message.includes('Empty response')) {
      errorMessage = '服务器返回空内容，请检查链接是否有效'
    } else if (error.message.includes('Invalid XML')) {
      errorMessage = '无效的 RSS 格式，请确认这是有效的 RSS/Atom 地址'
    } else if (error.message.includes('Unknown RSS format')) {
      errorMessage = '无法识别的 RSS 格式，请尝试其他订阅源'
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时：网络连接不稳定，请检查网络或稍后重试'
    }
    
    showToast({
      message: errorMessage,
      type: 'fail',
      duration: 5000
    })
  } finally {
    loading.value = false
    closeToast()
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.add-feed-page {
  min-height: 100vh;
  background-color: $bg-color;
}

.content {
  padding: $spacing-md;
}

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  display: block;
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.field-error {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: $error-color;
}

.preview-section {
  margin-bottom: $spacing-lg;
}

.preview-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.preview-card {
  @include poster-card;
  padding: $spacing-md;
  
  &__title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }
  
  &__desc {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    line-height: $line-height-md;
  }
  
  &__meta {
    font-size: $font-size-xs;
    color: $text-secondary;
    @include flex-vertical-center;
    gap: $spacing-xs;
  }
}

.tips-section {
  background: rgba($primary-color, 0.05);
  border-radius: $radius-md;
  padding: $spacing-md;
  
  .tips-title {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $primary-color;
    margin-bottom: $spacing-xs;
  }
  
  .tips-content {
    font-size: $font-size-xs;
    color: $text-secondary;
    line-height: $line-height-md;
    
    p {
      margin-bottom: $spacing-xs;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.back-btn {
  padding: $spacing-xs;
  color: $text-primary;
}

.submit-btn {
  padding: $spacing-xs $spacing-md;
  background: $primary-color;
  color: $text-light;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
