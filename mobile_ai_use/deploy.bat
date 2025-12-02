@echo off
chcp 65001 >nul
echo ========================================
echo    多模型AI对比助手 - GitHub部署脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 检查Git状态...
git status
echo.

echo [2/5] 添加所有文件...
git add .
echo.

echo [3/5] 提交更改...
set /p commit_msg="请输入提交信息 (直接回车使用默认): "
if "%commit_msg%"=="" set commit_msg=更新多模型AI对比助手
git commit -m "%commit_msg%"
echo.

echo [4/5] 推送到GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败！请检查：
    echo    1. 是否已配置远程仓库
    echo    2. 是否有权限推送
    echo    3. 网络连接是否正常
    echo.
    echo 如果还没有创建远程仓库，请执行：
    echo git remote add origin https://github.com/你的用户名/mobile-ai-assistant.git
    pause
    exit /b 1
)
echo.

echo [5/5] 完成！
echo.
echo ✅ 部署成功！
echo.
echo 📱 在线访问地址：
echo https://你的用户名.github.io/mobile-ai-assistant/
echo.
echo 💡 提示：
echo    - 首次部署需要在GitHub仓库设置中启用GitHub Pages
echo    - 选择 main 分支作为发布源
echo    - 等待1-2分钟后即可访问
echo.
pause

