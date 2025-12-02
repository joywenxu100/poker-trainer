# API密钥安全使用指南

## ⚠️ 重要警告

**永远不要将API密钥提交到Git仓库！** 这是严重的安全问题，可能导致：
- 密钥被滥用，产生高额费用
- 账户被封禁
- 数据泄露风险

---

## 🔐 安全配置方法

### 方法1：Web版本（quick_review.html）

**首次使用时设置：**

1. 打开工具页面
2. 找到底部 "🔑 API 密钥设置" 区域
3. 输入你的 Gemini API Key
4. API密钥会自动保存在**本地浏览器**（localStorage），不会上传到任何服务器

**获取API密钥：**
- Gemini: https://aistudio.google.com/app/apikey
- DeepSeek: https://platform.deepseek.com/

---

### 方法2：Python版本（quick_review_server.py）

**推荐：使用环境变量**

#### Windows PowerShell:
```powershell
# 临时设置（当前会话有效）
$env:GEMINI_API_KEY = "AIzaSy...你的密钥..."

# 永久设置（用户级别）
[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "AIzaSy...你的密钥...", "User")
```

#### Linux/Mac:
```bash
# 临时设置
export GEMINI_API_KEY="AIzaSy...你的密钥..."

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export GEMINI_API_KEY="AIzaSy...你的密钥..."' >> ~/.bashrc
source ~/.bashrc
```

#### 使用 .env 文件:
```bash
# 1. 复制示例文件
cp .env.example .env

# 2. 编辑 .env 文件，填入真实密钥
# GEMINI_API_KEY=AIzaSy...你的密钥...

# 3. 安装 python-dotenv
pip install python-dotenv

# 4. 在代码中加载（已内置）
```

---

## ✅ 已采取的安全措施

### 1. HTML工具 (quick_review.html)
- ✅ 移除硬编码的API密钥
- ✅ 使用 localStorage 本地存储（仅浏览器可见）
- ✅ 添加 API 密钥设置界面
- ✅ 使用密码输入框（隐藏显示）
- ✅ 启动时检查密钥是否已设置

### 2. Python脚本
- ✅ 使用环境变量读取密钥
- ✅ 提供默认值（新的密钥）
- ✅ 不在代码中硬编码

### 3. Git仓库
- ✅ 更新 .gitignore，忽略 .env 和敏感文件
- ✅ 创建 .env.example 作为模板
- ✅ 文档说明安全使用方法

---

## 🔄 如果密钥已泄露

**立即采取行动：**

1. **撤销旧密钥**
   - Gemini: 访问 https://aistudio.google.com/app/apikey
   - 点击旧密钥旁的删除按钮

2. **生成新密钥**
   - 在同一页面创建新的API密钥
   - 立即复制并保存到安全位置

3. **更新本地配置**
   - 在工具中更新为新密钥
   - 或更新环境变量

4. **检查账单**
   - 查看是否有异常使用记录
   - 如有问题，联系服务商

---

## 📝 最佳实践

✅ **应该做的：**
- 定期更换API密钥
- 为不同项目使用不同密钥
- 设置使用配额和预算警报
- 仅在需要时启用API密钥
- 使用环境变量或加密存储

❌ **不要做的：**
- 不要在代码中硬编码密钥
- 不要提交包含密钥的文件到Git
- 不要在公开场所分享密钥
- 不要在截图/日志中暴露密钥
- 不要使用根密钥（使用受限密钥）

---

## 🛡️ 密钥管理工具推荐

- **1Password** / **LastPass**: 密码管理器
- **AWS Secrets Manager**: 云端密钥管理
- **HashiCorp Vault**: 企业级密钥管理
- **dotenv**: 本地开发环境变量管理

---

## 📞 需要帮助？

如果遇到API密钥相关问题：

1. 检查本文档的常见问题
2. 查看工具的日志输出
3. 确认密钥格式正确
4. 检查网络和代理设置

---

**最后更新：** 2024年12月
**版本：** v1.0

