#!/bin/bash

# 🚀 RSS Reader 一键部署脚本

echo "╔═══════════════════════════════════════╗"
echo "║     📱 RSS Reader 部署工具           ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# 步骤 1: 检查 Node.js
echo "📦 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi
echo "✅ Node.js $(node -v) 已安装"
echo ""

# 步骤 2: 检查 npm
echo "📦 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi
echo "✅ npm $(npm -v) 已安装"
echo ""

# 步骤 3: 安装依赖
echo "📥 安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi
echo "✅ 依赖安装完成"
echo ""

# 步骤 4: 构建生产版本
echo "🏗️  构建生产版本..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✅ 构建成功"
echo ""

# 步骤 5: 检查 dist 目录
echo "📁 检查构建产物..."
if [ ! -d "dist" ]; then
    echo "❌ dist 目录不存在"
    exit 1
fi

file_count=$(find dist -type f | wc -l)
echo "✅ dist 目录包含 $file_count 个文件"
echo ""

# 步骤 6: 选择部署方式
echo "请选择部署方式:"
echo "1. GitHub Pages (推荐)"
echo "2. Vercel"
echo "3. Netlify"
echo "4. 本地预览"
echo "5. 仅构建不部署"
read -p "请输入选项 (1-5): " deploy_option

case $deploy_option in
    1)
        echo ""
        echo "🚀 部署到 GitHub Pages..."
        
        # 检查是否安装 gh-pages
        if ! command -v gh-pages &> /dev/null; then
            echo "📦 安装 gh-pages..."
            npm install -g gh-pages
        fi
        
        # 部署
        echo "📤 推送 dist 到 gh-pages 分支..."
        gh-pages -d dist
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 部署成功!"
            echo "🌐 访问地址：https://Bluecap666.github.io/RSS/"
            echo ""
            echo "📝 接下来需要:"
            echo "   1. 访问 GitHub 仓库 Settings → Pages"
            echo "   2. 设置 Source 为 gh-pages 分支"
            echo "   3. 等待几分钟即可访问"
        else
            echo "❌ 部署失败"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        echo "🚀 部署到 Vercel..."
        
        # 检查是否安装 vercel
        if ! command -v vercel &> /dev/null; then
            echo "📦 安装 Vercel CLI..."
            npm install -g vercel
        fi
        
        # 部署
        echo "📤 推送到 Vercel..."
        vercel --prod
        ;;
        
    3)
        echo ""
        echo "🚀 部署到 Netlify..."
        
        # 检查是否安装 netlify-cli
        if ! command -v netlify &> /dev/null; then
            echo "📦 安装 Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # 部署
        echo "📤 推送到 Netlify..."
        netlify deploy --prod --dir=dist
        ;;
        
    4)
        echo ""
        echo "🚀 本地预览..."
        
        # 检查是否安装 serve
        if ! command -v serve &> /dev/null; then
            echo "📦 安装 serve..."
            npm install -g serve
        fi
        
        # 启动服务
        echo "🌐 启动本地服务器..."
        echo "访问地址：http://localhost:3000"
        serve dist
        ;;
        
    5)
        echo ""
        echo "✅ 构建完成，未部署"
        echo "📁 构建产物在 dist/ 目录"
        echo ""
        echo "可以手动部署:"
        echo "  - 上传 dist/ 到服务器"
        echo "  - 或使用其他部署工具"
        ;;
        
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║          🎉 部署完成！                ║"
echo "╚═══════════════════════════════════════╝"
echo ""
