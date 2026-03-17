import localforage from 'localforage'

// 配置 IndexedDB
const db = localforage.createInstance({
  name: 'RSSReader',
  storeName: 'feeds'
})

// localStorage 键名
const STORAGE_KEYS = {
  FEEDS_CONFIG: 'rss_feeds_config',
  SETTINGS: 'rss_settings',
  CACHE_TIME: 'rss_cache_time'
}

class StorageService {
  // ========== RSS 源配置 (localStorage) ==========
  
  // 保存所有 RSS 源配置
  saveFeeds(feeds) {
    try {
      const feedsToSave = feeds.map(feed => ({
        ...feed,
        items: [] // 不存储文章详情，只存储配置
      }))
      localStorage.setItem(STORAGE_KEYS.FEEDS_CONFIG, JSON.stringify(feedsToSave))
      return true
    } catch (error) {
      console.error('Save feeds error:', error)
      return false
    }
  }

  // 获取所有 RSS 源配置
  getFeeds() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDS_CONFIG)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Get feeds error:', error)
      return []
    }
  }

  // 删除 RSS 源配置
  removeFeedConfig(id) {
    try {
      const feeds = this.getFeeds()
      const filtered = feeds.filter(feed => feed.id !== id)
      this.saveFeeds(filtered)
      return true
    } catch (error) {
      console.error('Remove feed error:', error)
      return false
    }
  }

  // ========== 文章详情 (IndexedDB) ==========
  
  // 保存文章列表
  async saveArticles(feedId, articles) {
    try {
      await db.setItem(`feed_${feedId}`, articles)
      return true
    } catch (error) {
      console.error('Save articles error:', error)
      return false
    }
  }

  // 获取文章列表
  async getArticles(feedId) {
    try {
      const articles = await db.getItem(`feed_${feedId}`)
      return articles || []
    } catch (error) {
      console.error('Get articles error:', error)
      return []
    }
  }

  // 删除文章
  async removeArticles(feedId) {
    try {
      await db.removeItem(`feed_${feedId}`)
      return true
    } catch (error) {
      console.error('Remove articles error:', error)
      return false
    }
  }

  // 清空所有文章缓存
  async clearAllArticles() {
    try {
      await db.clear()
      return true
    } catch (error) {
      console.error('Clear all articles error:', error)
      return false
    }
  }

  // ========== 设置 (localStorage) ==========
  
  // 保存设置
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Save settings error:', error)
      return false
    }
  }

  // 获取设置
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Get settings error:', error)
      return null
    }
  }

  // ========== 导入导出 ==========
  
  // 导出数据
  exportData() {
    try {
      const feeds = this.getFeeds()
      const settings = this.getSettings()
      
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        feeds,
        settings
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // 触发下载
      const a = document.createElement('a')
      a.href = url
      a.download = `rss-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Export error:', error)
      return false
    }
  }

  // 导入数据
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      
      if (!data.feeds || !Array.isArray(data.feeds)) {
        throw new Error('Invalid data format')
      }
      
      // 恢复 RSS 源配置
      this.saveFeeds(data.feeds)
      
      // 恢复设置
      if (data.settings) {
        this.saveSettings(data.settings)
      }
      
      return true
    } catch (error) {
      console.error('Import error:', error)
      return false
    }
  }

  // ========== 缓存管理 ==========
  
  // 设置缓存时间
  setCacheTime(feedId, timestamp) {
    try {
      const cacheTimes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHE_TIME) || '{}')
      cacheTimes[feedId] = timestamp
      localStorage.setItem(STORAGE_KEYS.CACHE_TIME, JSON.stringify(cacheTimes))
    } catch (error) {
      console.error('Set cache time error:', error)
    }
  }

  // 获取缓存时间
  getCacheTime(feedId) {
    try {
      const cacheTimes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHE_TIME) || '{}')
      return cacheTimes[feedId] || 0
    } catch (error) {
      console.error('Get cache time error:', error)
      return 0
    }
  }

  // 清除缓存时间
  clearCacheTime(feedId) {
    try {
      const cacheTimes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHE_TIME) || '{}')
      delete cacheTimes[feedId]
      localStorage.setItem(STORAGE_KEYS.CACHE_TIME, JSON.stringify(cacheTimes))
    } catch (error) {
      console.error('Clear cache time error:', error)
    }
  }
}

export default new StorageService()
