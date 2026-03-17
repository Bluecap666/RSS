import { XMLParser } from 'fast-xml-parser'

// CORS 代理服务 (按优先级排序，优先使用国内可用的)
const CORS_PROXIES = [
  {
    url: 'https://rss2json.com/api.json?rss_url=',
    type: 'rss2json',  // 专门的 RSS 转换服务
    name: 'RSS2JSON'
  },
  {
    url: 'https://api.allorigins.win/get?url=',
    type: 'json',  // 返回 JSON 格式
    name: 'AllOrigins'
  },
  {
    url: 'https://corsproxy.io/?',
    type: 'text',
    name: 'CORSProxy'
  },
  {
    url: 'https://api.codetabs.com/v1/proxy?quest=',
    type: 'text',
    name: 'CodeTabs'
  },
  {
    url: 'https://thingproxy.freeboard.io/fetch/',
    type: 'text',
    name: 'ThingProxy'
  },
  {
    url: 'https://zuplo.link/cors-anywhere/',
    type: 'text',
    name: 'Zuplo'
  },
  {
    url: 'https://proxy-cors.com/',
    type: 'text',
    name: 'ProxyCors'
  }
]

class RSSParser {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true,
      allowBooleanAttributes: true,
      removeNSPrefix: true  // 移除命名空间前缀
    })
  }

  // 获取 RSS 内容 (处理 CORS)
  async fetchRSS(url) {
    let lastError
    let successCount = 0
    
    console.log('📡 Starting RSS fetch for:', url)
    
    // 方案 1: 先尝试直接访问 (如果浏览器允许)
    try {
      console.log('🔍 Trying direct access...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const text = await response.text()
        if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<rdf:'))) {
          console.log('✅ Direct access success! Content length:', text.length)
          return text
        }
      }
      
      // 如果直接访问返回非 200 状态码，记录但不抛出错误，继续尝试代理
      if (!response.ok) {
        console.warn(`⚠️ Direct access returned ${response.status}, trying proxies...`)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏱️ Direct access timeout after 30s, trying proxies...')
      } else {
        console.warn('❌ Direct access failed (CORS likely):', error.message)
      }
      lastError = error
    }
    
    // 方案 2: 直接访问失败时，使用 CORS 代理
    console.log(`🔄 Trying ${CORS_PROXIES.length} CORS proxies...`)
    
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      const proxy = CORS_PROXIES[i]
      try {
        console.log(`[${i + 1}/${CORS_PROXIES.length}] 🌐 Trying: ${proxy.name}`)
        
        // 添加超时控制 (30 秒)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)
        
        const proxyUrl = proxy.url + encodeURIComponent(url)
        const startTime = Date.now()
        
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          }
        })
        clearTimeout(timeoutId)
        
        const duration = Date.now() - startTime
        
        if (!response.ok) {
          const statusText = response.status === 522 ? 'Connection Timeout' : response.statusText
          throw new Error(`${proxy.name} returned ${response.status} (${statusText}) in ${duration}ms`)
        }
        
        let text
        if (proxy.type === 'json') {
          const data = await response.json()
          text = data.contents || data.data
        } else if (proxy.type === 'rss2json') {
          // RSS2JSON 返回特殊格式，需要转换
          const data = await response.json()
          if (data.status === 'error') {
            throw new Error(data.message || 'RSS2JSON error')
          }
          // 转换为标准 XML 格式
          text = this.convertRSS2JSONToXML(data)
        } else {
          text = await response.text()
        }
        
        if (text && text.trim().length > 0) {
          successCount++
          console.log(`✅ ${proxy.name} success! Content length: ${text.length}, time: ${duration}ms`)
          return text
        }
        
        throw new Error(`${proxy.name} returned empty content`)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn(`⏱️ ${proxy.name} timeout after 30s`)
        } else {
          console.warn(`❌ ${proxy.name} failed:`, error.message)
        }
        lastError = error
      }
    }
    
    // 所有方法都失败
    console.error('💥 All access methods failed!')
    console.error('Direct access error:', lastError?.message)
    console.error('Total proxies tried:', CORS_PROXIES.length)
    console.error('Successful proxies:', successCount)
    
    throw lastError || new Error('All access methods failed')
  }

  // 将 RSS2JSON 格式转换为 XML
  convertRSS2JSONToXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n'
    xml += `<title>${data.feed?.title || ''}</title>\n`
    xml += `<link>${data.feed?.link || ''}</link>\n`
    xml += `<description>${data.feed?.description || ''}</description>\n`
    
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach(item => {
        xml += '<item>\n'
        xml += `<title>${item.title || ''}</title>\n`
        xml += `<link>${item.link || ''}</link>\n`
        xml += `<description><![CDATA[${item.description || ''}]]></description>\n`
        xml += `<pubDate>${item.pubDate || ''}</pubDate>\n`
        xml += `<author>${item.author || ''}</author>\n`
        if (item.content) {
          xml += `<content:encoded><![CDATA[${item.content}]]></content:encoded>\n`
        }
        xml += '</item>\n'
      })
    }
    
    xml += '</channel>\n</rss>'
    return xml
  }

  // 解析 RSS/Atom 源
  async parse(url) {
    try {
      const xml = await this.fetchRSS(url)
      
      // 验证 XML 内容
      if (!xml || xml.trim().length === 0) {
        throw new Error('Empty response from server')
      }
      
      // 检查是否是有效的 XML
      if (!xml.includes('<')) {
        throw new Error('Invalid XML content')
      }
      
      const result = this.parser.parse(xml)
      
      console.log('Parsed result:', result)
      
      // 检测并解析不同格式
      if (result.rss) {
        return this.parseRSS2(result.rss, url)
      } else if (result.feed) {
        return this.parseAtom(result.feed, url)
      } else if (result['rdf:RDF'] || result.RDF) {
        return this.parseRSS1(result['rdf:RDF'] || result.RDF, url)
      } else {
        console.error('Unknown format:', Object.keys(result))
        throw new Error('Unknown RSS format detected')
      }
    } catch (error) {
      console.error('RSS Parse Error:', error.message)
      throw error
    }
  }

  // 解析 RSS 2.0
  parseRSS2(data, url) {
    const channel = data.channel
    
    const feed = {
      title: this.getText(channel.title),
      description: this.getText(channel.description),
      link: this.getText(channel.link),
      imageUrl: channel.image?.url || null,
      url: url,
      items: []
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item]
    
    feed.items = items.map(item => ({
      id: item.guid?.['#text'] || this.getText(item.link),
      title: this.getText(item.title),
      link: this.getText(item.link),
      description: this.getText(item.description),
      content: item.content?.['#text'] || item['content:encoded'] || null,
      pubDate: this.parseDate(item.pubDate),
      author: this.getText(item.author) || this.getText(item['dc:creator']) || null,
      image: this.extractImage(item),
      enclosure: item.enclosure?.['@_url'] ? {
        url: item.enclosure['@_url'],
        type: item.enclosure['@_type'] || 'image/jpeg'
      } : null
    }))

    return feed
  }

  // 解析 Atom 1.0
  parseAtom(data, url) {
    const feed = {
      title: this.getText(data.title),
      description: this.getText(data.subtitle) || '',
      link: Array.isArray(data.link) 
        ? data.link.find(l => l['@_rel'] === 'alternate')?.['@_href'] || data.link[0]['@_href']
        : data.link['@_href'],
      imageUrl: data.logo || data.icon || null,
      url: url,
      items: []
    }

    const entries = Array.isArray(data.entry) ? data.entry : [data.entry]
    
    feed.items = entries.map(entry => ({
      id: entry.id?.['#text'] || this.getText(entry.link?.['@_href']),
      title: this.getText(entry.title),
      link: this.getText(entry.link?.['@_href']),
      description: this.getText(entry.summary),
      content: this.getText(entry.content),
      pubDate: this.parseDate(entry.published || entry.updated),
      author: Array.isArray(entry.author) 
        ? entry.author[0]?.name?.['#text'] 
        : entry.author?.name?.['#text'] || null,
      image: this.extractImage(entry)
    }))

    return feed
  }

  // 解析 RSS 1.0
  parseRSS1(data, url) {
    const channel = data.channel
    
    const feed = {
      title: this.getText(channel.title),
      description: this.getText(channel.description),
      link: this.getText(channel.link),
      imageUrl: channel.image?.url || null,
      url: url,
      items: []
    }

    const items = Array.isArray(data.item) ? data.item : [data.item]
    
    feed.items = items.map(item => ({
      id: this.getText(item.link),
      title: this.getText(item.title),
      link: this.getText(item.link),
      description: this.getText(item.description),
      content: item.content?.['#text'] || null,
      pubDate: this.parseDate(item['dc:date']),
      author: this.getText(item['dc:creator']) || null,
      image: this.extractImage(item)
    }))

    return feed
  }

  // 提取文本内容
  getText(value) {
    if (!value) return ''
    if (typeof value === 'string') return value.trim()
    if (typeof value === 'object') {
      return value['#text']?.trim() || ''
    }
    return ''
  }

  // 解析日期
  parseDate(dateStr) {
    if (!dateStr) return Date.now()
    const timestamp = Date.parse(dateStr)
    return isNaN(timestamp) ? Date.now() : timestamp
  }

  // 从内容中提取图片
  extractImage(item) {
    // 检查 enclosure
    if (item.enclosure?.['@_url']) {
      return item.enclosure['@_url']
    }

    // 检查 media:content
    if (item['media:content']?.['@_url']) {
      return item['media:content']['@_url']
    }

    // 检查 media:thumbnail
    if (item['media:thumbnail']?.['@_url']) {
      return item['media:thumbnail']['@_url']
    }

    // 从描述中提取第一张图片
    const content = item.description || item.content?.['#text']
    if (content) {
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i)
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1]
      }
    }

    return null
  }
}

export default new RSSParser()
