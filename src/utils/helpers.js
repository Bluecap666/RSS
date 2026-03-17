// 格式化日期
export function formatDate(timestamp, format = 'auto') {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 自动模式：根据时间差选择格式
  if (format === 'auto') {
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  // 完整格式
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  if (format === 'full') {
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  if (year === now.getFullYear()) {
    return `${month}-${day} ${hours}:${minutes}`
  }

  return `${year}-${month}-${day}`
}

// 格式化相对时间
export function formatRelativeTime(timestamp) {
  return formatDate(timestamp, 'auto')
}

// 提取纯文本 (去除 HTML 标签)
export function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// 截断文本
export function truncate(text, length = 100, suffix = '...') {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + suffix
}

// 生成唯一 ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 验证 URL
export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// 验证 RSS URL
export async function isValidRSSUrl(url) {
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`)
    if (!response.ok) return false
    
    const text = await response.text()
    return text.includes('<rss') || text.includes('<feed') || text.includes('<rdf:')
  } catch (_) {
    return false
  }
}

// 防抖函数
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export function throttle(func, limit = 300) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 图片懒加载 Intersection Observer
export function lazyLoadImage(imgElement, srcAttribute = 'data-src') {
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.getAttribute(srcAttribute)
          if (src) {
            img.src = src
            img.removeAttribute(srcAttribute)
          }
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px'
    })

    imgObserver.observe(imgElement)
  } else {
    // 不支持 Intersection Observer 的浏览器直接加载
    const src = imgElement.getAttribute(srcAttribute)
    if (src) {
      imgElement.src = src
      imgElement.removeAttribute(srcAttribute)
    }
  }
}

// 获取文章阅读时间 (分钟)
export function getReadingTime(content) {
  if (!content) return 1
  const words = stripHtml(content).split(/\s+/).length
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const totalWords = words + chineseChars
  return Math.ceil(totalWords / 300) // 假设每分钟阅读 300 字
}

// 主题切换
export function applyTheme(theme) {
  const themes = {
    light: {
      bg: '#F5F7FA',
      card: '#FFFFFF',
      text: '#333333',
      secondary: '#666666'
    },
    dark: {
      bg: '#1A1A1A',
      card: '#2C2C2C',
      text: '#E0E0E0',
      secondary: '#999999'
    },
    sepia: {
      bg: '#F4ECD8',
      card: '#F8E7D9',
      text: '#5B4636',
      secondary: '#8B7355'
    }
  }

  const selectedTheme = themes[theme] || themes.light
  const root = document.documentElement

  Object.entries(selectedTheme).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value)
  })

  root.setAttribute('data-theme', theme)
}
