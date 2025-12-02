# API密钥混淆方案说明

## 🎯 设计目标

1. **开箱即用** - 用户无需配置API密钥，直接使用
2. **源码保护** - 源码中不显示明文密钥，防止随意复制
3. **可自定义** - 用户可以覆盖使用自己的API密钥
4. **透明性** - 明确告知这是混淆而非真正的加密

---

## ⚠️ 重要声明

**这不是真正的加密！**

由于前端JavaScript代码完全暴露给用户，任何"加密"都可以被逆向。本方案只是：
- ✅ 防止在GitHub源码中明文显示
- ✅ 防止普通用户随意复制使用
- ✅ 增加提取密钥的门槛（需要理解代码）
- ❌ 不能防止有技术能力的人提取密钥
- ❌ 不是安全加密方案

**如果你需要真正的安全性，请使用后端API网关。**

---

## 🔧 混淆算法

### 加密流程
```python
import base64

def encrypt_key(plaintext):
    # 步骤1：字符偏移（每个字符位置加上 i % 7 + 1）
    shifted = ''.join(
        chr(ord(c) + (i % 7 + 1)) 
        for i, c in enumerate(plaintext)
    )
    
    # 步骤2：Base64编码
    encoded = base64.b64encode(shifted.encode()).decode()
    
    return encoded
```

### 解密流程
```javascript
function _d(encoded) {
    // 步骤1：Base64解码
    const decoded = atob(encoded);
    
    // 步骤2：字符偏移还原（减去 i % 7 + 1）
    const plaintext = decoded.split('').map((c, i) => 
        String.fromCharCode(c.charCodeAt(0) - (i % 7 + 1))
    ).join('');
    
    return plaintext;
}
```

---

## 📦 实现细节

### 前端 (quick_review.html)

```javascript
// 混淆后的密钥（不是明文）
const _k1 = 'Qkt9ZVh/SU1cdDx6Wm03SE5weEk4YE08WlN3dXNreFxscF9IL2VV';
const _k2 = 'dG0waTlsOTg3O2c6PmsyNjs0PGhqOjIzODo5QGdoZWY1az8=';

// 运行时解密
const CONFIG = {
    GEMINI_API_KEY: localStorage.getItem('GEMINI_API_KEY') || _d(_k1),
    DEEPSEEK_API_KEY: localStorage.getItem('DEEPSEEK_API_KEY') || _d(_k2),
    // ...
};
```

**工作流程：**
1. 优先读取用户自定义密钥（localStorage）
2. 如无自定义，解密内置混淆密钥
3. 用户可随时输入自己的密钥覆盖

### 后端 (quick_review_server.py)

```python
# 混淆后的密钥
_GEMINI_KEY_ENCRYPTED = 'Qkt9ZVh/SU1cdDx6Wm03SE5weEk4YE08WlN3dXNreFxscF9IL2VV'

# 运行时解密
API_KEY = os.environ.get('GEMINI_API_KEY', _decrypt_key(_GEMINI_KEY_ENCRYPTED))
```

**工作流程：**
1. 优先读取环境变量
2. 如无环境变量，解密内置混淆密钥
3. 用户可通过环境变量覆盖

---

## 🔑 当前密钥状态

| 服务 | 状态 | 来源 | 说明 |
|------|------|------|------|
| **Gemini** | 混淆存储 | 新申请密钥 | `AIzaSyBLZq8uTf6FKlsC1_K9VNqnriuXgjXG-bQ` |
| **DeepSeek** | 混淆存储 | 原有密钥 | `sk-e4f2758c58d14807bc9004539ffbb0e8` |

---

## 🛡️ 安全建议

### 对于工具开发者（你）
1. **定期更换内置密钥** - 如发现被滥用，及时更换
2. **设置使用配额** - 在API平台设置每日/每月限额
3. **监控使用情况** - 定期检查API调用量
4. **提供自定义选项** - 鼓励高频用户使用自己的密钥

### 对于用户
1. **小白用户** - 直接使用，无需配置
2. **高频用户** - 建议申请自己的API密钥
3. **企业用户** - 必须使用自己的密钥
4. **开发者** - 可通过环境变量或输入框自定义

---

## 📊 对比其他方案

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **明文存储** | 简单直接 | 容易泄露 | ❌ 不推荐 |
| **Base64编码** | 防止搜索引擎 | 太容易解码 | ⚠️ 不够 |
| **混淆（当前）** | 平衡性好 | 可被逆向 | ✅ 开源工具 |
| **后端代理** | 真正安全 | 需要服务器 | ✅ 商业产品 |
| **用户自备** | 最安全 | 用户门槛高 | ✅ 技术用户 |

---

## 🔄 如何更换内置密钥

如果内置密钥被滥用，按以下步骤更换：

### 1. 生成新的混淆密钥
```python
python -c "
import base64

def encrypt_key(key):
    encrypted = ''.join(chr(ord(c) + (i % 7 + 1)) for i, c in enumerate(key))
    return base64.b64encode(encrypted.encode()).decode()

new_key = 'AIzaSy...你的新密钥...'
print(encrypt_key(new_key))
"
```

### 2. 更新代码
```javascript
// quick_review.html
const _k1 = '新的混淆字符串';
```

```python
# quick_review_server.py
_GEMINI_KEY_ENCRYPTED = '新的混淆字符串'
```

### 3. 提交并推送
```bash
git add quick_review.html quick_review_server.py test_gemini.py
git commit -m "chore: rotate obfuscated API keys"
git push
```

---

## 💡 最佳实践

### 推荐做法 ✅
- 定期检查API使用量
- 为内置密钥设置合理的配额（如每日1000次）
- 在文档中鼓励用户自定义密钥
- 提供清晰的密钥设置指南

### 避免做法 ❌
- 不要声称这是"加密"（只是混淆）
- 不要依赖此方案保护高价值密钥
- 不要在控制台或日志中输出密钥
- 不要将此方案用于生产级商业应用

---

## 🎓 总结

这个混淆方案是**实用主义的折中方案**，适合：
- ✅ 开源工具/个人项目
- ✅ 教育/演示用途
- ✅ 1000万粉丝的工具分享

**不适合：**
- ❌ 需要高安全性的场景
- ❌ 处理敏感数据
- ❌ 商业产品后端

记住：**方便性 vs 安全性** 是一个权衡，本方案选择了方便性。

---

**版本：** v1.0  
**最后更新：** 2024-12-02

