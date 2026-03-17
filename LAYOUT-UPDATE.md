# 🎨 新版侧边栏布局说明

## ✨ 布局设计

### 整体结构

```
┌─────────────────────────────────────────┐
│ ☰ RSS 源                    ⟷         │  ← 头部
├───────────┬─────────────────────────────┤
│           │                             │
│  侧边栏   │      主内容区域             │
│           │                             │
│ • RSS 源 1│   选中源的文章列表          │
│ • RSS 源 2│   (网格布局)                │
│ • RSS 源 3│                             │
│           │                             │
├───────────┴─────────────────────────────┤
│ [+ 添加 RSS 源] [📤 导入导出]           │  ← 底部
└─────────────────────────────────────────┘
```

### 核心特性

**左侧侧边栏**:
- ✅ 显示所有 RSS 源列表
- ✅ 点击切换不同源的文章
- ✅ 可折叠 (60px / 280px)
- ✅ 移动端自动隐藏/展开

**右侧主内容区**:
- ✅ 显示选中源的文章列表
- ✅ 网格布局展示文章卡片
- ✅ 响应式适配各种屏幕
- ✅ 自动加载选中的源

## 🎯 使用流程

### 首次打开应用

```
1. 页面加载
   ↓
2. 自动读取 RSS 源配置
   ↓
3. 默认选中第一个 RSS 源
   ↓
4. 右侧显示该源的所有文章
```

### 切换 RSS 源

```
1. 点击左侧不同的 RSS 源
   ↓
2. 高亮当前选中的源
   ↓
3. 右侧自动切换到对应文章列表
   ↓
4. 移动端自动关闭侧边栏
```

### 管理 RSS 源

**刷新**:
```
点击源卡片上的 🔄 图标
→ 重新获取最新文章
→ 更新文章数量显示
```

**删除**:
```
点击源卡片上的 🗑️ 图标
→ 确认删除对话框
→ 删除配置和缓存文章
```

**添加**:
```
点击底部"添加 RSS 源"按钮
→ 跳转到添加页面
→ 输入 RSS 地址
→ 解析并保存
```

## 📱 响应式设计

### 桌面端 (>768px)

**默认状态**:
```
┌──────────────────────────────┐
│ ☰ RSS 源              ⟷    │
├─────┬────────────────────────┤
│RSS  │  文章列表 (网格)       │
│列表 │  - 多列显示            │
│     │  - 海报式卡片          │
│     │                        │
└─────┴────────────────────────┘
```

**折叠状态**:
```
┌──────────────────────────────┐
│ ☰ RSS 源              ⟷    │
├───┬──────────────────────────┤
│R  │  文章列表 (更宽)         │
│S  │                          │
│S  │                          │
│   │                          │
└───┴──────────────────────────┘
```

### 移动端 (≤768px)

**默认状态**:
```
┌────────────────────┐
│ ☰ 标题             │  ← 菜单按钮
├────────────────────┤
│                    │
│   文章列表         │  ← 全屏显示
│   (单列布局)       │
│                    │
└────────────────────┘
```

**展开侧边栏**:
```
┌────────────────────┐
│ ☰ RSS 源     ✕   │  ← 遮罩层
├─────────┬──────────┤
│ 遮罩    │          │
│ • RSS1  │  主内容  │
│ • RSS2  │  (变暗)  │
│ [+]     │          │
│ [📤]    │          │
└─────────┴──────────┘
```

## 🎨 样式细节

### 侧边栏样式

**正常状态 (280px)**:
```scss
.sidebar {
  width: 280px;
  background: #FFFFFF;
  border-right: 1px solid #E0E0E0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  
  .feed-item {
    padding: 12px;
    border-radius: 8px;
    
    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-left: 3px solid #4A90E2;
    }
  }
}
```

**折叠状态 (60px)**:
```scss
.sidebar.collapsed {
  width: 60px;
  
  .feed-item {
    text-align: center;
    
    .feed-item__title {
      font-size: 12px;
      @include text-truncate(1);
    }
  }
}
```

**移动端状态**:
```scss
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px !important;
    box-shadow: 4px 0 12px rgba(0,0,0,0.1);
    
    &.mobile-hidden {
      transform: translateX(-100%);
    }
  }
}
```

### 文章列表样式

**桌面端网格**:
```scss
.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
```

**移动端单列**:
```scss
@media (max-width: 768px) {
  .articles-list {
    grid-template-columns: 1fr;
  }
}
```

## 🔧 技术实现

### 组件结构

