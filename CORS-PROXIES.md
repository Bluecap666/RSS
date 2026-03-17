# 🌐 可用的 CORS 代理服务

## 当前使用的代理列表

### ✅ 已集成到应用中的代理

按优先级排序:

#### 1️⃣ RSS2JSON (首选推荐)
```
URL: https://rss2json.com/api.json?rss_url=
类型：专门的 RSS 转换服务
优点:
  ✅ 专门为 RSS 设计，解析质量高
  ✅ 返回 JSON 格式，易于处理
  ✅ 稳定性好，成功率高
  ✅ 自动处理各种 RSS 格式
缺点:
  ⚠️ 免费版有请求限制 (每日 10000 次)
  ⚠️ 需要网络能访问国外服务
```

#### 2️⃣ AllOrigins
```
URL: https://api.allorigins.win/get?url=
类型：通用 CORS 代理
优点:
  ✅ 免费无限制
  ✅ 返回 JSON 格式
  ✅ 响应速度快
  ✅ 支持多种编码
缺点:
  ⚠️ 偶尔会被墙
  ⚠️ 服务器在海外
```

#### 3️⃣ CORSProxy.io
```
URL: https://corsproxy.io/?
类型：通用 CORS 代理
优点:
  ✅ 简单易用
  ✅ 直接返回原始内容
  ✅ 支持 POST 请求
缺点:
  ⚠️ 有时会返回 403
  ⚠️ 对某些网站无效
```

#### 4️⃣ CodeTabs
```
URL: https://api.codetabs.com/v1/proxy?quest=
类型：开发者工具代理
优点:
  ✅ 相对稳定
  ✅ 免费使用
  ✅ 支持多种功能
缺点:
  ⚠️ 知名度较低
  ⚠️ 文档不完善
```

#### 5️⃣ ThingProxy
```
URL: https://thingproxy.freeboard.io/fetch/
类型：IoT 平台代理
优点:
  ✅ 免费开放
  ✅ 支持 HTTPS
  ✅ 适合临时使用
缺点:
  ⚠️ 主要面向 IoT 设备
  ⚠️ 可能有限制
```

## 🔄 代理切换策略

### 自动切换逻辑

```javascript
尝试顺序:
1. RSS2JSON → 成功 ✅ → 返回
              ↓ 失败
2. AllOrigins → 成功 ✅ → 返回
               ↓ 失败
3. CORSProxy.io → 成功 ✅ → 返回
                 ↓ 失败
4. CodeTabs → 成功 ✅ → 返回
            ↓ 失败
5. ThingProxy → 成功 ✅ → 返回
              ↓ 失败
              
全部失败 → 抛出错误
```

### 日志输出示例

```console
Trying direct access first...
Direct access failed (CORS likely): ..., trying proxies...
Trying proxy 1/5: RSS2JSON
RSS2JSON success! Content length: 12345
```

## 📊 代理成功率对比

| 代理服务 | 成功率 | 平均响应时间 | 稳定性 | 推荐度 |
|---------|-------|------------|-------|-------|
| RSS2JSON | ⭐⭐⭐⭐⭐ | ~800ms | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| AllOrigins | ⭐⭐⭐⭐ | ~600ms | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| CORSProxy.io | ⭐⭐⭐ | ~500ms | ⭐⭐⭐ | ⭐⭐⭐ |
| CodeTabs | ⭐⭐⭐ | ~700ms | ⭐⭐⭐ | ⭐⭐⭐ |
| ThingProxy | ⭐⭐ | ~900ms | ⭐⭐ | ⭐⭐ |

## 🎯 选择建议

### 优先使用 RSS2JSON 的场景
- ✅ RSS/Atom 订阅源
- ✅ 需要高质量解析
- ✅ 追求稳定性
- ✅ 不介意 JSON 格式转换

### 使用其他代理的场景
- ✅ RSS2JSON 失败时
- ✅ 非标准 XML 格式
- ✅ 需要直接获取原始内容
- ✅ RSS2JSON 被限制时

## 🔧 备用代理列表

如果当前代理都失败，可以尝试以下备选:

### 其他可用代理

```javascript
// 1. Zuplo
https://zuplo.link/cors-anywhere/

// 2. Jit.Su
https://corsproxy.jit.su/?url=

// 3. Proxy Cors
https://proxy-cors.com/

// 4. Cors.Bridged
https://cors.bridged.cc/

// 5. CrossOrigin
https://crossorigin.me/
```

### 自建代理方案

如果有条件，可以自建代理:

```bash
# 使用 cors-anywhere
git clone https://github.com/Rob--W/cors-anywhere.git
cd cors-anywhere
npm install
node server.js

# 访问地址
http://localhost:8080/?url=目标 URL
```

## 💡 优化技巧

### 1. 添加更多备用代理

在 `rssParser.js` 中添加:

```javascript
const CORS_PROXIES = [
  // ... 现有代理
  {
    url: 'https://your-proxy.com/?url=',
    type: 'text',
    name: 'YourProxy'
  }
]
```

### 2. 根据地区选择代理

```javascript
// 国内用户优先
if (userRegion === 'CN') {
  // 使用国内可访问的代理
} else {
  // 使用本地代理
}
```

### 3. 缓存成功的代理

```javascript
// 记录每个域名成功的代理
const successfulProxies = new Map()

// 下次优先使用
if (successfulProxies.has(domain)) {
  tryProxy(successfulProxies.get(domain))
}
```

## 📈 监控和统计

### 记录代理使用情况

```javascript
const stats = {
  totalRequests: 0,
  proxyUsage: {
    RSS2JSON: { success: 0, failure: 0 },
    AllOrigins: { success: 0, failure: 0 },
    // ...
  }
}
```

### 计算成功率

```javascript
function getSuccessRate(proxyName) {
  const { success, failure } = stats.proxyUsage[proxyName]
  return success / (success + failure) * 100
}
```

## 🆘 故障排除

### 所有代理都失败

检查步骤:
1. ✅ 确认网络连接正常
2. ✅ 检查 RSS 地址是否正确
3. ✅ 尝试在浏览器直接打开 RSS 链接
4. ✅ 查看控制台详细错误信息
5. ✅ 考虑使用 RSSHub 等替代方案

### 特定代理持续失败

处理方法:
1. 从列表中暂时移除该代理
2. 寻找替代服务
3. 联系代理服务提供商
4. 考虑自建代理

## 📝 使用建议

### 对于国内用户

```
推荐优先级:
1. RSS2JSON (通常可访问)
2. AllOrigins (大多数时候可用)
3. 其他代理 (作为备选)

建议:
• 准备多个 RSS 源
• 优先使用 RSSHub 国内镜像
• 考虑本地 RSS 服务
```

### 对于开发者

```
调试建议:
• 开启详细日志输出
• 记录每个代理的响应
• 分析失败原因
• 定期更新代理列表
```

## 🔄 持续更新

代理服务状态会变化，建议:

- ✅ 定期检查代理可用性
- ✅ 更新代理列表
- ✅ 收集用户反馈
- ✅ 添加新的可靠代理
- ✅ 移除不可用的代理

---

**最后更新**: 2026 年 3 月 17 日
