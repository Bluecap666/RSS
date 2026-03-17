<div align="center">

# 📱 RSS Reader

**一个现代化的 H5 RSS 阅读器，完美适配移动端和桌面端**

[![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[✨ 特性](#-特性) • [🚀 快速开始](#-快速开始) • [📖 使用指南](#-使用指南) • [🎨 界面预览](#-界面预览) • [🛠️ 技术栈](#️-技术栈) • [📝 更新日志](#-更新日志)

</div>

---

## ✨ 特性

<div align="center">

| 🎯 | 💪 | 🌐 | 🔒 |
|:---:|:---:|:---:|:---:|
| **响应式设计** | **强大解析** | **跨平台** | **数据安全** |
| 完美适配各种屏幕 | 支持多种 RSS 格式 | 支持 PWA 离线访问 | 本地存储保护隐私 |

| 📱 | 🎨 | ⚡ | 🔄 |
|:---:|:---:|:---:|:---:|
| **移动优先** | **精美界面** | **极速加载** | **实时更新** |
| 专为移动端优化 | 现代化 UI 设计 | 智能缓存机制 | 自动刷新内容 |

</div>

### 核心功能

- 📰 **RSS 源管理** - 轻松添加、删除、编辑您的订阅源
- 🔄 **自动解析** - 支持 RSS 1.0/2.0、Atom 1.0 等多种格式
- 💾 **数据导入导出** - 一键备份和恢复所有配置
- 🌙 **护眼模式** - 舒适的阅读体验，保护视力
- 📱 **响应式布局** - 从手机到平板完美适配
- 🚀 **极速性能** - 智能缓存，秒级加载

---

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/Bluecap666/RSS.git

# 进入项目目录
cd RSS

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 在线演示

🔗 访问：[https://bluecap666.github.io/RSS](https://bluecap666.github.io/RSS)

---

## 📖 使用指南

### 📥 添加 RSS 源

1. 点击侧边栏底部的 **"➕ 添加 RSS 源"** 按钮
2. 输入 RSS 地址（如：`https://example.com/rss`）
3. 系统自动解析并保存
4. ✅ 完成！现在可以开始阅读了

### 📤 导入导出数据

#### 导出数据
```
侧边栏 → 📤 导入导出 → 导出数据
→ 自动下载 JSON 备份文件
```

#### 导入数据
```
侧边栏 → 📤 导入导出 → 导入数据
→ 选择备份文件 → 自动恢复
```

### 🎯 快捷操作

| 操作 | 桌面端 | 移动端 |
|:---|:---:|:---:|
| 展开/折叠侧边栏 | 点击 ⟷ 按钮 | 点击 ☰ 菜单 |
| 切换 RSS 源 | 点击左侧列表 | 点击左侧列表 |
| 刷新源 | 点击 🔄 图标 | 点击 🔄 图标 |
| 删除源 | 点击 🗑️ 图标 | 点击 🗑️ 图标 |

---

## 🎨 界面预览

### 📱 桌面端

<div align="center">

**默认视图**
```
┌─────────────────────────────────────┐
│ ☰ RSS 源                    ⟷     │
├───────────┬─────────────────────────┤
│           │                         │
│  RSS 源 1 │   📰 文章标题          │
│  RSS 源 2 │   📄 文章摘要...       │
│  RSS 源 3 │                         │
│           │   📰 文章标题          │
│           │   📄 文章摘要...       │
│           │                         │
└───────────┴─────────────────────────┘
```

**折叠视图**
```
┌─────────────────────────────────────┐
│ ☰ RSS 源                    ⟷     │
├────┬────────────────────────────────┤
│ R  │                                │
│ S  │    更宽的文章显示区域         │
│ S  │                                │
│    │                                │
└────┴────────────────────────────────┘
```

</div>

### 📱 移动端

<div align="center">

**收起状态** | **展开状态**
:---:|:---:
☰ 文章列表 | ☰ RSS 源
全屏显示 | 侧边栏滑出
单列布局 | 完整功能

</div>

---

## 🛠️ 技术栈

### 前端框架

<div align="center">

[![Vue 3](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.2.0-4FC08D?logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1.0-ffd54f?logo=pinia&logoColor=white)](https://pinia.vuejs.org/)

</div>

### UI 组件

<div align="center">

[![Vant](https://img.shields.io/badge/Vant-4.7.0-00b894?logo=android&logoColor=white)](https://vant-ui.github.io/)
[![SCSS](https://img.shields.io/badge/SCSS-Latest-cd6799?logo=sass&logoColor=white)](https://sass-lang.com/)

</div>

### 核心库

<div align="center">

[![LocalForage](https://img.shields.io/badge/LocalForage-1.10.0-3a86ff?logo=database&logoColor=white)](https://localforage.dev/)
[![Fast XML Parser](https://img.shields.io/badge/Fast_XML_Parser-Latest-orange?logo=xml&logoColor=white)](https://github.com/NaturalIntelligence/fast-xml-parser)

</div>

### 技术亮点

```
✅ Vue 3 Composition API
✅ Vite 5.0 极速构建
✅ Pinia 状态管理
✅ IndexedDB 本地存储
✅ SCSS 模块化样式
✅ 响应式布局
✅ PWA 支持
```

---

## 📂 项目结构

```
RSS/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── MainLayout.vue      # 主布局
│   │   ├── ArticleCard.vue     # 文章卡片
│   │   └── FeedCard.vue        # RSS 源卡片
│   ├── views/             # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── AddFeed.vue         # 添加源
│   │   └── FeedDetail.vue      # 源详情
│   ├── stores/            # 状态管理
│   │   └── feed.js             # RSS 源 store
│   ├── services/          # 服务层
│   │   ├── rssParser.js        # RSS 解析
│   │   └── storage.js          # 数据存储
│   ├── styles/            # 全局样式
│   │   ├── variables.scss      # 变量
│   │   └── mixins.scss         # 混入
│   ├── utils/             # 工具函数
│   └── router/            # 路由配置
├── public/                # 静态资源
├── package.json           # 项目配置
└── vite.config.js         # Vite 配置
```

---

## 🔧 配置说明

### 环境变量

创建 `.env` 文件:

```bash
# API 基础地址 (可选)
VITE_API_BASE_URL=https://api.example.com

# 应用标题
VITE_APP_TITLE=RSS Reader

# 版本号
VITE_APP_VERSION=1.0.0
```

### RSS 代理配置

默认的 RSS 解析使用多级代理策略:

```javascript
优先级顺序:
1. RSS2JSON      - 专业 RSS 转换服务
2. AllOrigins    - 通用 CORS 代理
3. CORSProxy.io  - 备用代理
4. CodeTabs      - 备用代理
5. ThingProxy    - 备用代理
6. Zuplo         - 备用代理
7. ProxyCors     - 备用代理
```

---

## 📝 更新日志

### v1.0.0 (2026-03-17)

#### 🎉 新功能
- ✨ 全新的侧边栏布局设计
- 📱 完美的移动端适配
- 🔄 RSS 源导入导出功能
- 🎨 现代化的 UI 界面
- 🌙 护眼模式支持

#### 🐛 Bug 修复
- 🐛 修复移动端侧边栏显示问题
- 🐛 修复 RSS 源切换文章不更新的问题
- 🐛 修复导入导出弹窗无法关闭的问题

#### ⚡ 性能优化
- 🚀 优化 RSS 解析速度
- 💾 改进数据缓存机制
- 📦 减小打包体积

#### 📚 文档更新
- 📖 完善使用指南
- 📖 添加故障排除文档
- 📖 新增 API 文档

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

### 开发流程

```bash
# 1. Fork 项目
Fork → Clone

# 2. 创建分支
git checkout -b feature/your-feature

# 3. 开发并提交
git add .
git commit -m "✨ feat: add new feature"

# 4. 推送分支
git push origin feature/your-feature

# 5. 创建 PR
GitHub → New Pull Request
```

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```
✨ feat: 新功能
🐛 fix: Bug 修复
📝 docs: 文档更新
🎨 style: 代码格式
♻️ refactor: 重构
⚡ perf: 性能优化
🧪 test: 测试
🔧 chore: 构建/工具
```

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源

```
MIT License

Copyright (c) 2026 Bluecap666

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 致谢

感谢以下开源项目:

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vant](https://vant-ui.github.io/) - 轻量、可靠的移动端组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 3 官方状态管理库
- [LocalForage](https://localforage.dev/) - 本地存储封装库

---

## 📮 联系方式

<div align="center">

**作者**: Bluecap666

[![GitHub](https://img.shields.io/badge/GitHub-@Bluecap666-181717?logo=github&logoColor=white)](https://github.com/Bluecap666)
[![Email](https://img.shields.io/badge/Email-Contact-blue?logo=microsoft-outlook&logoColor=white)](mailto:contact@example.com)

**如果这个项目对你有帮助，请给一个 ⭐ Star!**

</div>

---

<div align="center">

Made with ❤️ by Bluecap666

[返回顶部](#rss-reader)

</div>
