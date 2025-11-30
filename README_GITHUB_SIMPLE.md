# 德州扑克职业训练器 - GitHub部署超简单教程

## 🎯 你现在要做的事情

把你的**德州扑克训练器V2.0**（包含职业级内容）上传到GitHub，这样：
- ✅ 可以在任何手机/电脑上访问
- ✅ 不用每次都传文件
- ✅ 有一个固定网址，随时打开
- ✅ 免费托管，永久可用

---

## 📋 需要上传的文件（已准备好）

这些文件我已经帮你准备好了，在你的项目文件夹里：

```
必需文件：
✅ index.html              ← 入口页面
✅ poker_trainer.html      ← 训练器主页面
✅ poker_trainer.js        ← 基础训练逻辑（26问）
✅ poker_trainer_pro.js    ← 职业级内容（42问）🆕
✅ manifest.json           ← PWA配置
✅ sw.js                   ← 离线支持
✅ README.md               ← 项目说明
```

---

## 🚀 方法1：网页直接上传（最简单，推荐！）

### 步骤1：登录/注册GitHub

1. 打开浏览器，访问：https://github.com
2. 如果没有账号，点击 **Sign up** 注册（免费）
3. 如果有账号，点击 **Sign in** 登录

### 步骤2：创建新仓库（如果你还没有）

1. 登录后，点击右上角 **+** 号
2. 选择 **New repository**
3. 填写信息：
   - **Repository name**：`poker-trainer`（或你喜欢的名字）
   - **Description**：德州扑克职业训练器V2.0
   - **Public**（选这个，免费）
   - ✅ 勾选 **Add a README file**
4. 点击 **Create repository**

### 步骤3：上传文件

1. 在仓库页面，点击 **Add file** → **Upload files**
2. 把这些文件拖进去（从你的项目文件夹）：
   ```
   index.html
   poker_trainer.html
   poker_trainer.js
   poker_trainer_pro.js
   manifest.json
   sw.js
   README.md
   ```
3. 在下面的输入框写：`更新到V2.0版本，新增职业级内容`
4. 点击 **Commit changes**（绿色按钮）

### 步骤4：启用GitHub Pages（让它能在线访问）

1. 在仓库页面，点击 **Settings**（设置）
2. 左侧菜单找到 **Pages**
3. 在 **Source** 下拉菜单选择：**main**（或 **master**）
4. 点击 **Save**
5. 等1-2分钟，页面上方会显示：
   ```
   Your site is published at https://你的用户名.github.io/poker-trainer/
   ```

### 步骤5：访问你的训练器！

1. 点击上面那个网址，或者直接在手机浏览器输入
2. 看到训练器页面 = 成功！🎉
3. 手机上点击"添加到主屏幕"就像App一样用！

---

## 🚀 方法2：GitHub Desktop（图形界面，也很简单）

### 步骤1：下载GitHub Desktop

1. 访问：https://desktop.github.com/
2. 下载并安装
3. 登录你的GitHub账号

### 步骤2：克隆或创建仓库

**如果你已有仓库：**
1. File → Clone repository
2. 选择你的仓库
3. 选择保存位置

**如果你没有仓库：**
1. File → New repository
2. Name: `poker-trainer`
3. Local path: 选择你的项目文件夹
4. 点击 Create repository

### 步骤3：提交更改

1. 左侧会显示所有改动的文件
2. 在下方输入：`更新V2.0，新增职业级内容`
3. 点击 **Commit to main**
4. 点击 **Push origin**（上传到GitHub）

### 步骤4：启用GitHub Pages

（同方法1的步骤4）

---

## 🆘 如果你已经有仓库，只是要更新

### 网页方式更新：

1. 进入你的仓库页面
2. 找到要更新的文件，比如 `poker_trainer_pro.js`
3. 点击文件名进入
4. 点击右上角 **铅笔图标**（编辑）
5. 删除全部内容
6. 从你电脑上复制新内容粘贴进去
7. 滚动到下方，写：`更新职业级内容`
8. 点击 **Commit changes**

**或者直接上传新文件覆盖：**
1. 在仓库首页，点击 **Add file** → **Upload files**
2. 把新文件拖进去（同名文件会自动覆盖）
3. 写说明，点击 Commit

---

## 📱 访问和使用

### 你的训练器网址格式：

```
https://你的GitHub用户名.github.io/仓库名/
```

例如：
```
https://johndoe.github.io/poker-trainer/
```

### 手机使用（PWA）：

1. 手机浏览器打开上面的网址
2. iOS：点击分享按钮 → 添加到主屏幕
3. Android：浏览器菜单 → 添加到主屏幕
4. 像App一样打开，还能离线使用！

---

## ❓ 常见问题

### Q1：找不到 Settings → Pages？
**A**：确保你的仓库是 Public（公开）的，Private仓库需要付费才能用Pages

### Q2：网址打不开？
**A**：等1-2分钟，GitHub需要时间构建。刷新页面看看是否显示"Your site is published"

### Q3：更新了文件，但网页没变？
**A**：清除浏览器缓存，或者按 Ctrl+F5 强制刷新

### Q4：手机上添加到主屏幕，但打开还是浏览器？
**A**：确保 `manifest.json` 和 `sw.js` 都已上传，等几分钟让Service Worker注册

---

## 🎯 需要帮助？

如果遇到任何问题，告诉我：
1. 你在哪一步卡住了
2. 出现了什么错误提示
3. 你的GitHub用户名和仓库名

我会继续帮你解决！

---

**现在开始吧！选择方法1或方法2，我陪你一步步完成！** 🚀


