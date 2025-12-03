@echo off
chcp 65001 >nul
cd /d D:\user\Texas

echo 正在推送您的MDF修正...
git add deep_stack_lag_trainer.js
git commit -m "MDF修正v2.3: 45%%防守率(用户修正)" -m "正确计算: Open 2.5BB vs 3-Bet 7.5BB, 底池4BB, Call 5BB, MDF=44%%"
git push origin main

echo.
echo ========================================
echo ✓ MDF修正已推送！
echo.
echo 在线访问：
echo https://joywenxu100.github.io/poker-trainer/deep_stack_lag_trainer.html
echo ========================================
pause

