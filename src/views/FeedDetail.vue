<template>
  <MainLayout>
    <div class="feed-detail-page">
      <!-- 文章列表 -->
      <div class="content">
        <!-- 加载状态 -->
        <div v-if="loading && articles.length === 0" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">正在加载文章...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="articles.length === 0" class="empty-state">
          <div class="empty-state__icon">📭</div>
          <div class="empty-state__text">还没有文章</div>
          <button @click="refreshFeed" class="refresh-empty-btn">刷新试试</button>
        </div>

        <!-- 文章列表 -->
        <div v-else class="articles-list">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @click="goToArticle(article)"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFeedStore } from '../stores/feed'
import { showToast, showLoadingToast, closeToast } from 'vant'
import ArticleCard from '../components/ArticleCard.vue'
import MainLayout from '../components/MainLayout.vue'
import rssParser from '../services/rssParser'
import storage from '../services/storage'

const route = useRoute()
const router = useRouter()
const feedStore = useFeedStore()

const loading = ref(false)
const articles = ref([])

// 获取 RSS 源信息
const feed = computed(() => {
  return feedStore.getFeedById(route.params.id)
})

// 页面加载时获取文章
onMounted(async () => {
  await loadArticles()
})

// 监听路由变化，重新加载文章
watch(() => route.params.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadArticles()
  }
}, { immediate: true })

// 加载文章
async function loadArticles() {
  const feedId = route.params.id
  console.log('Loading articles for feed:', feedId)
  
  // 尝试从缓存加载
  const cachedArticles = await storage.getArticles(feedId)
  if (cachedArticles && cachedArticles.length > 0) {
    console.log('Loaded from cache:', cachedArticles.length, 'articles')
    articles.value = cachedArticles
    return
  }

  // 从 store 加载
  const currentFeed = feedStore.getFeedById(feedId)
  console.log('Feed from store:', currentFeed)
  if (currentFeed && currentFeed.items.length > 0) {
    console.log('Loaded from store:', currentFeed.items.length, 'articles')
    articles.value = currentFeed.items
  } else {
    console.log('No articles found, need to fetch')
  }
}

// 刷新 RSS 源
async function refreshFeed() {
  try {
    loading.value = true
    showLoadingToast('正在刷新...')

    const currentFeed = feed.value
    const result = await rssParser.parse(currentFeed.url)
    
    // 更新 store
    feedStore.updateFeedItems(currentFeed.id, result.items)
    articles.value = result.items
    
    // 保存到缓存
    await storage.saveArticles(currentFeed.id, result.items)
    storage.setCacheTime(currentFeed.id, Date.now())

    showToast('刷新成功')
  } catch (error) {
    console.error('Refresh error:', error)
    showToast('刷新失败，请检查网络连接')
  } finally {
    loading.value = false
    closeToast()
  }
}

// 跳转到文章详情
function goToArticle(article) {
  router.push(`/article/${article.id}`)
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.feed-detail-page {
  min-height: 100vh;
}

.content {
  padding: $spacing-md;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  @include flex-center;
  flex-direction: column;
  padding: $spacing-xl * 2;
  
  .spinner {
    @include loading-spinner(40px, $primary-color);
    margin-bottom: $spacing-md;
  }
  
  .loading-text {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.empty-state {
  margin-top: 10vh;
  
  &__icon {
    font-size: 3rem;
    margin-bottom: $spacing-md;
  }
  
  &__text {
    font-size: $font-size-md;
    color: $text-secondary;
    margin-bottom: $spacing-md;
  }
}

.refresh-empty-btn {
  padding: $spacing-sm $spacing-lg;
  background: $primary-color;
  color: $text-light;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-md;
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 移动端适配
@media (max-width: 768px) {
  .articles-list {
    grid-template-columns: 1fr;
  }
}
</style>
