<template>
  <MainLayout>
    <div class="home-page">
      <!-- 空状态 -->
      <div v-if="feeds.length === 0" class="empty-state-wrapper">
        <div class="empty-state">
          <div class="empty-state__icon">📰</div>
          <div class="empty-state__text">还没有添加 RSS 源</div>
          <button @click="$router.push('/add-feed')" class="add-btn">
            <van-icon name="plus-o" /> 添加第一个 RSS 源
          </button>
        </div>
      </div>

      <!-- RSS 源列表 (桌面端显示) -->
      <div v-else class="content">
        <h2 class="page-title">全部 RSS 源</h2>
        <div class="feeds-grid">
          <FeedCard
            v-for="feed in feeds"
            :key="feed.id"
            :feed="feed"
            @click="goToFeed(feed.id)"
            @refresh="refreshFeed(feed)"
            @edit="editFeed(feed)"
            @delete="confirmDelete(feed)"
          />
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      message="确定要删除这个 RSS 源吗？删除后无法恢复。"
      show-cancel-button
      @confirm="deleteFeed"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFeedStore } from '../stores/feed'
import { showToast, showLoadingToast, closeToast } from 'vant'
import FeedCard from '../components/FeedCard.vue'
import MainLayout from '../components/MainLayout.vue'
import rssParser from '../services/rssParser'
import storage from '../services/storage'

const router = useRouter()
const feedStore = useFeedStore()

const showDeleteDialog = ref(false)
const feedToDelete = ref(null)

// 获取所有 RSS 源
const feeds = computed(() => feedStore.getAllFeeds())

// 页面加载时获取 RSS 源
onMounted(async () => {
  await loadFeeds()
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

// 跳转到 RSS 源详情
function goToFeed(id) {
  router.push(`/feed/${id}`)
}

// 刷新单个 RSS 源
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

// 编辑 RSS 源
function editFeed(feed) {
  // TODO: 实现编辑功能
  showToast('编辑功能开发中...')
}

// 确认删除
function confirmDelete(feed) {
  feedToDelete.value = feed
  showDeleteDialog.value = true
}

// 删除 RSS 源
async function deleteFeed() {
  if (!feedToDelete.value) return

  const feed = feedToDelete.value
  feedStore.removeFeed(feed.id)
  storage.removeFeedConfig(feed.id)
  await storage.removeArticles(feed.id)
  
  showToast('已删除')
  feedToDelete.value = null
}
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

.home-page {
  min-height: 100vh;
  padding: $spacing-md;
}

.empty-state-wrapper {
  margin-top: 10vh;
}

.add-btn {
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-lg;
  background: $primary-color;
  color: $text-light;
  border-radius: $radius-md; 
  font-size: $font-size-sm;
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.feeds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-md;
}
</style>
