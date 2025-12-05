# 🚀 GitHub 发布完整指南

> 本文档记录了将德州扑克训练项目推送到 GitHub 并通过 GitHub Pages 发布的完整流程。

---

## 📁 项目信息

| 项目 | 信息 |
|------|------|
| 本地路径 | `D:\user\Texas` |
| GitHub 仓库 | `joywenxu100/poker-trainer` |
| GitHub Pages URL | https://joywenxu100.github.io/poker-trainer/ |
| 默认分支 | `main` |

---

## 🔧 环境配置

### 1. Git 已配置
```powershell
# 检查Git配置
git config --global user.name
git config --global user.email
```

### 2. 远程仓库已关联
```powershell
# 查看远程仓库
git remote -v
# 输出: origin  https://github.com/joywenxu100/poker-trainer.git
```

### 3. GitHub Token 认证
- 已通过 HTTPS 方式认证
- Token 存储在 Windows 凭据管理器中

---

## 📤 标准推送流程

### 方法一：单文件推送
```powershell
# 1. 进入项目目录
cd D:\user\Texas

# 2. 添加单个文件
git add filename.html

# 3. 提交更改
git commit -m "feat: 描述你的更改"

# 4. 推送到远程
git push origin main
```

### 方法二：批量推送
```powershell
# 添加所有HTML文件
git add *.html

# 添加指定类型文件
git add *.js *.css

# 添加所有更改
git add -A

# 提交并推送
git commit -m "feat: 批量更新"
git push origin main
```

### 方法三：一行命令推送
```powershell
# PowerShell 中使用分号分隔命令（不要用 &&）
git add -A; git commit -m "更新描述"; git push origin main
```

---

## 🌐 GitHub Pages 部署

### ⚠️ 重要：使用 GitHub Actions 自动部署

项目已配置 GitHub Actions 工作流，确保所有文件正确部署到 GitHub Pages。

**工作流文件位置**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 为什么需要 GitHub Actions？

1. **解决 404 问题** - 直接分支部署可能导致部分文件 404
2. **自动化部署** - 每次推送自动触发部署
3. **完整文件同步** - 确保所有文件都被正确部署

---

## ✅ 验证页面是否可访问

### PowerShell 命令验证
```powershell
# 单个页面验证
Invoke-WebRequest -Uri "https://joywenxu100.github.io/poker-trainer/index.html" -Method Head -UseBasicParsing | Select-Object StatusCode

# 批量验证多个页面
$files = @("index.html", "deep_stack_lag_master.html", "aggression_control_trainer.html")
foreach ($f in $files) {
    try {
        $r = Invoke-WebRequest -Uri "https://joywenxu100.github.io/poker-trainer/$f" -Method Head -UseBasicParsing -TimeoutSec 10
        Write-Host "✅ $f : $($r.StatusCode)"
    } catch {
        Write-Host "❌ $f : ERROR"
    }
}
```

### 验证 Raw 文件（排除 Pages 问题）
```powershell
# 如果 Pages 返回 404，先检查 Raw 是否存在
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/joywenxu100/poker-trainer/main/filename.html" -Method Head -UseBasicParsing
```

---

## 🔍 常见问题排查

### 问题1：GitHub Pages 返回 404

**症状**: 文件已推送，但访问返回 404

**解决方案**:
1. 确认 `.github/workflows/deploy.yml` 存在
2. 强制触发重新部署：
```powershell
git commit --allow-empty -m "trigger: 强制刷新GitHub Pages"
git push origin main
```
3. 等待 30-60 秒后重试

### 问题2：PowerShell && 语法错误

**症状**: `&& 不是有效的语句分隔符`

**解决方案**: 使用分号 `;` 代替 `&&`
```powershell
# 错误
git add -A && git commit -m "msg" && git push

# 正确
git add -A; git commit -m "msg"; git push origin main
```

### 问题3：推送超时

**症状**: `git push` 长时间无响应

