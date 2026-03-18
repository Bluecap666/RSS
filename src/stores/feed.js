import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedStore = defineStore('feed', () => {
  const feeds = ref([])
  const currentFeed = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 获取所有 RSS 源
  const getAllFeeds = () => {
    return feeds.value
  }

  // 根据 ID 获取 RSS 源
  const getFeedById = (id) => {
    return feeds.value.find(feed => feed.id === id)
  }

  // 根据 URL 检查是否存在
  const findFeedByUrl = (url) => {
    return feeds.value.find(feed => feed.url === url)
  }

  // 添加 RSS 源
  const addFeed = (feedData) => {
    const newFeed = {
      ...feedData,
      id: Date.now().toString(),
      lastUpdate: Date.now(),
      items: []
    }
    feeds.value.unshift(newFeed)
    return newFeed
  }

  // 删除 RSS 源
  const removeFeed = (id) => {
    const index = feeds.value.findIndex(feed => feed.id === id)
    if (index !== -1) {
      feeds.value.splice(index, 1)
      return true
    }
    return false
  }

  // 更新 RSS 源
  const updateFeed = (id, updates) => {
    const index = feeds.value.findIndex(feed => feed.id === id)
    if (index !== -1) {
      feeds.value[index] = { ...feeds.value[index], ...updates }
      return feeds.value[index]
    }
    return null
  }

  // 更新 RSS 源的文章列表
  const updateFeedItems = (id, items) => {
    const index = feeds.value.findIndex(feed => feed.id === id)
    if (index !== -1) {
      feeds.value[index].items = items
      feeds.value[index].lastUpdate = Date.now()
      return feeds.value[index]
    }
    return null
  }

  // 设置当前选中的 RSS 源
  const setCurrentFeed = (feed) => {
    currentFeed.value = feed
  }

  // 导入 RSS 源
  const importFeeds = (importedFeeds) => {
    feeds.value = [...feeds.value, ...importedFeeds]
  }

  // 清空所有 RSS 源
  const clearAllFeeds = () => {
    feeds.value = []
    currentFeed.value = null
  }

  return {
    feeds,
    currentFeed,
    loading,
    error,
    getAllFeeds,
    getFeedById,
    findFeedByUrl,
    addFeed,
    removeFeed,
    updateFeed,
    updateFeedItems,
    setCurrentFeed,
    importFeeds,
    clearAllFeeds
  }
})
