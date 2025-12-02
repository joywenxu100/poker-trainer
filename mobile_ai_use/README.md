# 多模型AI对比助手 🤖

一个移动端友好的AI工具，可以同时向Claude、Gemini、DeepSeek三个大模型发送问题，并对比它们的回答。

## ✨ 功能特点

- 📱 **移动端优化**：完全响应式设计，手机、平板、电脑都能完美使用
- 🖼️ **支持图片**：可以上传图片让AI分析（Claude和Gemini支持视觉功能）
- 🚀 **并行请求**：同时向三个模型发送请求，快速获取多个回答
- 💾 **本地存储**：API密钥安全存储在本地浏览器
- 🎨 **精美界面**：现代化的渐变色设计，流畅的动画效果
- ⚡ **即开即用**：无需安装，打开HTML即可使用

## 🚀 快速开始

### 1. 准备API密钥

你需要获取以下三个AI模型的API密钥：

- **Claude (Anthropic)**: https://console.anthropic.com/
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **DeepSeek**: https://platform.deepseek.com/

### 2. 使用方法

1. 用浏览器打开 `index.html` 文件
2. 点击右下角的 ⚙️ 设置按钮
3. 输入你的API密钥（至少填写一个）
4. 点击保存
5. 在输入框输入问题或上传图片
6. 点击"询问所有模型"按钮
7. 等待并查看三个模型的回答

## 📝 使用技巧

### 文字问答
- 直接在输入框输入问题
- 可以使用 `Ctrl + Enter` 快捷键提交
- 支持中英文问答

### 图片分析
- 点击"选择图片"按钮上传图片
- 可以同时输入问题和上传图片
- Claude和Gemini支持图片理解，DeepSeek主要处理文字

### API密钥管理
- API密钥存储在浏览器本地，安全可靠
- 可以只配置一个或多个模型
- 随时可以修改API密钥

## 🔧 技术栈

- **纯前端**：HTML + CSS + JavaScript
- **无依赖**：不需要任何框架或库
- **现代API**：
  - Claude Messages API (支持视觉)
  - Gemini Generative Language API (支持视觉)
  - DeepSeek Chat API

## 📱 支持的模型

### Claude (Anthropic)
- 模型：`claude-3-5-sonnet-20241022`
- 特点：强大的推理能力，支持图片理解
- 官网：https://www.anthropic.com/

### Gemini (Google)
- 模型：`gemini-2.0-flash-exp`
- 特点：快速响应，优秀的多模态能力
- 官网：https://deepmind.google/technologies/gemini/

### DeepSeek
- 模型：`deepseek-chat`
- 特点：强大的中文能力，性价比高
- 官网：https://www.deepseek.com/

## 🛡️ 隐私与安全

- ✅ API密钥只存储在你的浏览器本地
- ✅ 所有请求直接从浏览器发送到AI服务商
- ✅ 不经过任何第三方服务器
- ✅ 代码完全开源，可审查

## ⚠️ 注意事项

1. **API费用**：使用这些API可能产生费用，请查看各服务商的定价
2. **密钥安全**：不要在公共电脑上保存API密钥
3. **网络要求**：需要能访问相应的API服务（可能需要代理）
4. **图片大小**：建议上传的图片不超过5MB

## 🔄 更新日志

### v1.0.0 (2025-12-02)
- ✨ 初始版本发布
- 🎨 实现移动端优化界面
- 🤖 集成Claude、Gemini、DeepSeek三个模型
- 🖼️ 支持图片上传和分析
- 💾 本地API密钥存储

## 📞 反馈与建议

如有问题或建议，欢迎提Issue！

## 📄 开源协议

MIT License

---

**享受多模型AI带来的智慧碰撞！** ✨🚀

