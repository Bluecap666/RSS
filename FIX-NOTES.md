# 🐛 已知问题修复说明

## ✅ 已修复的问题

### 1. 导入导出弹窗关不掉

**问题描述**: 
点击导入导出按钮后，弹窗无法关闭。

**修复方案**:
```vue
<!-- 添加 close-on-click-overlay 属性 -->
<van-popup 
  v-model:show="showImportExport" 
  position="bottom" 
  round 
  class="ie-popup"
  :close-on-click-overlay="true"
>
```

**关闭方式**:
1. ✅ 点击右上角 ✕ 按钮
2. ✅ 点击遮罩区域 (新增)
3. ✅ 点击导入/导出按钮后自动关闭

**测试步骤**:
```
1. 点击侧边栏底部的"导入导出"按钮
2. 弹窗从底部滑出
3. 尝试以下操作关闭:
   - 点击右上角的 ✕
   - 点击弹窗外的灰色遮罩区域
   - 点击"导出数据"或"导入数据"按钮
```

---

### 2. 切换 RSS 源后右边还是前一个源的文章

**问题描述**:
点击第二个 RSS 源后，右侧显示的还是第一个源的文章。

**根本原因**:
- FeedDetail.vue 组件复用时，没有监听路由参数变化
- `route.params.id` 改变了，但组件没有重新加载文章

**修复方案**:

```javascript
// 1. 添加 watch 监听路由变化
import { watch } from 'vue'

watch(() => route.params.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadArticles()
  }
}, { immediate: true })

// 2. 添加调试日志
async function loadArticles() {
  const feedId = route.params.id
  console.log('Loading articles for feed:', feedId)
  
  // ... 加载逻辑
}
```

**工作流程**:
```
用户点击 RSS 源 A
  ↓
MainLayout.selectFeed(A)
  ↓
router.push('/feed/A')
  ↓
FeedDetail.vue 加载 A 的文章
  ↓
控制台输出：Loading articles for feed: A
  ↓
显示 A 的文章列表

用户点击 RSS 源 B
  ↓
MainLayout.selectFeed(B)
  ↓
router.push('/feed/B')
  ↓
watch 检测到 id 变化：A → B
  ↓
FeedDetail.vue 重新加载 B 的文章
  ↓
控制台输出：Loading articles for feed: B
  ↓
显示 B 的文章列表 ✅
```

**测试步骤**:
```
1. 打开应用，默认显示第一个 RSS 源的文章
2. 点击左侧第二个 RSS 源
3. 观察控制台日志:
   - "Selecting feed: xxx"
   - "Navigated to: /feed/xxx"
   - "Loading articles for feed: xxx"
4. 检查右侧文章列表是否更新
5. 继续点击其他 RSS 源，重复测试
```

---

## 🔍 调试信息

### 控制台日志示例

**正常切换流程**:
```console
[MainLayout] Selecting feed: 1234567890
[MainLayout] Navigated to: /feed/1234567890
[FeedDetail] Loading articles for feed: 1234567890
[FeedDetail] Loaded from cache: 15 articles
[FeedDetail] Feed from store: {id: "1234567890", title: "...", items: [...]}
[FeedDetail] Loaded from store: 15 articles

// 切换到另一个源
[MainLayout] Selecting feed: 0987654321
[MainLayout] Navigated to: /feed/0987654321
[FeedDetail] Loading articles for feed: 0987654321
[FeedDetail] Loaded from cache: 20 articles
[FeedDetail] Feed from store: {id: "0987654321", title: "...", items: [...]}
[FeedDetail] Loaded from store: 20 articles
```

**如果出现问题**:
```console
❌ 问题 1: 没有看到 "Loading articles for feed" 日志
   → 说明路由跳转失败
   → 检查 router 配置

❌ 问题 2: 日志显示 "No articles found, need to fetch"
   → 说明该源还没有文章
   → 需要刷新该 RSS 源

❌ 问题 3: 日志显示了但文章没变
   → 可能是 Vue 响应式问题
   → 检查 articles.value 是否正确赋值
```

---

## 🧪 完整测试清单

### 基础功能测试

- [ ] **测试 1**: 首次打开应用
  - [ ] 默认选中第一个 RSS 源
  - [ ] 右侧显示该源的文章
  - [ ] 控制台有正确的日志

- [ ] **测试 2**: 切换 RSS 源
  - [ ] 点击第二个源
  - [ ] 右侧文章立即更新
  - [ ] 控制台显示新的 feedId
  - [ ] 文章数量正确

- [ ] **测试 3**: 连续切换
  - [ ] 快速点击多个源
  - [ ] 每次都能正确切换
  - [ ] 没有卡顿或错误

- [ ] **测试 4**: 移动端切换
  - [ ] 点击源后侧边栏自动关闭
  - [ ] 文章正确显示
  - [ ] 遮罩正确消失

### 导入导出测试

- [ ] **测试 5**: 打开导入导出弹窗
  - [ ] 点击底部"导入导出"按钮
  - [ ] 弹窗从底部滑出
  - [ ] 动画流畅

- [ ] **测试 6**: 关闭弹窗
  - [ ] 点击右上角 ✕ 可以关闭
  - [ ] 点击遮罩区域可以关闭
  - [ ] 点击按钮后自动关闭

- [ ] **测试 7**: 导出数据
  - [ ] 点击"导出数据"按钮
  - [ ] 自动下载 JSON 文件
  - [ ] 弹窗自动关闭
  - [ ] 文件名格式正确

- [ ] **测试 8**: 导入数据
  - [ ] 点击"导入数据"按钮
  - [ ] 弹出文件选择框
  - [ ] 选择备份文件后提示成功
  - [ ] 页面自动刷新

---

## 📊 预期结果

### 切换性能

**桌面端**:
```
点击 → 立即高亮 (0ms)
     → 路由跳转 (<50ms)
     → 加载文章 (<100ms)
     → 渲染完成 (<200ms)
总延迟：< 300ms
```

**移动端**:
```
点击 → 立即高亮 (0ms)
     → 侧边栏关闭 (300ms 动画)
     → 路由跳转 (<50ms)
     → 加载文章 (<100ms)
     → 渲染完成 (<200ms)
总延迟：< 600ms
```

### 用户体验

**优秀的体验**:
- ✅ 点击后立即看到高亮反馈
- ✅ 切换过程流畅无卡顿
- ✅ 文章列表立即更新
- ✅ 控制台有清晰的日志
- ✅ 弹窗可以轻松关闭

**需要避免的问题**:
- ❌ 点击后没有反应
- ❌ 文章列表不更新
- ❌ 弹窗关不掉
- ❌ 切换时有闪烁
- ❌ 控制台报错

---

## 🛠️ 如果还有问题

### 检查步骤

**Step 1**: 打开开发者工具
```
按 F12
切换到 Console 标签
```

**Step 2**: 清空控制台
```
点击禁止图标 🚫
或按 Ctrl + L
```

**Step 3**: 执行操作
```
点击不同的 RSS 源
观察控制台输出
```

**Step 4**: 分析日志
```
✅ 正常：看到完整的日志链
❌ 异常：缺少某些日志或报错
```

### 报告问题

如果问题仍然存在，请提供:

1. **控制台完整日志** (截图或复制)
2. 操作步骤详细描述
3. 浏览器类型和版本
4. 屏幕尺寸 (桌面/移动)
5. 是否有 JavaScript 错误

---

**最后更新**: 2026 年 3 月 17 日
