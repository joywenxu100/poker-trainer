@echo off
chcp 65001 >nul
echo ========================================
echo    多模型AI对比助手 - GitHub初始化
echo ========================================
echo.

cd /d "%~dp0"

echo 此脚本将帮助你创建新的GitHub仓库并完成初始配置
echo.
echo 请确保你已经：
echo   1. 安装了Git
echo   2. 配置了GitHub账号
echo   3. 在GitHub上创建了新仓库（推荐名称: mobile-ai-assistant）
echo.
pause
echo.

set /p repo_url="请输入你的GitHub仓库地址 (例: https://github.com/username/mobile-ai-assistant.git): "
echo.

echo [1/6] 初始化Git仓库...
if not exist ".git" (
    git init
    echo ✓ Git仓库初始化完成
) else (
    echo ✓ Git仓库已存在
)
echo.

echo [2/6] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin %repo_url%
echo ✓ 远程仓库已配置
echo.

echo [3/6] 添加文件...
git add .
echo ✓ 文件已添加
echo.

echo [4/6] 创建首次提交...
git commit -m "🎉 初始化多模型AI对比助手项目"
echo ✓ 提交已创建
echo.

echo [5/6] 推送到GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败！请检查：
    echo    1. 仓库地址是否正确
    echo    2. 是否有权限推送
    echo    3. 网络连接是否正常
    pause
    exit /b 1
)
echo ✓ 代码已推送
echo.

echo [6/6] 配置GitHub Pages...
echo.
echo 请手动完成以下步骤：
echo.
echo 1. 打开你的GitHub仓库页面
echo 2. 点击 Settings (设置)
echo 3. 在左侧菜单找到 Pages
echo 4. 在 Source 下选择 main 分支
echo 5. 点击 Save (保存)
echo 6. 等待1-2分钟，你的网站就会发布
echo.
echo ========================================
echo ✅ 初始化完成！
echo ========================================
echo.
echo 📱 你的网站地址将是：
echo https://你的用户名.github.io/mobile-ai-assistant/
echo.
echo 🔑 下次更新代码，只需运行 deploy.bat 即可！
echo.
pause

