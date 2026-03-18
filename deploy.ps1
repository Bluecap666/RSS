# 🚀 RSS Reader 一键部署脚本 (PowerShell)

Write-Host "╔═══════════════════════════════════════╗"
Write-Host "║     📱 RSS Reader 部署工具           ║"
Write-Host "╚═══════════════════════════════════════╝"
Write-Host ""

# 步骤 1: 检查 Node.js
Write-Host "📦 检查 Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion 已安装" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装，请先安装 Node.js" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 2: 检查 npm
Write-Host "📦 检查 npm..." -ForegroundColor Cyan
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion 已安装" -ForegroundColor Green
} catch {
    Write-Host "❌ npm 未安装" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 3: 安装依赖
Write-Host "📥 安装依赖..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 依赖安装完成" -ForegroundColor Green
Write-Host ""

# 步骤 4: 构建生产版本
Write-Host "🏗️  构建生产版本..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 构建成功" -ForegroundColor Green
Write-Host ""

# 步骤 5: 检查 dist 目录
Write-Host "📁 检查构建产物..." -ForegroundColor Cyan
if (-not (Test-Path "dist")) {
    Write-Host "❌ dist 目录不存在" -ForegroundColor Red
    exit 1
}

$fileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
Write-Host "✅ dist 目录包含 $fileCount 个文件" -ForegroundColor Green
Write-Host ""

# 步骤 6: 选择部署方式
Write-Host "请选择部署方式:" -ForegroundColor Yellow
Write-Host "1. GitHub Pages (推荐)"
Write-Host "2. Vercel"
Write-Host "3. Netlify"
Write-Host "4. 本地预览"
Write-Host "5. 仅构建不部署"
$deployOption = Read-Host "请输入选项 (1-5)"

switch ($deployOption) {
    "1" {
        Write-Host ""
        Write-Host "🚀 部署到 GitHub Pages..." -ForegroundColor Cyan
        
        # 检查是否安装 gh-pages
        if (-not (Get-Command gh-pages -ErrorAction SilentlyContinue)) {
            Write-Host "📦 安装 gh-pages..." -ForegroundColor Yellow
            npm install -g gh-pages
        }
        
        # 部署
        Write-Host "📤 推送 dist 到 gh-pages 分支..." -ForegroundColor Cyan
        gh-pages -d dist
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ 部署成功!" -ForegroundColor Green
            Write-Host "🌐 访问地址：https://Bluecap666.github.io/RSS/" -ForegroundColor Blue
            Write-Host ""
            Write-Host "📝 接下来需要:" -ForegroundColor Yellow
            Write-Host "   1. 访问 GitHub 仓库 Settings → Pages"
            Write-Host "   2. 设置 Source 为 gh-pages 分支"
            Write-Host "   3. 等待几分钟即可访问"
        } else {
            Write-Host "❌ 部署失败" -ForegroundColor Red
            exit 1
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 部署到 Vercel..." -ForegroundColor Cyan
        
        # 检查是否安装 vercel
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "📦 安装 Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        # 部署
        Write-Host "📤 推送到 Vercel..." -ForegroundColor Cyan
        vercel --prod
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 部署到 Netlify..." -ForegroundColor Cyan
        
        # 检查是否安装 netlify-cli
        if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
            Write-Host "📦 安装 Netlify CLI..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }
        
        # 部署
        Write-Host "📤 推送到 Netlify..." -ForegroundColor Cyan
        netlify deploy --prod --dir=dist
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 本地预览..." -ForegroundColor Cyan
        
        # 检查是否安装 serve
        if (-not (Get-Command serve -ErrorAction SilentlyContinue)) {
            Write-Host "📦 安装 serve..." -ForegroundColor Yellow
            npm install -g serve
        }
        
        # 启动服务
        Write-Host "🌐 启动本地服务器..." -ForegroundColor Green
        Write-Host "访问地址：http://localhost:3000" -ForegroundColor Blue
        serve dist
    }
    
    "5" {
        Write-Host ""
        Write-Host "✅ 构建完成，未部署" -ForegroundColor Green
        Write-Host "📁 构建产物在 dist/ 目录" -ForegroundColor Blue
        Write-Host ""
        Write-Host "可以手动部署:" -ForegroundColor Yellow
        Write-Host "  - 上传 dist/ 到服务器"
        Write-Host "  - 或使用其他部署工具"
    }
    
    default {
        Write-Host "❌ 无效选项" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          🎉 部署完成！                ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