```vue
MainLayout
├── Sidebar (侧边栏)
│   ├── Header (头部)
│   │   ├── Menu Button (☰ 菜单按钮)
│   │   ├── Title (RSS 源)
│   │   └── Collapse Button (⟷ 折叠按钮 - 仅桌面端)
│   ├── Content (内容)
│   │   ├── Empty State (空状态)
│   │   ├── Loading State (加载中)
│   │   └── Feeds List (RSS 源列表)
│   └── Footer (底部)
│       ├── Add Feed Button (添加 RSS 源)
│       └── Import/Export Button (导入导出)
└── MainContent (主内容区)
    └── slot (插槽 - 路由视图)
```

### 状态管理

```javascript
const sidebarCollapsed = ref(false)  // 折叠状态
const showOverlay = ref(false)       // 遮罩状态
const currentFeedId = ref(null)      // 当前选中的源 ID
const isMobile = computed(() => window.innerWidth < 768)
```

### 生命周期

```javascript
onMounted(async () => {
  // 1. 加载 RSS 源
  await loadFeeds()
  
  // 2. 监听窗口变化
  window.addEventListener('resize', handleResize)
  handleResize()
  
  // 3. 默认选中第一个源
  setTimeout(() => {
    if (feeds.value.length > 0 && !currentFeedId.value) {
      selectFeed(feeds.value[0].id)
    }
  }, 500)
})
```

### 关键函数

**选择 RSS 源**:
```javascript
function selectFeed(feedId) {
  currentFeedId.value = feedId
  router.push(`/feed/${feedId}`)  // 跳转到文章列表
  
  // 移动端自动关闭侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
    showOverlay.value = false
  }
}
```

**切换侧边栏**:
```javascript
function toggleSidebar() {
  if (isMobile.value) {
    // 移动端：控制遮罩
    showOverlay.value = !showOverlay.value
    sidebarCollapsed.value = !showOverlay.value
  } else {
    // 桌面端：直接折叠
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}
```

## 💡 交互优化

### 视觉反馈

**选中高亮**:
- 蓝色背景 (透明度 10%)
- 左侧蓝色边框 (3px)
- 标题加粗显示

**悬停效果**:
- 浅灰色背景
- 操作按钮渐显 (透明度 0 → 1)
- 平滑过渡动画

**点击效果**:
- 轻微缩放 (scale: 0.98)
- 阴影加深
- 立即响应

### 动画效果

**侧边栏展开/折叠**:
```scss
transition: all 0.3s ease;
```

**遮罩淡入淡出**:
```scss
opacity: 0;
transition: opacity 0.3s ease;
```

**按钮悬停**:
```scss
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0,0,0,0.1);
```

## 🎯 用户体验提升

### 桌面端

✅ **常驻侧边栏** - 不需要频繁开关
✅ **可折叠设计** - 节省空间显示更多内容
✅ **快速切换** - 点击即可切换不同源
✅ **快捷键支持** - (计划中)

### 移动端

✅ **手势友好** - 大按钮，易触摸
✅ **自动关闭** - 选择后自动收起
✅ **遮罩提示** - 明确当前焦点区域
✅ **流畅动画** - 优秀的视觉体验

## 📊 性能优化

### 已实现

- ✅ 虚拟滚动 (长列表时)
- ✅ 按需加载文章
- ✅ 缓存机制 (IndexedDB)
- ✅ 防抖节流
- ✅ CSS 硬件加速

### 计划中

- 🔲 图片懒加载优化
- 🔲 Service Worker 缓存
- 🔲 预加载下一页数据
- 🔲 键盘导航支持

## 🆚 对比优势

### vs 旧版布局

**新版侧边栏布局**:
```
✅ 空间利用率更高
✅ 层次结构更清晰
✅ 切换源更方便
✅ 更符合阅读器习惯
```

**旧版顶部导航**:
```
❌ RSS 源占用顶部空间
❌ 需要额外页面查看源列表
❌ 切换源需要返回上一页
❌ 不符合传统 RSS 阅读器习惯
```

## 🐛 已知问题

### 问题 1: 移动端菜单按钮不显示

**原因**: `mobile-hidden` 类导致完全隐藏

**解决**: 
- 使用 `!important` 强制宽度
- 通过 `transform` 控制显示/隐藏
- 添加阴影增强立体感

### 问题 2: 第一次打开可能不选中任何源

**原因**: 数据加载时序问题

**解决**:
- 添加 500ms 延迟
- 检查 `currentFeedId` 是否为空
- 确保至少有一个 RSS 源

## 📞 需要帮助？

如果遇到布局相关问题:

1. **检查控制台错误**
   - F12 → Console
   - 查看详细错误信息

2. **提供以下信息**:
   - 设备和浏览器型号
   - 屏幕尺寸
   - 问题截图
   - 复现步骤

---

**最后更新**: 2026 年 3 月 17 日
