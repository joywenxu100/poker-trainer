# GitHub Token 获取教程（必读）

## 🔑 为什么需要Token？

GitHub已经不支持用密码推送代码了，必须使用 **Personal Access Token**。

---

## 📋 获取Token的步骤（5分钟）

### **第1步：登录GitHub**
1. 打开浏览器
2. 访问：https://github.com
3. 登录你的账号

### **第2步：进入Token设置页**
1. 点击右上角你的头像
2. 点击 **Settings**（设置）
3. 左侧菜单滚动到最下面，点击 **Developer settings**
4. 点击 **Personal access tokens** → **Tokens (classic)**

或者直接访问：https://github.com/settings/tokens

### **第3步：生成新Token**
1. 点击 **Generate new token** → **Generate new token (classic)**
2. 填写信息：
   ```
   Note（备注）: Poker Trainer Upload
   Expiration（有效期）: 90 days（或选择No expiration）
   ```
3. **勾选权限**（非常重要！）：
   ```
   ✅ repo（勾选这个就够了，会自动勾选所有子项）
   ```
4. 滚动到底部，点击 **Generate token**（绿色按钮）

### **第4步：复制并保存Token**
1. 页面会显示一串Token（以 `ghp_` 开头）
2. **立即复制！只显示一次！**
3. 保存到记事本或密码管理器

示例Token格式：
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚠️ 重要提示

### **Token当密码用：**
- 运行脚本时要求输入密码
- **不要输入你的GitHub账号密码**
- **输入刚才复制的Token**

### **Token安全：**
- ✅ 不要分享给任何人
- ✅ 不要提交到代码里
- ✅ 丢失了可以重新生成
- ✅ 不用的可以随时删除

---

## 🚀 我已经准备好的文件

在你的项目文件夹里，我创建了：

```
✅ git_upload.bat       ← 一键上传脚本（Windows）
✅ poker_trainer_v2.js  ← V2.0完整内容
✅ 其他所有必需文件
```

---

## 📝 使用步骤（3步）

### **方法1：双击运行脚本（最简单）**

1. **双击 `git_upload.bat`**
2. 按提示输入：
   - GitHub用户名
   - 仓库名（如果没有，先在GitHub创建）
3. 输入Token（当要求输入密码时）
4. 完成！

### **方法2：手动命令（如果脚本不行）**

我会给你完整的命令清单，一条条复制执行。

---

## ❓ 常见问题

### Q1: 我没有仓库怎么办？
**A**: 先在GitHub创建仓库：
1. 访问：https://github.com/new
2. Repository name: `poker-trainer-pro`
3. 选择 **Public**
4. **不要勾选**任何选项（README、.gitignore等）
5. 点击 **Create repository**

### Q2: Token输入后看不到字符？
**A**: 正常的！密码输入不会显示，直接输入后按回车

### Q3: 推送失败怎么办？
**A**: 截图错误信息给我，我帮你解决

### Q4: 如何查看我的仓库名？
**A**: 
1. 登录GitHub
2. 点击右上角头像 → Your repositories
3. 看到的项目名就是仓库名

---

## 🎯 准备好了吗？

**现在告诉我：**

1. ✅ 我已经获取了Token
2. ✅ 我的GitHub用户名是：`____________`
3. ✅ 我的仓库名是：`____________`（如果没有，我帮你创建）

**然后我会给你精确的命令或者直接运行脚本！** 🚀


