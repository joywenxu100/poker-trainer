#!/bin/bash
# 德州扑克训练师 - 打包脚本
# 一键打包所有文件，方便分享到手机

echo "🎯 开始打包德州扑克训练师..."

# 创建打包目录
mkdir -p poker_trainer_package

# 复制核心文件
echo "📦 复制核心文件..."
cp poker_trainer.html poker_trainer_package/
cp poker_trainer.js poker_trainer_package/
cp manifest.json poker_trainer_package/
cp sw.js poker_trainer_package/
cp index.html poker_trainer_package/
cp TRAINER_GUIDE.md poker_trainer_package/

# 创建使用说明
cat > poker_trainer_package/README.txt << 'EOF'
🎯 德州扑克训练师 - 使用说明

📱 手机使用步骤：

1. 把这个文件夹里的所有文件发送到手机
   （可以打包成ZIP发送）

2. 手机浏览器打开 index.html 或 poker_trainer.html

3. 添加到主屏幕：
   - iPhone: Safari → 分享 → 添加到主屏幕
   - Android: Chrome → 菜单 → 添加到主屏幕

4. 完成！开始训练！

💡 提示：
- 确保所有文件在同一文件夹
- 首次打开需要联网
- 之后离线也能用

🎯 目标：1000次训练形成肌肉记忆！
EOF

echo "✅ 打包完成！"
echo "📁 文件位置: poker_trainer_package/"
echo ""
echo "📱 分享到手机的方法："
echo "1. 压缩 poker_trainer_package 文件夹"
echo "2. 通过微信/QQ/网盘发送到手机"
echo "3. 手机解压后浏览器打开 index.html"
echo ""
echo "🎉 完成！"



