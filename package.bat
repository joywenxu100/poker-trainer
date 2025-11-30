@echo off
chcp 65001 >nul
echo 🎯 开始打包德州扑克训练师...
echo.

rem 创建打包目录
if not exist poker_trainer_package mkdir poker_trainer_package

rem 复制核心文件
echo 📦 复制核心文件...
copy poker_trainer.html poker_trainer_package\ >nul
copy poker_trainer.js poker_trainer_package\ >nul
copy manifest.json poker_trainer_package\ >nul
copy sw.js poker_trainer_package\ >nul
copy index.html poker_trainer_package\ >nul
copy TRAINER_GUIDE.md poker_trainer_package\ >nul

rem 创建使用说明
echo 🎯 德州扑克训练师 - 使用说明 > poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 📱 手机使用步骤： >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 1. 把这个文件夹里的所有文件发送到手机 >> poker_trainer_package\README.txt
echo    （可以打包成ZIP发送） >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 2. 手机浏览器打开 index.html 或 poker_trainer.html >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 3. 添加到主屏幕： >> poker_trainer_package\README.txt
echo    - iPhone: Safari → 分享 → 添加到主屏幕 >> poker_trainer_package\README.txt
echo    - Android: Chrome → 菜单 → 添加到主屏幕 >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 4. 完成！开始训练！ >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 💡 提示： >> poker_trainer_package\README.txt
echo - 确保所有文件在同一文件夹 >> poker_trainer_package\README.txt
echo - 首次打开需要联网 >> poker_trainer_package\README.txt
echo - 之后离线也能用 >> poker_trainer_package\README.txt
echo. >> poker_trainer_package\README.txt
echo 🎯 目标：1000次训练形成肌肉记忆！ >> poker_trainer_package\README.txt

echo.
echo ✅ 打包完成！
echo 📁 文件位置: poker_trainer_package\
echo.
echo 📱 分享到手机的方法：
echo 1. 右键 poker_trainer_package 文件夹 → 发送到 → 压缩文件
echo 2. 通过微信/QQ/网盘发送到手机
echo 3. 手机解压后浏览器打开 index.html
echo.
echo 🎉 完成！
echo.
pause