**解决方案**:
1. 检查网络连接
2. 尝试使用 VPN
3. 重试推送命令

### 问题4：API Key 被 GitHub 拦截

**症状**: `GH013: Repository rule violations found`

**解决方案**: 
- 使用 Base64 编码或分段存储敏感信息
- 将敏感文件添加到 `.gitignore`
- 使用环境变量

---

## 📝 提交信息规范

```
类型(范围): 简短描述

类型：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- ci: CI/CD配置
- chore: 其他杂项

示例：
- feat: 添加LAG大师训练系统
- fix: 修复返回按钮链接
- docs: 更新README
- ci: 添加GitHub Actions部署工作流
```

---

## 🏷️ 为新页面添加返回导航按钮

每个子页面都应该有返回主导航的按钮。

### 1. 添加 CSS 样式
```css
.home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #333;
    padding: 10px 20px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: bold;
    font-size: 13px;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    transition: all 0.3s ease;
}

.home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}
```

### 2. 添加 HTML 按钮
```html
<!-- 根目录页面 -->
<a href="index.html" class="home-btn">🏠 返回导航中心</a>

<!-- 子目录页面（如 mobile_ai_use/） -->
<a href="../index.html" class="home-btn">🏠 返回导航中心</a>
```

---

## 📊 检查文件是否有返回按钮

```powershell
# 检查所有HTML文件是否有返回按钮
Get-ChildItem -Path "." -Filter "*.html" | ForEach-Object {
    $file = $_.Name
    $hasBtn = Select-String -Path $_.FullName -Pattern 'home-btn|back-btn|返回导航' -Quiet
    if ($hasBtn) {
        Write-Host "✅ $file"
    } else {
        Write-Host "❌ $file - 缺少返回按钮"
    }
}
```

---

## 🗂️ 项目结构

```
D:\user\Texas\
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── .gitignore                  # Git 忽略文件
├── .nojekyll                   # 禁用 Jekyll 处理
├── index.html                  # 主导航页面
├── mobile_ai_use/              # AI助手子项目
│   ├── index.html
│   └── app.js
├── *.html                      # 各训练模块页面
├── *.js                        # JavaScript 逻辑文件
└── *.md                        # 文档文件
```

---

## 🔄 完整发布流程示例

```powershell
# 1. 进入项目目录
cd D:\user\Texas

# 2. 查看当前状态
git status

# 3. 添加所有更改
git add -A

# 4. 提交更改（使用规范的提交信息）
git commit -m "feat: 添加新的训练模块"

# 5. 推送到远程
git push origin main

# 6. 等待 GitHub Actions 部署（约30-60秒）
Start-Sleep -Seconds 30

# 7. 验证页面可访问
Invoke-WebRequest -Uri "https://joywenxu100.github.io/poker-trainer/" -Method Head -UseBasicParsing | Select-Object StatusCode
```

---

## ⚡ 快速命令参考

| 操作 | 命令 |
|------|------|
| 查看状态 | `git status` |
| 添加所有文件 | `git add -A` |
| 提交更改 | `git commit -m "描述"` |
| 推送到远程 | `git push origin main` |
| 拉取最新代码 | `git pull origin main` |
| 查看远程文件 | `git ls-tree --name-only origin/main` |
| 强制刷新Pages | `git commit --allow-empty -m "trigger rebuild"; git push origin main` |
| 查看提交历史 | `git log --oneline -10` |

---

## 📌 重要提醒

1. **PowerShell 语法**: 使用 `;` 分隔命令，不要用 `&&`
2. **等待部署**: 推送后等待 30-60 秒再验证
3. **返回按钮**: 新页面必须添加返回导航按钮
4. **敏感信息**: 不要直接提交 API Key，使用加密或环境变量
5. **测试文件**: 测试完成后删除 `test_*.html` 等临时文件

---

*文档更新时间: 2025年12月5日*
*适用于: Cursor AI / Claude / GPT 等模型*

